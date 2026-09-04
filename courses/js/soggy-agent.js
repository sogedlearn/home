/**
 * Soggy Agent — local Guna tutor that works even when /api/chat is offline.
 * Looks up recorded vocabulary, runs mini quizzes, and uses learner progress.
 */
const SoggyAgent = {
    quiz: null,

    allWords() {
        const vocab = window.GUNA_VOCABULARY || {};
        const bags = ['greetings', 'family', 'home', 'nature', 'animals', 'plants', 'phrases'];
        const seen = new Set();
        const words = [];
        bags.forEach((key) => {
            (vocab[key] || []).forEach((w) => {
                const id = String(w.guna || '').toLowerCase();
                if (!id || seen.has(id)) return;
                seen.add(id);
                words.push(w);
            });
        });
        return words;
    },

    langOf(text) {
        return /[áéíóúñ¿¡]|(\b(hola|qué|como|cómo|gracias|adiós|familia|palabra|significa)\b)/i.test(text)
            ? 'es'
            : 'en';
    },

    findWord(text) {
        const q = text.toLowerCase();
        return this.allWords().find((w) => {
            const guna = String(w.guna || '').toLowerCase();
            const en = String(w.en || '').toLowerCase();
            const es = String(w.es || '').toLowerCase();
            return (guna && q.includes(guna)) || (en && q.includes(en)) || (es && q.includes(es));
        });
    },

    contextLine(context = {}) {
        const bits = [];
        if (context.level) bits.push(`level ${context.level}`);
        if (context.completedLessons != null) bits.push(`${context.completedLessons}/20 lessons`);
        if (context.ogods != null) bits.push(`${context.ogods} oggob`);
        if (context.burdas != null) bits.push(`${context.burdas} burba`);
        return bits.length ? bits.join(' · ') : '';
    },

    startQuiz(es) {
        const pool = this.allWords();
        const word = pool[Math.floor(Math.random() * pool.length)] || { guna: 'Naa', en: 'Hello', es: 'Hola' };
        const others = pool.filter((w) => w.guna !== word.guna).slice(0, 8);
        const options = [word, ...others.sort(() => Math.random() - 0.5).slice(0, 2)]
            .sort(() => Math.random() - 0.5)
            .map((w) => w.en);
        this.quiz = { guna: word.guna, answer: word.en.toLowerCase(), es: word.es, en: word.en };
        if (es) {
            return `Mini quiz: ¿Qué significa "${word.guna}"?\nOpciones: ${options.join(', ')}\n\nEscribe la respuesta en inglés o español.`;
        }
        return `Mini quiz: What does "${word.guna}" mean?\nOptions: ${options.join(', ')}\n\nType the English or Spanish meaning.`;
    },

    checkQuiz(text, es) {
        const q = text.toLowerCase().trim();
        const quiz = this.quiz;
        if (!quiz) return null;
        const ok = q.includes(quiz.answer) || q.includes(String(quiz.es).toLowerCase()) || q.includes(String(quiz.guna).toLowerCase());
        this.quiz = null;
        if (ok) {
            return es
                ? `¡Eye! "${quiz.guna}" significa ${quiz.es} / ${quiz.en}.\n¿Quieres otro quiz o practicar un saludo?`
                : `Eye! "${quiz.guna}" means ${quiz.en} (${quiz.es}).\nWant another quiz, or a greeting conversation?`;
        }
        return es
            ? `Casi. "${quiz.guna}" significa ${quiz.es} / ${quiz.en}. Sigue practicando — cada error enseña.`
            : `Close. "${quiz.guna}" means ${quiz.en} (${quiz.es}). Keep going — every miss teaches something.`;
    },

    reply(message, { context = {} } = {}) {
        const text = String(message || '').trim();
        if (!text) return 'Naa! Ask me a Guna word, a quiz, or something about Guna culture.';
        const es = this.langOf(text) === 'es';
        const q = text.toLowerCase();
        const progress = this.contextLine(context);

        if (this.quiz) return this.checkQuiz(text, es);

        if (/quiz|test me|desafío|pregunta/.test(q)) return this.startQuiz(es);

        if (/hello|hi|hola|saludo|greeting|naa/.test(q) && !this.findWord(text)?.guna) {
            return es
                ? `Naa — hola en Guna.\n• Deggidde — ¿cómo estás?\n• Eye — sí\n• Suli — no\n• Nued — gracias\n• Deggimalo — adiós\n\n${progress ? `Tu camino: ${progress}.\n` : ''}¿Practicamos un diálogo corto?`
                : `Naa means hello in Guna.\n• Deggidde — how are you?\n• Eye — yes\n• Suli — no\n• Nued — thank you\n• Deggimalo — goodbye\n\n${progress ? `Your path: ${progress}.\n` : ''}Want a short greeting dialogue?`;
        }

        if (/conversat|diálogo|dialogo|practice talking|roleplay/.test(q)) {
            return es
                ? `Diálogo en la isla:\nTú: Naa\nAmigo: Naa. Deggidde?\nTú: Nued\nAmigo: Deggimalo\nTú: Bannemalo\n\nRepite en voz alta. ¿Quieres un quiz de estos saludos?`
                : `Island dialogue:\nYou: Naa\nFriend: Naa. Deggidde?\nYou: Nued\nFriend: Deggimalo\nYou: Bannemalo\n\nSay it out loud. Want a quiz on these greetings?`;
        }

        if (/mola|tejido|textile/.test(q)) {
            return es
                ? `Las molas son textiles de aplique invertido de las mujeres Guna. Cada diseño cuenta historia, naturaleza e identidad. Después de 1925, la mola se volvió símbolo de autonomía.\n¿Quieres la palabra "Mola" o un quiz?`
                : `Molas are reverse-appliqué textiles made by Guna women. Designs carry stories, nature, and identity. After 1925 they became a symbol of autonomy.\nWant the word "Mola", or a quiz?`;
        }

        if (/history|historia|tule|1925|guna yala|territorio/.test(q)) {
            return es
                ? `Guna Yala es territorio autónomo en el Caribe de Panamá. La Revolución Tule de 1925 defendió lengua, vestimenta y gobierno propio. Madugandí y Wargandí son comarcas en tierra firme.\n¿Seguimos con vocabulario de comunidad?`
                : `Guna Yala is an autonomous territory on Panama’s Caribbean coast. The 1925 Tule Revolution defended language, dress, and self-rule. Madugandí and Wargandí are mainland comarcas.\nShall we do community vocabulary next?`;
        }

        const word = this.findWord(text);
        if (word) {
            return es
                ? `${word.guna} — ${word.es} / ${word.en}.\nPronúncialo claro, una sílaba a la vez. ${progress ? `\nTu progreso: ${progress}.` : ''}\nPide "quiz" para practicar.`
                : `${word.guna} — ${word.en} (${word.es}).\nSay it slowly, one clear beat at a time. ${progress ? `\nYour progress: ${progress}.` : ''}\nAsk for a quiz to practice.`;
        }

        if (/help|ayuda|qué puedes|what can/.test(q)) {
            return es
                ? `Soy el agente Soggy. Puedo:\n• Traducir palabras Guna\n• Hacer mini quizzes\n• Practicar diálogos\n• Explicar molas e historia\n\nPrueba: "¿qué significa Nana?" o "quiz".`
                : `I’m the Soggy agent. I can:\n• Translate Guna words\n• Run mini quizzes\n• Practice dialogues\n• Explain molas and history\n\nTry: "What does Nana mean?" or "quiz".`;
        }

        return es
            ? `Naa. Pregúntame una palabra Guna, pide un quiz, o habla de molas e historia.${progress ? `\nTu camino: ${progress}.` : ''}`
            : `Naa. Ask me a Guna word, request a quiz, or talk about molas and history.${progress ? `\nYour path: ${progress}.` : ''}`;
    }
};

window.SoggyAgent = SoggyAgent;
