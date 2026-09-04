/**
 * Guna AI Tutor — Interactive learning assistant with TTS/STT
 */
class GunaAiTutor extends HTMLElement {
    constructor() {
        super();
        this.course = this.getAttribute('course') || 'guna';
        this.messages = [];
        this.context = { lastTopic: null, quizActive: false, quizAnswer: null };
        this.speechEnabled = true;
        this.recognition = null;
        this.isListening = false;
        this.isStreaming = false;
    }

    connectedCallback() {
        this.loadHistory();
        this.render();
        if (!this.messages.length) this.addWelcomeMessage();
        else this.renderMessages();
        this.bindEvents();
        this.initSpeechRecognition();
        localStorage.setItem('guna_ai_used', '1');
        if (typeof GunaGamification !== 'undefined') GunaGamification.checkAllBadges();
    }

    loadHistory() {
        try {
            const saved = JSON.parse(localStorage.getItem('guna_ai_chat_history') || '[]');
            if (Array.isArray(saved)) this.messages = saved.slice(-20);
        } catch { this.messages = []; }
    }

    saveHistory() {
        localStorage.setItem('guna_ai_chat_history', JSON.stringify(this.messages.slice(-20)));
        localStorage.setItem('guna_ai_messages', String(this.messages.filter(m => m.role === 'user').length));
        if (typeof GunaGamification !== 'undefined') GunaGamification.checkAllBadges();
    }

    getCourseName() {
        const names = { guna: 'Guna', ngabe: 'Ngäbe', embera: 'Emberá', naso: 'Naso' };
        return names[this.course] || 'Indigenous';
    }

    addWelcomeMessage() {
        this.addMessage('ai', `Naa! I'm Soggy, your Guna learning agent.\n\nAsk me a word, try a mini quiz, or practice a greeting. I can also talk about molas and Guna Yala.\n\nYour progress stays with me, so I can coach you on the path.`);
    }

    render() {
        this.innerHTML = `
            <div class="ai-tutor-section soggy-chat-section">
                <div class="ai-tutor-header">
                    <div class="ai-tutor-avatar" aria-hidden="true"><img src="../../Multimedia/Images/Soged/Soggy IA.jpg" alt="Soggy Tutor" class="ai-tutor-avatar-img"></div>
                    <div>
                        <h2 class="ai-tutor-title">${typeof GunaI18n !== 'undefined' ? GunaI18n.t('chat') : 'Soggy Tutor'}</h2>
                        <p class="ai-tutor-subtitle">${typeof GunaI18n !== 'undefined' ? GunaI18n.t('tutorSubtitle', { name: this.getCourseName() }) : `Your personal ${this.getCourseName()} language assistant`}</p>
                    </div>
                    <div class="ai-tutor-controls">
                        <button type="button" id="aiToggleSpeech" class="ai-ctrl-btn" title="Toggle text-to-speech" aria-label="Toggle speech">
                            <i class="fas fa-volume-up"></i>
                        </button>
                        <div class="ai-tutor-status"><i class="fas fa-circle"></i> ${typeof GunaI18n !== 'undefined' ? GunaI18n.t('online') : 'Online'} · Agent</div>
                    </div>
                </div>

                <div class="ai-tutor-chat" id="aiChatMessages" role="log" aria-live="polite" aria-label="Chat messages"></div>

                <div class="ai-tutor-input-area">
                    <div class="ai-tutor-suggestions" role="group" aria-label="Suggested questions">
                        <button type="button" class="ai-suggestion" data-prompt="How do I say hello in Guna?">${typeof GunaI18n !== 'undefined' ? GunaI18n.t('sayHello') : 'Say hello'}</button>
                        <button type="button" class="ai-suggestion" data-prompt="Tell me about Guna molas and their meaning">${typeof GunaI18n !== 'undefined' ? GunaI18n.t('aboutMolas') : 'About molas'}</button>
                        <button type="button" class="ai-suggestion" data-prompt="Give me a mini quiz on family words">${typeof GunaI18n !== 'undefined' ? GunaI18n.t('miniQuiz') : 'Mini quiz'}</button>
                        <button type="button" class="ai-suggestion" data-prompt="Practice a short conversation greeting someone">${typeof GunaI18n !== 'undefined' ? GunaI18n.t('practiceConversation') : 'Practice conversation'}</button>
                    </div>
                    <div class="ai-tutor-input-row">
                        <button type="button" id="aiMicBtn" class="ai-mic-btn" aria-label="Speak to Soggy Tutor" title="Voice input">
                            <i class="fas fa-microphone"></i>
                        </button>
                        <textarea id="aiChatInput" rows="2" placeholder="${typeof GunaI18n !== 'undefined' ? GunaI18n.t('tutorPlaceholder', { name: this.getCourseName() }) : `Ask about ${this.getCourseName()} language, culture, or pronunciation...`}" aria-label="Message to Soggy Tutor"></textarea>
                        <button type="button" id="aiChatSend" class="ai-send-btn" aria-label="Send message">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                    <p class="ai-input-hint" id="aiMicStatus" aria-live="polite"></p>
                </div>
            </div>
        `;
    }

    renderMessages() {
        const container = this.querySelector('#aiChatMessages');
        if (!container) return;
        container.innerHTML = '';
        this.messages.forEach(m => this.appendMessageBubble(m.role, m.text, false));
        container.scrollTop = container.scrollHeight;
    }

    initSpeechRecognition() {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) return;
        this.recognition = new SR();
        this.recognition.lang = 'en-US';
        this.recognition.interimResults = false;
        this.recognition.onresult = (e) => {
            const text = e.results[0][0].transcript;
            const input = this.querySelector('#aiChatInput');
            if (input) input.value = text;
            this.setMicStatus('');
            this.handleSend();
        };
        this.recognition.onerror = () => this.setMicStatus('Voice input unavailable. Type your message instead.');
        this.recognition.onend = () => { this.isListening = false; this.updateMicBtn(); };
    }

    setMicStatus(msg) {
        const el = this.querySelector('#aiMicStatus');
        if (el) el.textContent = msg;
    }

    updateMicBtn() {
        const btn = this.querySelector('#aiMicBtn');
        if (btn) btn.classList.toggle('listening', this.isListening);
    }

    toggleListen() {
        if (!this.recognition) {
            this.setMicStatus('Speech recognition is not supported in this browser.');
            return;
        }
        if (this.isListening) {
            this.recognition.stop();
            this.isListening = false;
        } else {
            this.isListening = true;
            this.setMicStatus('Listening… speak now');
            this.updateMicBtn();
            this.recognition.start();
        }
    }

    speak(text) {
        if (!this.speechEnabled || !window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const clean = text.replace(/[•✓🥥🏝️🤖🧵📜🗺️]/g, '').replace(/\n+/g, '. ');
        const u = new SpeechSynthesisUtterance(clean);
        u.lang = 'en-US';
        u.rate = 0.9;
        window.speechSynthesis.speak(u);
    }

    bindEvents() {
        const input = this.querySelector('#aiChatInput');
        const sendBtn = this.querySelector('#aiChatSend');
        const micBtn = this.querySelector('#aiMicBtn');
        const speechBtn = this.querySelector('#aiToggleSpeech');

        sendBtn?.addEventListener('click', () => this.handleSend());
        micBtn?.addEventListener('click', () => this.toggleListen());
        speechBtn?.addEventListener('click', () => {
            this.speechEnabled = !this.speechEnabled;
            speechBtn.querySelector('i').className = this.speechEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
        });

        input?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.handleSend(); }
        });

        this.querySelectorAll('.ai-suggestion').forEach(btn => {
            btn.addEventListener('click', () => {
                if (input) input.value = btn.dataset.prompt;
                this.handleSend();
            });
        });
    }

    async handleSend() {
        const input = this.querySelector('#aiChatInput');
        const text = input?.value?.trim();
        if (!text || this.isStreaming) return;

        this.addMessage('user', text);
        if (input) input.value = '';

        this.showThinking();
        const userId = typeof HubFlow !== 'undefined' ? await HubFlow.getUserId() : 'guest';
        const context = typeof HubFlow !== 'undefined'
            ? { ...HubFlow.getUserContext(), currentSection: 'chat' }
            : {};
        const localReply = typeof SoggyAgent !== 'undefined'
            ? SoggyAgent.reply(text, { context, course: this.course })
            : this.generateResponse(text);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, message: text, stream: true, context })
            });

            this.hideThinking();

            if (!response.ok) {
                this.addMessage('ai', localReply);
                this.speak(localReply);
                return;
            }

            const contentType = response.headers.get('content-type') || '';
            if (contentType.includes('text/event-stream')) {
                await this.handleStreamResponse(response);
            } else {
                const data = await response.json();
                const reply = data.response || localReply;
                this.addMessage('ai', reply);
                this.speak(reply);
            }
        } catch (err) {
            this.hideThinking();
            this.addMessage('ai', localReply);
            this.speak(localReply);
        }
    }

    async handleStreamResponse(response) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullText = '';
        this.isStreaming = true;

        const bubbleEl = this.createStreamingBubble();
        const bubbleContent = bubbleEl.querySelector('.ai-msg-bubble');

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');

            for (const line of lines) {
                if (!line.startsWith('data: ')) continue;
                try {
                    const data = JSON.parse(line.slice(6));
                    if (data.chunk) {
                        fullText += data.chunk;
                        bubbleContent.innerHTML = this.escapeHtml(fullText);
                        bubbleContent.classList.add('streaming');
                        const container = this.querySelector('#aiChatMessages');
                        if (container) container.scrollTop = container.scrollHeight;
                    }
                    if (data.done) {
                        fullText = data.response || fullText;
                    }
                } catch { /* skip malformed SSE */ }
            }
        }

        bubbleContent.classList.remove('streaming');
        const speakBtn = document.createElement('button');
        speakBtn.type = 'button';
        speakBtn.className = 'ai-msg-speak';
        speakBtn.setAttribute('aria-label', 'Listen to response');
        speakBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        speakBtn.addEventListener('click', () => this.speak(fullText));
        bubbleContent.appendChild(speakBtn);

        this.messages.push({ role: 'ai', text: fullText, time: Date.now() });
        this.saveHistory();
        this.isStreaming = false;
        this.speak(fullText);
    }

    createStreamingBubble() {
        const container = this.querySelector('#aiChatMessages');
        const el = document.createElement('div');
        el.className = 'ai-msg ai-msg--ai';
        el.innerHTML = `
            <div class="ai-msg-avatar" aria-hidden="true"><img src="../../Multimedia/Images/Soged/Soggy IA.jpg" alt="Soggy Tutor" class="ai-msg-avatar-img"></div>
            <div class="ai-msg-bubble streaming"></div>
        `;
        container.appendChild(el);
        container.scrollTop = container.scrollHeight;
        return el;
    }

    showThinking() {
        const container = this.querySelector('#aiChatMessages');
        const el = document.createElement('div');
        el.className = 'ai-msg ai-msg--typing';
        el.id = 'aiTypingIndicator';
        el.innerHTML = `
            <div class="ai-msg-avatar" aria-hidden="true"><img src="../../Multimedia/Images/Soged/Soggy IA.jpg" alt="Soggy Tutor" class="ai-msg-avatar-img"></div>
            <div class="soggy-thinking">
                Soggy is thinking...
                <span class="thinking-dots"><span></span><span></span><span></span></span>
            </div>
        `;
        container.appendChild(el);
        container.scrollTop = container.scrollHeight;
    }

    hideThinking() {
        this.querySelector('#aiTypingIndicator')?.remove();
    }

    showTyping() {
        this.showThinking();
    }

    addMessage(role, text) {
        this.messages.push({ role, text, time: Date.now() });
        this.saveHistory();
        this.appendMessageBubble(role, text, true);
    }

    appendMessageBubble(role, text, scroll) {
        const container = this.querySelector('#aiChatMessages');
        if (!container) return;
        const el = document.createElement('div');
        el.className = `ai-msg ai-msg--${role}`;
        const avatar = role === 'ai' ? '<img src="../../Multimedia/Images/Soged/Soggy IA.jpg" alt="Soggy Tutor" class="ai-msg-avatar-img">' : '🧑‍🎓';
        const speakBtn = role === 'ai' ? `<button type="button" class="ai-msg-speak" aria-label="Listen to response"><i class="fas fa-volume-up"></i></button>` : '';
        el.innerHTML = `
            <div class="ai-msg-avatar" aria-hidden="true">${avatar}</div>
            <div class="ai-msg-bubble">${this.escapeHtml(text)}${speakBtn}</div>
        `;
        el.querySelector('.ai-msg-speak')?.addEventListener('click', () => this.speak(text));
        container.appendChild(el);
        if (scroll) container.scrollTop = container.scrollHeight;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML.replace(/\n/g, '<br>');
    }

    generateResponse(input) {
        const q = input.toLowerCase().trim();

        if (this.context.quizActive) {
            const correct = this.context.quizAnswer;
            if (q.includes(correct) || q === correct) {
                this.context.quizActive = false;
                return `Excellent! "${correct}" is correct.\n\nNana means mother in Guna — one of the most important words in Guna family vocabulary. Mothers and grandmothers (Muú) are central figures in community life and mola traditions.\n\nWould you like another quiz, or shall we practice a greeting conversation?`;
            }
            this.context.quizActive = false;
            return `Not quite — the answer was "${correct}" (mother). Don't worry, learning takes practice!\n\nRemember: Nana = Mother, Baba = Father, Muú = Grandmother, Tata = Grandfather.\n\nWant to try a conversation practice or explore more family words?`;
        }

        if (/quiz|test me|challenge/.test(q)) {
            this.context.quizActive = true;
            this.context.quizAnswer = 'nana';
            this.context.lastTopic = 'quiz';
            return `Great! Here's a mini quiz:\n\nWhat is the Guna word for "mother"?\n\nHint: It starts with "N" and is a very common family word.\n\nType your answer below!`;
        }

        if (/conversation|dialogue|practice talking|roleplay/.test(q)) {
            this.context.lastTopic = 'conversation';
            return `Let's practice a short greeting conversation!\n\nScene: You arrive at a Guna island community.\n\nPerson A: "Naa" (Hello!)\nYou can reply: "Naa" or "Eye" (Yes)\nPerson A: "Deggidde?" (How are you?)\nYou: "Nued" (Thank you)\nPerson A: "Deggimalo" (Goodbye)\nYou: "Bannemalo" (See you tomorrow)\n\nCultural note: Greetings in Guna Yala often include asking how someone is after a journey.\n\nWould you like me to quiz you on these phrases, or explain any word in more detail?`;
        }

        if (/hello|hi|hola|anna|greeting|saludo/.test(q)) {
            this.context.lastTopic = 'greetings';
            return `In Guna (Dulegaya), greetings are warm and community-oriented:\n\n• Naa — Hello\n• Deggidde — How are you\n• Deggimalo — Goodbye\n• Bannemalo — See you tomorrow\n• Eye — Yes\n• Suli — No\n• Nued — Thank you\n• Be — You\n\nCultural context: On the islands of Guna Yala, greetings often acknowledge the person's presence after a canoe journey. Elders are greeted with particular respect.\n\nFollow-up: Would you like to practice pronunciation, or learn family words like Nana (Mother) and Baba (Father)?`;
        }

        if (/mola|textile|tejido|museum|museo/.test(q)) {
            this.context.lastTopic = 'molas';
            return `Molas are one of the most celebrated art forms of the Guna people — reverse-appliqué textiles created primarily by Guna women.\n\nEach design carries meaning:\n• Animals represent spiritual connections to nature\n• Geometric patterns reflect cosmic order\n• Scenes tell stories of daily life and legends\n\nMolas are not just decoration — they are identity, resistance, and cultural memory. After the 1925 Tule Revolution, traditional dress including molas became a symbol of autonomy.\n\nYou can view beautiful mola images throughout SOGED (with attribution to the Museo de la Mola). Visit https://museodelamola.org/ to learn more.\n\nWould you like vocabulary related to molas, or shall I tell you about the Tule Revolution?`;
        }

        if (/coconut|ogob|coco|comida|food|masi/.test(q)) {
            this.context.lastTopic = 'food';
            return `Ogob means coconut in Guna! 🥥\n\nCoconut is fundamental to island life:\n• Food: coconut rice, coconut fish dishes\n• Economy: harvesting and trade\n• Daily life: oil, water, and building materials\n\nIn SOGED, you earn virtual Oggob as rewards while learning — spend them in the Guna Store!\n\nRelated words:\n• Masi — Food\n• Oba — Corn\n• Agu — Onion\n• Sabbidurba — Fruits\n• Masdued — To cook\n\nWant a mini quiz on food words, or shall we continue with ${this.context.lastTopic || 'another topic'}?`;
        }

        if (/family|nana|tata|mother|father|familia/.test(q)) {
            this.context.lastTopic = 'family';
            return `Family vocabulary is essential in Guna — family and elders anchor community life:\n\n• Nana — Mother\n• Baba — Father\n• Tata — Grandfather\n• Muú — Grandmother\n• Gilor — Uncle\n• Ammor — Aunt\n• Niga — Nephew\n• Anai — Friend\n• Ome — Woman\n• Massered — Man\n\nCultural note: Grandmothers (Muú) traditionally pass down mola knowledge and oral histories to younger generations.\n\nFollow-up: Ask me for a family word quiz, or practice saying Nana and Baba!`;
        }

        if (/grammar|sentence|structure|how to say/.test(q)) {
            return `Guna grammar basics:\n\n1. Word order is often Subject-Verb-Object, but flexible in conversation.\n2. Pronoun: Be (You)\n3. Questions: Bia (Where?), Doa (Who?), Ingua (When?)\n4. Affirmation: Eye (Yes), Suli (No)\n\nUseful replies:\n• Nued — Thank you\n• Bassuli — It doesn't matter\n• Nueditosa — It was understood\n\nMistake tip: Don't confuse Deggimalo (goodbye) with Bannemalo (see you tomorrow) — both are farewells but used differently.\n\nWhat sentence would you like help building?`;
        }

        if (/water|dii|house|nega|vocab|word|dictionary|mean/.test(q)) {
            this.context.lastTopic = 'vocabulary';
            return `Here's useful Guna vocabulary:\n\nNature & home:\n• Dii — Water\n• Nega — House / home\n• Urgo — Wood\n• Olli — Clay\n\nAnimals:\n• Yaug — Turtle\n• Suga — Crab\n• Nali — Shark\n• Sussua — Butterfly\n\nDaily life:\n• Ogob — Coconut\n• Masi — Food\n• Mola — Women's blouse\n\nVisit the Vocabulary section for flashcards, practice modes, and native audio!\n\nWhich category interests you — animals, family, food, or nature?`;
        }

        if (/culture|historia|history|revolution|tule|1925|guna yala|territory/.test(q)) {
            this.context.lastTopic = 'history';
            return `The Guna people have a rich history of resilience and self-governance:\n\n• Guna Yala: Autonomous indigenous territory on Panama's Caribbean coast (360+ islands)\n• 1925 Tule Revolution: The Guna rose up to defend their language, dress, and political autonomy\n• Madugandí & Wargandí: Mainland comarcas where Guna communities also live\n\nSpiritual leaders:\n• Ibeorgun — Creator who established harmony between humans and nature\n• Kantule — Ancestral sage of medicine and community values\n• Saglas — Traditional leaders who guide community congresses\n\nExplore the Culture Center map for interactive territory information!\n\nWould you like to learn history vocabulary, or practice phrases about community life?`;
        }

        if (/pronounc|speak|audio|listen|sound/.test(q)) {
            return `Pronunciation tips for Guna:\n\n• Vowels are generally short and clear\n• Stress is often on the first syllable: NA-na, BA-ba, O-gob\n• Use the 🔊 buttons to hear native recordings of each word\n\nTry repeating: "Naa" (hello), "Nana" (mother), "Ogob" (coconut).\n\nWant me to read a word aloud? Type any Guna word!`;
        }

        if (/correct|mistake|wrong|error/.test(q) && this.context.lastTopic) {
            return `I'm happy to help correct your ${this.context.lastTopic} practice!\n\nType the Guna phrase you tried, and I'll let you know if it's correct and suggest improvements.\n\nRemember: making mistakes is part of learning — every error brings you closer to fluency. Eye (yes)!`;
        }

        if (/help|what can/.test(q)) {
            return `I can help you with:\n\n✓ Guna greetings and everyday phrases\n✓ Vocabulary (family, animals, food, nature)\n✓ Grammar and sentence building\n✓ Mola culture and Guna history\n✓ Pronunciation (listen via speaker buttons)\n✓ Mini quizzes and conversation practice\n✓ Voice input — tap the microphone!\n\nTry: "Give me a mini quiz" or "Practice a conversation"\n\nWhat topic shall we explore?`;
        }

        if (/thank|gracias|bye|goodbye|malo/.test(q)) {
            return `You're welcome! Remember:\n• Deggimalo — Goodbye\n• Bannemalo — See you tomorrow\n• Nued — Thank you\n\nEvery word you learn honors Guna heritage. Keep practicing on the Learning Path and visit the Culture Center to deepen your understanding.\n\nNaa — See you next time! 🏝️`;
        }

        const followUp = this.context.lastTopic
            ? `\n\nSince we were discussing ${this.context.lastTopic}, would you like to go deeper into that topic, try a quiz, or explore something new?`
            : '\n\nTry asking about greetings, molas, family words, or say "give me a mini quiz"!';

        return `That's a thoughtful question about ${this.getCourseName()}!${followUp}\n\nFor specific words, ask "What does [word] mean?" For cultural topics, try "Tell me about Guna history" or "Explain molas."\n\nQuick reminder: Naa means Hello in Guna — a great word to start any conversation.`;
    }
}

customElements.define('guna-ai-tutor', GunaAiTutor);
