/**
 * Mola Puzzle Game — Drag & Drop with hub rewards
 */
class MolaPuzzleGame extends HTMLElement {
    connectedCallback() {
        this.gridSize = 3;
        this.draggedPiece = null;
        this.moves = 0;
        this.maxMoves = 30;
        this.culturalFacts = [
            'This pattern represents the labyrinth of life!',
            'Molas tell stories of our ancestors.',
            'Each color has a deep spiritual meaning.',
            'Geometric symbols represent nature.',
            'Molas are textile art passed down through generations.'
        ];
        this.factIndex = 0;
        this.render();
        this.initGame();
    }

    render() {
        this.innerHTML = `
            <div class="hub-module">
                <h2 class="hub-section-title">Mola Puzzle</h2>
                <p class="hub-section-subtitle">Drag pieces to reconstruct the traditional mola. Moves remaining: <strong id="puzzleMovesLeft">${this.maxMoves}</strong></p>
                <div class="hub-tabs" style="margin-bottom:1rem;">
                    <button type="button" class="hub-tab ${this.gridSize === 3 ? 'active' : ''}" data-size="3">Easy (3×3) — +40 Ogods</button>
                    <button type="button" class="hub-tab ${this.gridSize === 4 ? 'active' : ''}" data-size="4">Hard (4×4) — +60 Ogods</button>
                </div>
                <div class="hub-card" style="margin-bottom:1rem;padding:1rem;">
                    <p id="soggyFact" style="font-style:italic;">Drag the pieces to reconstruct this beautiful mola!</p>
                </div>
                <div class="puzzle-area">
                    <div class="puzzle-board" id="puzzleBoard"></div>
                    <div class="pieces-container" id="piecesContainer"></div>
                </div>
                <div id="puzzleResult" hidden></div>
            </div>
        `;

        this.querySelectorAll('[data-size]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.gridSize = parseInt(btn.dataset.size, 10);
                this.maxMoves = this.gridSize === 3 ? 30 : 50;
                this.moves = 0;
                this.render();
                this.initGame();
            });
        });
    }

    initGame() {
        const board = this.querySelector('#puzzleBoard');
        const piecesContainer = this.querySelector('#piecesContainer');
        const resultEl = this.querySelector('#puzzleResult');
        if (resultEl) resultEl.hidden = true;

        const total = this.gridSize * this.gridSize;
        const molaImage = '../Images/Molas - Guna/Mola 1.jpg';
        const pieceSize = 100 / this.gridSize;

        board.style.gridTemplateColumns = `repeat(${this.gridSize}, 1fr)`;
        board.innerHTML = '';
        piecesContainer.innerHTML = '';

        for (let i = 0; i < total; i++) {
            const slot = document.createElement('div');
            slot.className = 'puzzle-slot';
            slot.dataset.index = i;
            slot.addEventListener('dragover', e => e.preventDefault());
            slot.addEventListener('drop', e => this.handleDrop(e, slot));
            board.appendChild(slot);
        }

        const pieces = [];
        for (let i = 0; i < total; i++) {
            const row = Math.floor(i / this.gridSize);
            const col = i % this.gridSize;
            const piece = document.createElement('div');
            piece.className = 'puzzle-piece';
            piece.draggable = true;
            piece.dataset.index = i;
            piece.style.backgroundImage = `url(${molaImage})`;
            piece.style.backgroundSize = `${this.gridSize * 100}%`;
            piece.style.backgroundPosition = `${col * pieceSize}% ${row * pieceSize}%`;
            piece.addEventListener('dragstart', e => { this.draggedPiece = piece; piece.classList.add('dragging'); });
            piece.addEventListener('dragend', () => { piece.classList.remove('dragging'); this.draggedPiece = null; });
            pieces.push(piece);
        }

        this.shuffle(pieces).forEach(p => piecesContainer.appendChild(p));
        this.updateMovesDisplay();
    }

    handleDrop(e, slot) {
        e.preventDefault();
        if (!this.draggedPiece || slot.children.length > 0) return;
        slot.appendChild(this.draggedPiece);
        this.moves++;
        this.updateMovesDisplay();
        this.factIndex = (this.factIndex + 1) % this.culturalFacts.length;
        const factEl = this.querySelector('#soggyFact');
        if (factEl) factEl.textContent = this.culturalFacts[this.factIndex];
        this.checkCompletion();
    }

    updateMovesDisplay() {
        const left = this.maxMoves - this.moves;
        const el = this.querySelector('#puzzleMovesLeft');
        if (el) el.textContent = Math.max(0, left);
        if (left <= 0) this.showDefeat();
    }

    checkCompletion() {
        const slots = this.querySelectorAll('.puzzle-slot');
        let correct = 0;
        let placed = 0;
        slots.forEach(slot => {
            const piece = slot.querySelector('.puzzle-piece');
            if (piece) {
                placed++;
                if (parseInt(piece.dataset.index, 10) === parseInt(slot.dataset.index, 10)) correct++;
            }
        });
        if (placed === this.gridSize * this.gridSize && correct === placed) this.showVictory();
    }

    showVictory() {
        const reward = this.gridSize === 3 ? 40 : 60;
        const resultEl = this.querySelector('#puzzleResult');
        resultEl.hidden = false;
        resultEl.innerHTML = `
            <div class="hub-card" style="text-align:center;margin-top:2rem;">
                <h2>Puzzle Complete!</h2>
                <p>+${reward} Ogods earned</p>
                <div id="puzzleFinalActions"></div>
            </div>
        `;
        GameRewards.awardOgods(reward, 'mola-puzzle');
        HubFlow.renderFinalActions(resultEl.querySelector('#puzzleFinalActions'), {
            nextLabel: 'Next Lesson',
            onNext: () => { this.gridSize = this.gridSize === 3 ? 4 : 3; this.moves = 0; this.render(); this.initGame(); }
        });
        HubFlow.handleNext();
    }

    showDefeat() {
        const resultEl = this.querySelector('#puzzleResult');
        if (!resultEl.hidden) return;
        GameRewards.loseBurda('mola-puzzle');
        resultEl.hidden = false;
        resultEl.innerHTML = `
            <div class="hub-card" style="text-align:center;margin-top:2rem;">
                <h2>Out of Moves!</h2>
                <p>You lost 1 Burda. Try again!</p>
                <div id="puzzleFinalActions"></div>
            </div>
        `;
        HubFlow.renderFinalActions(resultEl.querySelector('#puzzleFinalActions'), {
            nextLabel: 'Try Again',
            onNext: () => { this.moves = 0; this.render(); this.initGame(); }
        });
        HubFlow.handleNext();
    }

    shuffle(arr) {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }
}

customElements.define('mola-puzzle-game', MolaPuzzleGame);
