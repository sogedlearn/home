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
        this.addMessage('ai', `Welcome! I'm your ${this.getCourseName()} Soggy Tutor — here to help you learn Dulegaya (the Guna language) and explore Guna culture.\n\nI can help you with:\n• Vocabulary and pronunciation\n• Grammar and sentence patterns\n• Cultural context (molas, history, territory)\n• Practice conversations and mini quizzes\n\nTry asking "How do I say hello?" or tap the microphone to speak!\n\nWhat would you like to explore today?`);
    }

    render() {
        this.innerHTML = `
            <div class="ai-tutor-section">
                <div class="ai-tutor-header">
                    <div class="ai-tutor-avatar" aria-hidden="true"><img src="../../Images/Soged/Soggy IA.jpg" alt="Soggy Tutor" class="ai-tutor-avatar-img"></div>
                    <div>
                        <h2 class="ai-tutor-title">Soggy Tutor</h2>
                        <p class="ai-tutor-subtitle">Your personal ${this.getCourseName()} language assistant</p>
                    </div>
                    <div class="ai-tutor-controls">
                        <button type="button" id="aiToggleSpeech" class="ai-ctrl-btn" title="Toggle text-to-speech" aria-label="Toggle speech">
                            <i class="fas fa-volume-up"></i>
                        </button>
                        <div class="ai-tutor-status"><i class="fas fa-circle"></i> Online</div>
                    </div>
                </div>

                <div class="ai-tutor-chat" id="aiChatMessages" role="log" aria-live="polite" aria-label="Chat messages"></div>

                <div class="ai-tutor-input-area">
                    <div class="ai-tutor-suggestions" role="group" aria-label="Suggested questions">
                        <button type="button" class="ai-suggestion" data-prompt="How do I say hello in Guna?">Say hello</button>
                        <button type="button" class="ai-suggestion" data-prompt="Tell me about Guna molas and their meaning">About molas</button>
                        <button type="button" class="ai-suggestion" data-prompt="Give me a mini quiz on family words">Mini quiz</button>
                        <button type="button" class="ai-suggestion" data-prompt="Practice a short conversation greeting someone">Practice conversation</button>
                    </div>
                    <div class="ai-tutor-input-row">
                        <button type="button" id="aiMicBtn" class="ai-mic-btn" aria-label="Speak to Soggy Tutor" title="Voice input">
                            <i class="fas fa-microphone"></i>
                        </button>
                        <textarea id="aiChatInput" rows="2" placeholder="Ask about ${this.getCourseName()} language, culture, or pronunciation..." aria-label="Message to Soggy Tutor"></textarea>
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

    handleSend() {
        const input = this.querySelector('#aiChatInput');
        const text = input?.value?.trim();
        if (!text) return;

        this.addMessage('user', text);
        if (input) input.value = '';

        this.showTyping();
        const delay = 500 + Math.min(text.length * 8, 1200);
        setTimeout(() => {
            this.hideTyping();
            const response = this.generateResponse(text);
            this.addMessage('ai', response);
            this.speak(response);
        }, delay);
    }

    showTyping() {
        const container = this.querySelector('#aiChatMessages');
        const el = document.createElement('div');
        el.className = 'ai-msg ai-msg--typing';
        el.id = 'aiTypingIndicator';
        el.innerHTML = `<div class="ai-msg-avatar" aria-hidden="true"><img src="../../Images/Soged/Soggy IA.jpg" alt="Soggy Tutor" class="ai-msg-avatar-img"></div><div class="ai-msg-bubble ai-typing"><span></span><span></span><span></span></div>`;
        container.appendChild(el);
        container.scrollTop = container.scrollHeight;
    }

    hideTyping() {
        this.querySelector('#aiTypingIndicator')?.remove();
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
        const avatar = role === 'ai' ? '<img src="../../Images/Soged/Soggy IA.jpg" alt="Soggy Tutor" class="ai-msg-avatar-img">' : '🧑‍🎓';
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
                return `Excellent! "${correct}" is correct.\n\nNana means mother in Guna — one of the most important words in Guna family vocabulary. Mothers and grandmothers (Dada) are central figures in community life and mola traditions.\n\nWould you like another quiz, or shall we practice a greeting conversation?`;
            }
            this.context.quizActive = false;
            return `Not quite — the answer was "${correct}" (mother). Don't worry, learning takes practice!\n\nRemember: Nana = Mother, Tata = Father, Dada = Grandmother, Bab = Grandfather.\n\nWant to try a conversation practice or explore more family words?`;
        }

        if (/quiz|test me|challenge/.test(q)) {
            this.context.quizActive = true;
            this.context.quizAnswer = 'nana';
            this.context.lastTopic = 'quiz';
            return `Great! Here's a mini quiz:\n\nWhat is the Guna word for "mother"?\n\nHint: It starts with "N" and is a very common family word.\n\nType your answer below!`;
        }

        if (/conversation|dialogue|practice talking|roleplay/.test(q)) {
            this.context.lastTopic = 'conversation';
            return `Let's practice a short greeting conversation!\n\nScene: You arrive at a Guna island community.\n\nPerson A: "¡ anna !" (Hello!)\nYou can reply: "¡ anna !" or "Eye, anna" (Yes, hello)\nPerson A: "Be an mar?" (Are you here?)\nYou: "Eye, na an mar" (Yes, I am here)\nPerson A: "degi malo" (Goodbye)\nYou: "¡ banmalo !" (See you tomorrow)\n\nCultural note: Greetings in Guna Yala often include asking if someone has arrived safely — the sea journey is part of daily life.\n\nWould you like me to quiz you on these phrases, or explain any word in more detail?`;
        }

        if (/hello|hi|hola|anna|greeting|saludo/.test(q)) {
            this.context.lastTopic = 'greetings';
            return `In Guna (Dulegaya), greetings are warm and community-oriented:\n\n• ¡ anna ! — Hello (most common)\n• ¡ naa ! — Hi (informal)\n• ¡ degidde ! — Hello (variant)\n• degi malo — Goodbye\n• ¡ banmalo ! — See you tomorrow\n• Eye — Yes\n• Degii — That's right / Exactly\n\nCultural context: On the islands of Guna Yala, greetings often acknowledge the person's presence after a canoe journey. Elders are greeted with particular respect.\n\nFollow-up: Would you like to practice pronunciation, or learn how to introduce yourself with "Na" (I) and "Be" (You)?`;
        }

        if (/mola|textile|tejido|museum|museo/.test(q)) {
            this.context.lastTopic = 'molas';
            return `Molas are one of the most celebrated art forms of the Guna people — reverse-appliqué textiles created primarily by Guna women.\n\nEach design carries meaning:\n• Animals represent spiritual connections to nature\n• Geometric patterns reflect cosmic order\n• Scenes tell stories of daily life and legends\n\nMolas are not just decoration — they are identity, resistance, and cultural memory. After the 1925 Tule Revolution, traditional dress including molas became a symbol of autonomy.\n\nYou can view beautiful mola images throughout SOGED (with attribution to the Museo de la Mola). Visit https://museodelamola.org/ to learn more.\n\nWould you like vocabulary related to molas, or shall I tell you about the Tule Revolution?`;
        }

        if (/coconut|gwad|coco/.test(q)) {
            this.context.lastTopic = 'food';
            return `Gwad means coconut in Guna! 🥥\n\nCoconut is fundamental to island life:\n• Food: coconut rice, coconut fish dishes\n• Economy: harvesting and trade\n• Daily life: oil, water, and building materials\n\nIn SOGED, you earn virtual cocos (🥥) as rewards while learning — spend them in the Guna Store!\n\nRelated words:\n• Ogob — Corn\n• Naggid — Cassava (yuca)\n• Suggid — Yam\n\nWant a mini quiz on food words, or shall we continue with ${this.context.lastTopic || 'another topic'}?`;
        }

        if (/family|nana|tata|mother|father|familia/.test(q)) {
            this.context.lastTopic = 'family';
            return `Family vocabulary is essential in Guna — family and elders anchor community life:\n\n• Nana — Mother\n• Tata — Father\n• Dummad — Brother\n• Nueded — Sister\n• Dada — Grandmother\n• Bab — Grandfather\n\nGrammar tip: Guna often places the subject simply — "Nana an mar" can mean "Mother is here." The word "an mar" relates to being present.\n\nCultural note: Grandmothers (Dada) traditionally pass down mola knowledge and oral histories to younger generations.\n\nFollow-up: Ask me for a family word quiz, or practice saying "My mother is here" in Guna!`;
        }

        if (/grammar|sentence|structure|how to say/.test(q)) {
            return `Guna grammar basics:\n\n1. Word order is often Subject-Verb-Object, but flexible in conversation.\n2. Pronouns: Na (I), Be (You), Nega (He/She), Anmar (We)\n3. Questions: Bia? (Where?), Doa? (Who?)\n4. Affirmation: Eye (Yes), Degii (That's right)\n\nExample patterns:\n• "Na an mar" — I am here\n• "Be an mar?" — Are you here?\n• "Bia an mar?" — Where are you?\n\nMistake tip: Don't confuse "degi malo" (goodbye) with "Banmalo" (see you tomorrow) — both are farewells but used differently.\n\nWhat sentence would you like help building?`;
        }

        if (/water|sii|fire|dii|house|muu|vocab|word|dictionary|mean/.test(q)) {
            this.context.lastTopic = 'vocabulary';
            return `Here's useful Guna vocabulary:\n\nNature & home:\n• Sii — Water\n• Dii — Fire\n• Muu — House / home\n• Kalu — Wood\n\nAnimals:\n• Ardi — Turtle\n• Uli — Crab\n• Ibeler — Shark\n• Wala — Butterfly\n\nDaily life:\n• Gwad — Coconut\n• Onmaked — Canoe\n• Mola — Traditional textile\n\nVisit the Vocabulary section for flashcards, practice modes, and pronunciation!\n\nWhich category interests you — animals, family, food, or nature?`;
        }

        if (/culture|historia|history|revolution|tule|1925|guna yala|territory/.test(q)) {
            this.context.lastTopic = 'history';
            return `The Guna people have a rich history of resilience and self-governance:\n\n• Guna Yala: Autonomous indigenous territory on Panama's Caribbean coast (360+ islands)\n• 1925 Tule Revolution: The Guna rose up to defend their language, dress, and political autonomy\n• Madugandí & Wargandí: Mainland comarcas where Guna communities also live\n\nSpiritual leaders:\n• Ibeorgun — Creator who established harmony between humans and nature\n• Kantule — Ancestral sage of medicine and community values\n• Saglas — Traditional leaders who guide community congresses\n\nExplore the Culture Center map for interactive territory information!\n\nWould you like to learn history vocabulary, or practice phrases about community life?`;
        }

        if (/pronounc|speak|audio|listen|sound/.test(q)) {
            return `Pronunciation tips for Guna:\n\n• Vowels are generally short and clear\n• Stress is often on the first syllable: NA-na, TA-ta, GWAAD\n• The glottal stop in "¡ anna !" is important — pause slightly before "anna"\n\nUse the 🔊 buttons throughout lessons and vocabulary to hear words. You can also tap the microphone below to speak to me!\n\nTry repeating: "¡ anna !" (hello), "Nana" (mother), "Gwad" (coconut).\n\nWant me to read a word aloud? Type any Guna word!`;
        }

        if (/correct|mistake|wrong|error/.test(q) && this.context.lastTopic) {
            return `I'm happy to help correct your ${this.context.lastTopic} practice!\n\nType the Guna phrase you tried, and I'll let you know if it's correct and suggest improvements.\n\nRemember: making mistakes is part of learning — every error brings you closer to fluency. Eye (yes)!`;
        }

        if (/help|what can/.test(q)) {
            return `I can help you with:\n\n✓ Guna greetings and everyday phrases\n✓ Vocabulary (family, animals, food, nature)\n✓ Grammar and sentence building\n✓ Mola culture and Guna history\n✓ Pronunciation (listen via speaker buttons)\n✓ Mini quizzes and conversation practice\n✓ Voice input — tap the microphone!\n\nTry: "Give me a mini quiz" or "Practice a conversation"\n\nWhat topic shall we explore?`;
        }

        if (/thank|gracias|bye|goodbye|malo/.test(q)) {
            return `You're welcome! Remember:\n• degi malo — Goodbye\n• ¡ banmalo ! — See you tomorrow\n\nEvery word you learn honors Guna heritage. Keep practicing on the Learning Path and visit the Culture Center to deepen your understanding.\n\n¡ anna ! — See you next time! 🏝️`;
        }

        const followUp = this.context.lastTopic
            ? `\n\nSince we were discussing ${this.context.lastTopic}, would you like to go deeper into that topic, try a quiz, or explore something new?`
            : '\n\nTry asking about greetings, molas, family words, or say "give me a mini quiz"!';

        return `That's a thoughtful question about ${this.getCourseName()}!${followUp}\n\nFor specific words, ask "What does [word] mean?" For cultural topics, try "Tell me about Guna history" or "Explain molas."\n\nQuick reminder: ¡ anna ! means Hello in Guna — a great word to start any conversation.`;
    }
}

customElements.define('guna-ai-tutor', GunaAiTutor);
