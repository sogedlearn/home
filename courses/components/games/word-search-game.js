/**
 * Word Search — Thematic Guna vocabulary grid
 */
class WordSearchGame extends HTMLElement {
    connectedCallback() {
        this.words = [
            { word: 'NANA', hint: 'Mother' },
            { word: 'TATA', hint: 'Father' },
            { word: 'GWAD', hint: 'Coconut' },
            { word: 'ANNA', hint: 'Hello' },
            { word: 'MUU', hint: 'House' },
            { word: 'SII', hint: 'Water' }
        ];
        this.foundWords = new Set();
        this.selectedCells = [];
        this.grid = [];
        this.size = 10;
        this.maxAttempts = 15;
        this.attempts = 0;
        this.render();
        this.buildGrid();
    }

    render() {
        this.innerHTML = `
            <div class="hub-module">
                <h2 class="hub-section-title">Guna Word Search</h2>
                <p class="hub-section-subtitle">Find hidden Guna words. Attempts remaining: <strong id="wsAttempts">${this.maxAttempts}</strong></p>
                <div class="word-list" id="wordList"></div>
                <div class="word-search-grid" id="wsGrid" style="grid-template-columns:repeat(${this.size},36px);"></div>
                <div id="wsResult" hidden></div>
            </div>
        `;
        this.renderWordList();
    }

    buildGrid() {
        this.grid = Array.from({ length: this.size }, () => Array(this.size).fill(''));
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        this.words.forEach(({ word }) => {
            let placed = false;
            let tries = 0;
            while (!placed && tries < 50) {
                tries++;
                const horizontal = Math.random() > 0.5;
                const row = Math.floor(Math.random() * this.size);
                const col = Math.floor(Math.random() * this.size);
                if (horizontal && col + word.length <= this.size) {
                    for (let i = 0; i < word.length; i++) this.grid[row][col + i] = word[i];
                    placed = true;
                } else if (!horizontal && row + word.length <= this.size) {
                    for (let i = 0; i < word.length; i++) this.grid[row + i][col] = word[i];
                    placed = true;
                }
            }
        });

        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                if (!this.grid[r][c]) {
                    this.grid[r][c] = letters[Math.floor(Math.random() * letters.length)];
                }
            }
        }

        this.renderGrid();
    }

    renderGrid() {
        const gridEl = this.querySelector('#wsGrid');
        gridEl.innerHTML = '';
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                const cell = document.createElement('div');
                cell.className = 'word-search-cell';
                cell.textContent = this.grid[r][c];
                cell.dataset.row = r;
                cell.dataset.col = c;
                cell.addEventListener('mousedown', () => this.startSelection(r, c));
                cell.addEventListener('mouseenter', () => this.extendSelection(r, c));
                cell.addEventListener('mouseup', () => this.endSelection());
                cell.addEventListener('touchstart', e => { e.preventDefault(); this.startSelection(r, c); });
                cell.addEventListener('touchend', () => this.endSelection());
                gridEl.appendChild(cell);
            }
        }
    }

    renderWordList() {
        const list = this.querySelector('#wordList');
        list.innerHTML = this.words.map(w => `
            <span class="word-item ${this.foundWords.has(w.word) ? 'found' : ''}" data-word="${w.word}">
                ${w.hint} (${w.word})
            </span>
        `).join('');
    }

    startSelection(r, c) {
        this.selecting = true;
        this.selectedCells = [{ r, c }];
        this.updateSelectionUI();
    }

    extendSelection(r, c) {
        if (!this.selecting) return;
        const last = this.selectedCells[this.selectedCells.length - 1];
        if (!last) return;
        const dr = r - last.r;
        const dc = c - last.c;
        if (Math.abs(dr) <= 1 && Math.abs(dc) <= 1 && (dr !== 0 || dc !== 0)) {
            this.selectedCells.push({ r, c });
            this.updateSelectionUI();
        }
    }

    endSelection() {
        if (!this.selecting) return;
        this.selecting = false;
        const word = this.selectedCells.map(({ r, c }) => this.grid[r][c]).join('');
        const reversed = word.split('').reverse().join('');
        const match = this.words.find(w => w.word === word || w.word === reversed);

        if (match && !this.foundWords.has(match.word)) {
            this.foundWords.add(match.word);
            this.markFoundCells();
            this.renderWordList();
            if (this.foundWords.size === this.words.length) this.showVictory();
        } else if (!match) {
            this.attempts++;
            this.querySelector('#wsAttempts').textContent = Math.max(0, this.maxAttempts - this.attempts);
            if (this.attempts >= this.maxAttempts) this.showDefeat();
        }

        this.selectedCells = [];
        this.updateSelectionUI();
    }

    updateSelectionUI() {
        this.querySelectorAll('.word-search-cell').forEach(cell => {
            const r = parseInt(cell.dataset.row, 10);
            const c = parseInt(cell.dataset.col, 10);
            cell.classList.toggle('selected', this.selectedCells.some(s => s.r === r && s.c === c));
        });
    }

    markFoundCells() {
        this.querySelectorAll('.word-search-cell.selected').forEach(cell => {
            cell.classList.remove('selected');
            cell.classList.add('found');
        });
    }

    showVictory() {
        const resultEl = this.querySelector('#wsResult');
        resultEl.hidden = false;
        resultEl.innerHTML = `
            <div class="hub-card" style="text-align:center;margin-top:2rem;">
                <h2>All Words Found!</h2>
                <p>+35 Ogods earned</p>
                <div id="wsFinalActions"></div>
            </div>
        `;
        GameRewards.awardOgods(35, 'word-search');
        HubFlow.renderFinalActions(resultEl.querySelector('#wsFinalActions'), {
            nextLabel: 'Next Lesson',
            onNext: () => { this.foundWords.clear(); this.attempts = 0; this.render(); this.buildGrid(); }
        });
        HubFlow.handleNext();
    }

    showDefeat() {
        GameRewards.loseBurda('word-search');
        const resultEl = this.querySelector('#wsResult');
        resultEl.hidden = false;
        resultEl.innerHTML = `
            <div class="hub-card" style="text-align:center;margin-top:2rem;">
                <h2>Out of Attempts!</h2>
                <p>You lost 1 Burda.</p>
                <div id="wsFinalActions"></div>
            </div>
        `;
        HubFlow.renderFinalActions(resultEl.querySelector('#wsFinalActions'), {
            nextLabel: 'Try Again',
            onNext: () => { this.foundWords.clear(); this.attempts = 0; this.render(); this.buildGrid(); }
        });
        HubFlow.handleNext();
    }
}

customElements.define('word-search-game', WordSearchGame);
