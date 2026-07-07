/**
 * Mola Puzzle Game - Cultural Educational Puzzle
 * Drag and drop puzzle with Guna cultural facts
 */
class MolaPuzzle extends HTMLElement {
    connectedCallback() {
        this.gridSize = 3; // 3x3 by default
        this.pieces = [];
        this.placedPieces = [];
        this.isDragging = false;
        this.draggedPiece = null;
        this.gameStarted = false;
        this.culturalFacts = [
            "This pattern represents the labyrinth of life!",
            "Molas tell stories of our ancestors.",
            "Each color has a deep spiritual meaning.",
            "Geometric symbols represent nature.",
            "Molas are textile art passed down through generations.",
            "This design symbolizes the connection with the sea.",
            "Triangular patterns represent sacred mountains.",
            "Molas are cultural heritage of humanity."
        ];
        this.currentFactIndex = 0;
        this.render();
        this.initGame();
    }

    render() {
        this.innerHTML = `
            <div class="mola-puzzle-container">
                <div class="puzzle-header">
                    <h2 class="puzzle-title">🧩 Mola Puzzle</h2>
                    <p class="puzzle-subtitle">Reconstruct the traditional mola and discover its cultural meaning</p>
                    
                    <div class="puzzle-controls">
                        <div class="difficulty-selector">
                            <button class="difficulty-btn ${this.gridSize === 3 ? 'active' : ''}" data-size="3">
                                Easy (3x3)
                            </button>
                            <button class="difficulty-btn ${this.gridSize === 4 ? 'active' : ''}" data-size="4">
                                Hard (4x4)
                            </button>
                        </div>
                        <button class="puzzle-reset-btn" id="resetPuzzle">
                            <i class="fas fa-redo"></i> Reset
                        </button>
                    </div>
                </div>

                <div class="puzzle-content">
                    <!-- Soggy Character -->
                    <div class="soggy-character">
                        <img src="../../Images/Soged/Newturttle.png" alt="Soggy" class="soggy-img animate-pulse">
                        <div class="soggy-bubble">
                            <p id="soggyFact">Hello! I'm Soggy, your cultural guide. Drag the pieces to reconstruct this beautiful mola.</p>
                        </div>
                    </div>

                    <!-- Puzzle Area -->
                    <div class="puzzle-area">
                        <div class="puzzle-board" id="puzzleBoard"></div>
                        <div class="pieces-container" id="piecesContainer"></div>
                    </div>
                </div>

                <!-- Victory Modal -->
                <div class="victory-modal" id="victoryModal" hidden>
                    <div class="victory-content">
                        <img src="../../Images/Soged/Newturttle.png" alt="Soggy" class="victory-soggy">
                        <h2 class="victory-title">Excellent work!</h2>
                        <p class="victory-message">You have completed the mola puzzle</p>
                        <div class="cultural-explanation">
                            <h3>📚 Cultural Meaning</h3>
                            <p id="culturalText">Molas are unique artistic expressions of the Guna people, representing their worldview, history, and spiritual connection with nature.</p>
                        </div>
                        <div class="victory-reward">
                            <span class="reward-icon">🥥</span>
                            <span class="reward-count">+40</span>
                            <span class="reward-text">COCOS</span>
                        </div>
                        <div class="victory-actions">
                            <button class="victory-btn primary" id="nextPuzzle">
                                <i class="fas fa-arrow-right"></i> Next
                            </button>
                            <button class="victory-btn secondary" id="closePuzzle">
                                <i class="fas fa-times"></i> Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.gridSize = parseInt(btn.dataset.size);
                this.render();
                this.initGame();
            });
        });

        this.querySelector('#resetPuzzle')?.addEventListener('click', () => {
            this.initGame();
        });

        this.querySelector('#nextPuzzle')?.addEventListener('click', () => {
            this.querySelector('#victoryModal').hidden = true;
            this.initGame();
        });

        this.querySelector('#closePuzzle')?.addEventListener('click', () => {
            this.querySelector('#victoryModal').hidden = true;
        });
    }

    initGame() {
        const board = this.querySelector('#puzzleBoard');
        const piecesContainer = this.querySelector('#piecesContainer');
        const soggyFact = this.querySelector('#soggyFact');
        
        if (!board || !piecesContainer) return;

        this.gameStarted = true;
        this.placedPieces = [];
        this.currentFactIndex = 0;

        // Set board grid
        const totalPieces = this.gridSize * this.gridSize;
        board.style.gridTemplateColumns = `repeat(${this.gridSize}, 1fr)`;
        board.innerHTML = '';
        piecesContainer.innerHTML = '';

        // Create puzzle pieces from mola image
        const molaImage = '../../Images/Molas - Guna/Mola 1.jpg';
        const pieceSize = 100 / this.gridSize;

        // Create board slots
        for (let i = 0; i < totalPieces; i++) {
            const slot = document.createElement('div');
            slot.className = 'puzzle-slot';
            slot.dataset.index = i;
            slot.addEventListener('dragover', (e) => this.handleDragOver(e));
            slot.addEventListener('drop', (e) => this.handleDrop(e));
            slot.addEventListener('touchmove', (e) => this.handleTouchMove(e));
            slot.addEventListener('touchend', (e) => this.handleTouchEnd(e));
            board.appendChild(slot);
        }

        // Create pieces
        const pieces = [];
        for (let i = 0; i < totalPieces; i++) {
            const row = Math.floor(i / this.gridSize);
            const col = i % this.gridSize;
            
            const piece = document.createElement('div');
            piece.className = 'puzzle-piece';
            piece.draggable = true;
            piece.dataset.index = i;
            piece.dataset.currentSlot = -1;
            
            // Set background position for this piece
            piece.style.backgroundImage = `url(${molaImage})`;
            piece.style.backgroundSize = `${this.gridSize * 100}%`;
            piece.style.backgroundPosition = `${col * pieceSize}% ${row * pieceSize}%`;
            
            piece.addEventListener('dragstart', (e) => this.handleDragStart(e));
            piece.addEventListener('dragend', (e) => this.handleDragEnd(e));
            piece.addEventListener('touchstart', (e) => this.handleTouchStart(e));
            
            pieces.push(piece);
        }

        // Shuffle and add to container
        this.shuffleArray(pieces).forEach(piece => {
            piecesContainer.appendChild(piece);
        });

        this.pieces = pieces;
        this.updateSoggyFact();
    }

    handleDragStart(e) {
        this.isDragging = true;
        this.draggedPiece = e.target;
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
    }

    handleDragEnd(e) {
        this.isDragging = false;
        e.target.classList.remove('dragging');
        this.draggedPiece = null;
    }

    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }

    handleDrop(e) {
        e.preventDefault();
        const slot = e.target.closest('.puzzle-slot');
        if (!slot || !this.draggedPiece) return;

        this.placePiece(slot, this.draggedPiece);
    }

    handleTouchStart(e) {
        const piece = e.target.closest('.puzzle-piece');
        if (!piece) return;

        this.isDragging = true;
        this.draggedPiece = piece;
        piece.classList.add('dragging');
        
        // Create touch clone for visual feedback
        const touch = e.touches[0];
        const clone = piece.cloneNode(true);
        clone.style.position = 'fixed';
        clone.style.left = `${touch.clientX - 50}px`;
        clone.style.top = `${touch.clientY - 50}px`;
        clone.style.zIndex = '1000';
        clone.style.pointerEvents = 'none';
        clone.style.opacity = '0.8';
        clone.id = 'touch-clone';
        document.body.appendChild(clone);
    }

    handleTouchMove(e) {
        if (!this.isDragging || !this.draggedPiece) return;
        e.preventDefault();

        const touch = e.touches[0];
        const clone = document.getElementById('touch-clone');
        if (clone) {
            clone.style.left = `${touch.clientX - 50}px`;
            clone.style.top = `${touch.clientY - 50}px`;
        }
    }

    handleTouchEnd(e) {
        if (!this.isDragging || !this.draggedPiece) return;

        const clone = document.getElementById('touch-clone');
        if (clone) clone.remove();

        const touch = e.changedTouches[0];
        const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
        const slot = elementBelow?.closest('.puzzle-slot');

        if (slot) {
            this.placePiece(slot, this.draggedPiece);
        }

        this.isDragging = false;
        this.draggedPiece.classList.remove('dragging');
        this.draggedPiece = null;
    }

    placePiece(slot, piece) {
        // Check if slot is occupied
        if (slot.children.length > 0) return;

        // Move piece to slot
        slot.appendChild(piece);
        piece.dataset.currentSlot = slot.dataset.index;
        
        // Update Soggy fact
        this.updateSoggyFact();

        // Check if puzzle is complete
        this.checkCompletion();
    }

    updateSoggyFact() {
        const soggyFact = this.querySelector('#soggyFact');
        if (!soggyFact) return;

        const placedCount = this.querySelectorAll('.puzzle-slot .puzzle-piece').length;
        const totalPieces = this.gridSize * this.gridSize;
        
        if (placedCount > 0 && placedCount % 2 === 0) {
            this.currentFactIndex = (this.currentFactIndex + 1) % this.culturalFacts.length;
            soggyFact.textContent = this.culturalFacts[this.currentFactIndex];
        }
    }

    checkCompletion() {
        const slots = this.querySelectorAll('.puzzle-slot');
        const totalPieces = this.gridSize * this.gridSize;
        let correctCount = 0;

        slots.forEach(slot => {
            const piece = slot.querySelector('.puzzle-piece');
            if (piece && parseInt(piece.dataset.index) === parseInt(slot.dataset.index)) {
                correctCount++;
            }
        });

        if (correctCount === totalPieces) {
            this.showVictory();
        }
    }

    showVictory() {
        const victoryModal = this.querySelector('#victoryModal');
        const rewardCount = this.querySelector('.reward-count');
        
        if (victoryModal) {
            victoryModal.hidden = false;
            
            // Animate Cocos reward
            if (rewardCount) {
                let currentCount = 0;
                const targetCount = 40;
                const duration = 1500;
                const increment = targetCount / (duration / 16);
                
                const animateCocos = () => {
                    currentCount += increment;
                    if (currentCount >= targetCount) {
                        currentCount = targetCount;
                        rewardCount.textContent = `+${currentCount}`;
                    } else {
                        rewardCount.textContent = `+${Math.floor(currentCount)}`;
                        requestAnimationFrame(animateCocos);
                    }
                };
                animateCocos();
            }
        }

        // Update Cocos in Supabase
        this.updateCocosInSupabase(40);

        // Award cocos locally if economy system exists
        if (typeof CocosEconomy !== 'undefined') {
            CocosEconomy.addCocos(40);
            CocosEconomy.triggerConfetti();
        }
    }

    async updateCocosInSupabase(amount) {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) return;

            const response = await fetch('/api/update-cocos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, amount })
            });

            if (response.ok) {
                console.log('Cocos updated successfully in Supabase');
            }
        } catch (error) {
            console.error('Error updating Cocos:', error);
        }
    }

    shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }
}

customElements.define('mola-puzzle', MolaPuzzle);
