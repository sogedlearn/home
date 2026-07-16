const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const router = express.Router();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const geminiApiKey = process.env.GOOGLE_GEMINI_API_KEY;
const genAI = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;

const SOGGY_SYSTEM_PROMPT = `You are a cultural expert agent for the Guna people, Madugandí, Wargandí, and Guna Yala. Your goal is to assist the user in their learning, explaining cultural meanings, answering questions about SOGED lessons, and acting as a pedagogical mentor. Always maintain a kind, educational, and professional tone. Respond in English unless the user writes in Spanish.

You have awareness of the user's learning progress including their level, Ogods balance, Burdas (lives), completed lessons, recent cultural readings, and games played. Use this context to give personalized hints about Memory Match, Mola Puzzle, Word Search, and cultural readings.`;

function buildContextPrompt(context = {}) {
    const parts = [];
    if (context.level) parts.push(`Current level: ${context.level}`);
    if (context.ogods != null) parts.push(`Ogods balance: ${context.ogods}`);
    if (context.burdas != null) parts.push(`Burdas (lives): ${context.burdas}`);
    if (context.completedLessons != null) parts.push(`Lessons completed: ${context.completedLessons}`);
    if (context.lastReading && context.lastReading !== 'none') parts.push(`Last reading: ${context.lastReading}`);
    if (context.lastGame && context.lastGame !== 'none') parts.push(`Last game played: ${context.lastGame}`);
    if (context.currentSection) parts.push(`Current section: ${context.currentSection}`);

    if (!parts.length) return '';
    return `\n\n[User Learning Context]\n${parts.join('\n')}`;
}

async function fetchChatHistory(userId, limit = 10) {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('chat_history')
        .select('user_message, ai_response, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching chat history:', error);
        return [];
    }

    return (data || []).reverse();
}

function toGeminiHistory(historyData) {
    const messageHistory = [];
    historyData.forEach(entry => {
        messageHistory.push({ role: 'user', parts: [{ text: entry.user_message }] });
        messageHistory.push({ role: 'model', parts: [{ text: entry.ai_response }] });
    });
    return messageHistory;
}

async function saveChatExchange(userId, userMessage, aiResponse) {
    if (!supabase) return;

    const { error } = await supabase.from('chat_history').insert({
        user_id: userId,
        user_message: userMessage,
        ai_response: aiResponse,
        created_at: new Date().toISOString()
    });

    if (error) console.error('Error saving chat history:', error);
}

// POST /api/chat — supports JSON response or SSE streaming
router.post('/', async (req, res) => {
    try {
        const { user_id, message, stream, context } = req.body;

        if (!user_id || !message) {
            return res.status(400).json({ error: 'user_id and message are required' });
        }

        if (!genAI) {
            return res.status(503).json({ error: 'Gemini API not configured' });
        }

        const historyData = await fetchChatHistory(user_id, 10);
        const messageHistory = toGeminiHistory(historyData);
        const contextBlock = buildContextPrompt(context);
        const enrichedMessage = message + contextBlock;

        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            systemInstruction: SOGGY_SYSTEM_PROMPT
        });

        const chat = model.startChat({ history: messageHistory });

        if (stream) {
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');

            const result = await chat.sendMessageStream(enrichedMessage);
            let fullText = '';

            for await (const chunk of result.stream) {
                const text = chunk.text();
                if (text) {
                    fullText += text;
                    res.write(`data: ${JSON.stringify({ chunk: text })}\n\n`);
                }
            }

            await saveChatExchange(user_id, message, fullText);
            res.write(`data: ${JSON.stringify({ done: true, response: fullText })}\n\n`);
            res.end();
            return;
        }

        const result = await chat.sendMessage(enrichedMessage);
        const aiResponseText = result.response.text();

        await saveChatExchange(user_id, message, aiResponseText);

        res.json({
            success: true,
            response: aiResponseText,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error in chat API:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Internal server error', message: error.message });
        }
    }
});

module.exports = router;
