/**
 * Mola Puzzle — reconstruct traditional Guna textile designs
 * Supports mouse drag, tap-to-place, and touch.
 */
class MolaPuzzleGame extends HTMLElement {
    connectedCallback() {
        this.gridSize = 3;
        this.draggedPiece = null;
        this.selectedPiece = null;
        this.moves = 0;
        this.maxMoves = 30;
        this.molaIndex = 0;
        this.finished = false;
        this.touchPiece = null;
        this.culturalFacts = [
            'This pattern represents the labyrinth of life!',
            'Molas tell stories of our ancestors.',
            'Each color has a deep spiritual meaning.',
            'Geometric symbols represent nature.',
            'Molas are textile art passed down through generations.',
            'This design symbolizes the connection with the sea.',
            'Triangular patterns represent sacred mountains.'
        ];
        this.factIndex = 0;
        this.molas = this.buildMolaSet();
        this.render();
        this.initGame();
    }

    buildMolaSet() {
        const photo = '../Multimedia/Images/Molas - Guna/mola-bg-pattern.jpg';
        return [
            { id: 'labyrinth', title: 'Labyrinth of life', src: photo },
            { id: 'sea', title: 'Sea of Gunayala', src: this.paintMola('sea') },
            { id: 'birds', title: 'Birds and mountains', src: this.paintMola('birds') }
        ];
    }

    paintMola(kind) {
        const canvas = document.createElement('canvas');
        canvas.width = 600;
        canvas.height = 600;
        const ctx = canvas.getContext('2d');
        const palettes = {
            sea: ['#8B1530', '#C41E3A', '#E3A008', '#11802B', '#0C5C1F', '#1A3A6B', '#F4E4C1'],
            birds: ['#3D1F0A', '#C00000', '#FFB300', '#2D6A4F', '#163222', '#FFF8E1', '#D45A2A']
        };
        const colors = palettes[kind] || palettes.sea;

        ctx.fillStyle = colors[0];
        ctx.fillRect(0, 0, 600, 600);

        for (let y = 0; y < 12; y++) {
            for (let x = 0; x < 12; x++) {
                const cx = x * 50 + 25;
                const cy = y * 50 + 25;
                ctx.fillStyle = colors[(x + y + (kind === 'birds' ? 2 : 0)) % colors.length];
                if ((x + y) % 2 === 0) {
                    ctx.beginPath();
                    ctx.moveTo(cx, cy - 22);
                    ctx.lineTo(cx + 22, cy);
                    ctx.lineTo(cx, cy + 22);
                    ctx.lineTo(cx - 22, cy);
                    ctx.closePath();
                    ctx.fill();
                } else {
                    ctx.beginPath();
                    ctx.arc(cx, cy, kind === 'sea' ? 16 : 12, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }

        ctx.strokeStyle = colors[5];
        ctx.lineWidth = 10;
        for (let i = 0; i < 4; i++) {
            ctx.strokeRect(20 + i * 12, 20 + i * 12, 560 - i * 24, 560 - i * 24);
        }

        ctx.fillStyle = colors[2];
        ctx.beginPath();
        ctx.moveTo(300, 90);
        ctx.lineTo(470, 300);
        ctx.lineTo(300, 510);
        ctx.lineTo(130, 300);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = colors[4];
        ctx.beginPath();
        ctx.arc(300, 300, 70, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = colors[1];
        ctx.beginPath();
        ctx.arc(300, 300, 32, 0, Math.PI * 2);
        ctx.fill();

        return canvas.toDataURL('image/png');
    }

    currentMola() {
        return this.molas[this.molaIndex % this.molas.length];
    }

    render() {
        const mola = this.currentMola();
        this.innerHTML = `
            <div class="hub-module games-mola-shell mola-puzzle-game">
                <h2 class="hub-section-title">Mola Puzzle</h2>
                <p class="hub-section-subtitle">Rebuild the textile. Moves left: <strong id="puzzleMovesLeft">${this.maxMoves}</strong></p>
                <div class="hub-tabs" style="margin-bottom:1rem;">
                    <button type="button" class="hub-tab ${this.gridSize === 3 ? 'active' : ''}" data-size="3">Easy (3×3) — +40 Ogods</button>
                    <button type="button" class="hub-tab ${this.gridSize === 4 ? 'active' : ''}" data-size="4">Hard (4×4) — +60 Ogods</button>
                </div>
                <div class="hub-tabs" style="margin-bottom:1rem;">
                    ${this.molas.map((item, i) => `
                        <button type="button" class="hub-tab ${i === this.molaIndex ? 'active' : ''}" data-mola="${i}">${item.title}</button>
                    `).join('')}
                </div>
                <p class="mola-puzzle-tip" id="soggyFact">Tap a piece, then tap a board square — or drag it into place.</p>
                <div class="mola-puzzle-layout">
                    <figure class="mola-puzzle-preview">
                        <img src="${mola.src}" alt="${mola.title}" id="puzzlePreviewImg">
                        <figcaption>${mola.title}</figcaption>
                    </figure>
                    <div class="puzzle-area mola-puzzle-area">
                        <div class="puzzle-board mola-board" id="puzzleBoard"></div>
                        <div class="pieces-container mola-pieces" id="piecesContainer"></div>
                    </div>
                </div>
                <div style="display:flex;gap:0.75rem;margin-top:1rem;flex-wrap:wrap;">
                    <button type="button" class="hub-btn hub-btn-secondary" id="resetPuzzle">Reset board</button>
                </div>
                <div id="puzzleResult" hidden></div>
            </div>
        `;

        this.querySelectorAll('[data-size]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.gridSize = parseInt(btn.dataset.size, 10);
                this.maxMoves = this.gridSize === 3 ? 30 : 50;
                this.moves = 0;
                this.finished = false;
                this.render();
                this.initGame();
            });
        });

        this.querySelectorAll('[data-mola]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.molaIndex = parseInt(btn.dataset.mola, 10);
                this.moves = 0;
                this.finished = false;
                this.render();
                this.initGame();
            });
        });

        this.querySelector('#resetPuzzle')?.addEventListener('click', () => {
            this.moves = 0;
            this.finished = false;
            this.render();
            this.initGame();
        });
    }

    initGame() {
        const board = this.querySelector('#puzzleBoard');
        const piecesContainer = this.querySelector('#piecesContainer');
        const resultEl = this.querySelector('#puzzleResult');
        if (!board || !piecesContainer) return;
        if (resultEl) resultEl.hidden = true;

        const total = this.gridSize * this.gridSize;
        const molaImage = this.currentMola().src;
        const pieceSize = 100 / this.gridSize;

        board.style.gridTemplateColumns = `repeat(${this.gridSize}, 1fr)`;
        board.innerHTML = '';
        piecesContainer.innerHTML = '';
        this.selectedPiece = null;
        this.draggedPiece = null;

        for (let i = 0; i < total; i++) {
            const slot = document.createElement('div');
            slot.className = 'puzzle-slot';
            slot.dataset.index = String(i);
            slot.addEventListener('dragover', e => e.preventDefault());
            slot.addEventListener('drop', e => this.handleDrop(e, slot));
            slot.addEventListener('click', () => this.placeSelected(slot));
            slot.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.placeSelected(slot);
            }, { passive: false });
            board.appendChild(slot);
        }

        const pieces = [];
        for (let i = 0; i < total; i++) {
            const row = Math.floor(i / this.gridSize);
            const col = i % this.gridSize;
            const piece = document.createElement('div');
            piece.className = 'puzzle-piece';
            piece.draggable = true;
            piece.dataset.index = String(i);
            piece.style.backgroundImage = `url("${molaImage}")`;
            piece.style.backgroundSize = `${this.gridSize * 100}% ${this.gridSize * 100}%`;
            piece.style.backgroundPosition = `${col * pieceSize}% ${row * pieceSize}%`;
            piece.addEventListener('dragstart', e => {
                this.draggedPiece = piece;
                this.selectedPiece = piece;
                piece.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
            });
            piece.addEventListener('dragend', () => {
                piece.classList.remove('dragging');
                this.draggedPiece = null;
            });
            piece.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectPiece(piece);
            });
            piece.addEventListener('touchstart', (e) => {
                this.touchPiece = piece;
                this.selectPiece(piece);
            }, { passive: true });
            pieces.push(piece);
        }

        this.shuffle(pieces).forEach(p => piecesContainer.appendChild(p));

        piecesContainer.addEventListener('click', (e) => {
            if (e.target === piecesContainer && this.selectedPiece) {
                piecesContainer.appendChild(this.selectedPiece);
                this.clearSelection();
            }
        });

        this.updateMovesDisplay();
    }

    selectPiece(piece) {
        this.querySelectorAll('.puzzle-piece').forEach(p => p.classList.remove('selected'));
        this.selectedPiece = piece;
        piece.classList.add('selected');
    }

    clearSelection() {
        this.querySelectorAll('.puzzle-piece').forEach(p => p.classList.remove('selected'));
        this.selectedPiece = null;
    }

    placeSelected(slot) {
        if (this.finished) return;
        const piece = this.selectedPiece || this.touchPiece;
        if (!piece || slot.children.length > 0) return;
        slot.classList.add('filled');
        slot.appendChild(piece);
        this.moves++;
        this.updateMovesDisplay();
        this.factIndex = (this.factIndex + 1) % this.culturalFacts.length;
        const factEl = this.querySelector('#soggyFact');
        if (factEl) factEl.textContent = this.culturalFacts[this.factIndex];
        this.clearSelection();
        this.touchPiece = null;
        this.checkCompletion();
    }

    handleDrop(e, slot) {
        e.preventDefault();
        if (this.finished) return;
        const piece = this.draggedPiece || this.selectedPiece;
        if (!piece || slot.children.length > 0) return;
        this.selectedPiece = piece;
        this.placeSelected(slot);
        this.draggedPiece = null;
    }

    updateMovesDisplay() {
        const left = this.maxMoves - this.moves;
        const el = this.querySelector('#puzzleMovesLeft');
        if (el) el.textContent = String(Math.max(0, left));
        if (left <= 0 && !this.finished) this.showDefeat();
    }

    checkCompletion() {
        const slots = this.querySelectorAll('.puzzle-slot');
        let correct = 0;
        let placed = 0;
        slots.forEach(slot => {
            const piece = slot.querySelector('.puzzle-piece');
            if (piece) {
                placed++;
                if (piece.dataset.index === slot.dataset.index) correct++;
            }
        });
        if (placed === this.gridSize * this.gridSize && correct === placed) this.showVictory();
    }

    showVictory() {
        if (this.finished) return;
        this.finished = true;
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
            nextLabel: 'Next Mola',
            onNext: () => {
                this.molaIndex = (this.molaIndex + 1) % this.molas.length;
                this.gridSize = this.gridSize === 3 ? 4 : 3;
                this.maxMoves = this.gridSize === 3 ? 30 : 50;
                this.moves = 0;
                this.finished = false;
                this.render();
                this.initGame();
            }
        });
        HubFlow.handleNext();
    }

    showDefeat() {
        const resultEl = this.querySelector('#puzzleResult');
        if (!resultEl || this.finished) return;
        this.finished = true;
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
            onNext: () => {
                this.moves = 0;
                this.finished = false;
                this.render();
                this.initGame();
            }
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
