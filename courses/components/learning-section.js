/**
 * Learning Section Web Component
 * Modern component for interactive learning section
 */

class LearningSection extends HTMLElement {
    constructor() {
        super();
        this.currentCourse = this.getAttribute('course') || 'guna';
        this.userProgress = JSON.parse(localStorage.getItem('userProgress') || '{}');
    }

    connectedCallback() {
        this.render();
        this.initializeEventListeners();
        this.loadUserProgress();
        this.setupSidebarListener();
        this.updateProgressIndicator();
        this.scrollToCurrentDuoStep();
        if (window.learningHub && typeof window.learningHub.scrollToPageTop === 'function') {
            // Keep hub scroll; path will nudge current node into view shortly after
            window.learningHub.scrollToPageTop();
        } else {
            window.scrollTo(0, 0);
        }
        setTimeout(() => this.scrollToCurrentDuoStep(), 350);
    }

    scrollToCurrentDuoStep() {
        const current = this.querySelector('.duo-step.is-current');
        if (current) {
            current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    updateProgressIndicator() {
        const lessons = this.getLessonsData();
        const completed = lessons.filter(l => l.status === 'completed').length;
        const total = lessons.length;
        const label = typeof GunaI18n !== 'undefined'
            ? GunaI18n.t('pathLessons', { completed, total })
            : `${completed}/${total} Lessons`;
        this.querySelectorAll('#progressText, .duo-progress-pill span').forEach((el) => {
            el.textContent = label;
        });
    }

    setupSidebarListener() {
        // Listen for sidebar state changes
        document.addEventListener('sidebarStateChanged', (e) => {
            const { collapsed, width } = e.detail;
            this.adjustToSidebar(collapsed, width);
        });
    }

    adjustToSidebar(collapsed, width) {
        const section = this.querySelector('.learning-section');
        if (section) {
            // Adjust padding and spacing when sidebar is collapsed
            if (collapsed) {
                section.style.padding = '1.5rem';
                section.style.maxWidth = '100%';
            } else {
                section.style.padding = '2rem';
                section.style.maxWidth = '1200px';
            }
        }
    }

    render() {
        if (this.currentCourse !== 'guna') {
            this.innerHTML = `
                <div class="learning-section learning-section--soon">
                    <div class="learning-header" data-aos="fade-up">
                        <h2 class="section-title">🎯 ${this.getCourseName()} ${typeof GunaI18n !== 'undefined' ? GunaI18n.t('learn') : 'Learning Path'}</h2>
                        <p class="section-subtitle">${typeof GunaI18n !== 'undefined' ? GunaI18n.t('coursePreparing') : 'This language course is being prepared for you'}</p>
                    </div>
                    <div class="coming-soon-panel">
                        <span class="coming-soon-badge-lg">${typeof GunaI18n !== 'undefined' ? GunaI18n.t('comingSoon') : 'Coming Soon'}</span>
                        <p>${typeof GunaI18n !== 'undefined' ? GunaI18n.t('buildingLessons', { name: this.getCourseName() }) : `We're building interactive lessons for ${this.getCourseName()}. For now, explore the Guna learning path.`}</p>
                        <button class="lesson-btn btn-primary" onclick="window.learningHub && window.learningHub.switchCourse('guna')">
                            <i class="fas fa-play"></i> ${typeof GunaI18n !== 'undefined' ? GunaI18n.t('goToGunaPath') : 'Go to Guna Path'}
                        </button>
                    </div>
                </div>
            `;
            return;
        }

        this.innerHTML = `
            <style>
                /* Component-specific styles */
                .learning-section {
                    padding: 2rem;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .learning-header {
                    text-align: center;
                    margin-bottom: 3rem;
                    background: linear-gradient(135deg, var(--gradient-primary));
                    color: white;
                    padding: 2rem;
                    border-radius: var(--border-radius-xl);
                    position: relative;
                    overflow: hidden;
                }

                .learning-header::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23pattern)"/></svg>');
                    opacity: 0.3;
                }

                .learning-section--guna .learning-header {
                    background: linear-gradient(165deg, #fffef9 0%, #f8f3ea 35%, rgba(255, 179, 0, 0.2) 65%, rgba(17, 128, 43, 0.16) 100%);
                    color: #3d1f0a;
                    border-bottom: 3px solid rgba(255, 179, 0, 0.45);
                }

                .learning-section--guna .learning-header::before {
                    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='40' viewBox='0 0 80 40'%3E%3Cpath d='M0 20 L10 10 L20 20 L30 10 L40 20 L50 10 L60 20 L70 10 L80 20' fill='none' stroke='%23c0392b' stroke-opacity='0.07' stroke-width='1.5'/%3E%3C/svg%3E");
                    background-size: 80px 40px;
                    opacity: 0.5;
                }

                .learning-section--guna .learning-path {
                    position: relative;
                    overflow: hidden;
                    background: transparent;
                    border: 1px solid rgba(255, 179, 0, 0.25);
                    box-shadow: 0 12px 40px rgba(61, 31, 10, 0.08);
                }

                .learning-section--guna .learning-path::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background:
                        linear-gradient(135deg, rgba(255, 254, 249, 0.94) 0%, rgba(248, 243, 234, 0.9) 55%, rgba(240, 250, 244, 0.92) 100%),
                        url('../Multimedia/Images/Molas - Guna/Mola 5.jpg') center/cover no-repeat;
                    pointer-events: none;
                    z-index: 0;
                }

                .learning-section--guna .learning-path::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='40' viewBox='0 0 80 40'%3E%3Cpath d='M0 20 L10 10 L20 20 L30 10 L40 20 L50 10 L60 20 L70 10 L80 20' fill='none' stroke='%23c0392b' stroke-opacity='0.05' stroke-width='1.5'/%3E%3C/svg%3E");
                    background-size: 80px 40px;
                    opacity: 0.6;
                    pointer-events: none;
                    z-index: 0;
                }

                .learning-section--guna .learning-path > * {
                    position: relative;
                    z-index: 1;
                }

                .learning-section--guna .path-container {
                    max-width: 780px;
                    padding: 2rem 1.25rem 2.5rem;
                }

                .learning-section--guna .path-container::before {
                    top: 24px;
                    bottom: 24px;
                    left: 50%;
                    width: 6px;
                    transform: translateX(-50%);
                    border-radius: 999px;
                    background: linear-gradient(180deg, #11802b, #ffb300, #c0392b, #d4a017, #11802b);
                    background-size: 100% 220%;
                    animation: gunaPathFlow 5s linear infinite;
                    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.85), 0 0 16px rgba(17, 128, 43, 0.22);
                    z-index: 0;
                }

                @keyframes gunaPathFlow {
                    0% { background-position: 0 0; }
                    100% { background-position: 0 220%; }
                }

                .learning-section--guna .path-step {
                    padding: 0.85rem 0;
                    min-height: 120px;
                    align-items: center;
                }

                .learning-section--guna .path-step:nth-child(odd) .lesson-node {
                    margin-right: calc(50% + 48px);
                    margin-left: 0;
                    width: calc(50% - 24px);
                    max-width: calc(50% - 24px);
                }

                .learning-section--guna .path-step:nth-child(even) .lesson-node {
                    margin-left: calc(50% + 48px);
                    margin-right: 0;
                    width: calc(50% - 24px);
                    max-width: calc(50% - 24px);
                }

                .learning-section--guna .path-step-dot {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    width: 2.5rem;
                    height: 2.5rem;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.8rem;
                    font-weight: 800;
                    color: #3d1f0a;
                    background: #fffef9;
                    border: 3px solid #11802b;
                    box-shadow: 0 0 0 4px rgba(255, 179, 0, 0.28), 0 4px 14px rgba(61, 31, 10, 0.12);
                    z-index: 3;
                    transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
                }

                .learning-section--guna .path-step-dot.completed {
                    background: linear-gradient(135deg, #11802b, #1a5c2e);
                    color: #fff;
                    border-color: #ffb300;
                }

                .learning-section--guna .path-step-dot.current {
                    background: linear-gradient(135deg, #ffb300, #d4a017);
                    color: #3d1f0a;
                    border-color: #11802b;
                    animation: pathDotPulse 2s ease-in-out infinite;
                }

                .learning-section--guna .path-step-dot.locked {
                    background: #f1f5f9;
                    color: #94a3b8;
                    border-color: #cbd5e1;
                    box-shadow: none;
                }

                @keyframes pathDotPulse {
                    0%, 100% { transform: translate(-50%, -50%) scale(1); box-shadow: 0 0 0 4px rgba(255, 179, 0, 0.28), 0 4px 14px rgba(61, 31, 10, 0.12); }
                    50% { transform: translate(-50%, -50%) scale(1.12); box-shadow: 0 0 0 8px rgba(17, 128, 43, 0.2), 0 6px 20px rgba(255, 179, 0, 0.35); }
                }

                .learning-section--guna .path-step:hover .path-step-dot:not(.locked) {
                    transform: translate(-50%, -50%) scale(1.08);
                }

                .learning-section--guna .lesson-node.current::before {
                    display: none;
                }

                .learning-section--guna .lesson-node.completed::before {
                    display: none;
                }

                .learning-section--guna .lesson-node.locked::before {
                    display: none;
                }

                .learning-section--guna .lesson-node.current .lesson-icon {
                    background: linear-gradient(135deg, #c0392b 0%, #ffb300 50%, #11802b 100%);
                }

                .learning-section--guna .lesson-node.completed .lesson-icon {
                    background: linear-gradient(135deg, #11802b 0%, #ffb300 100%);
                    color: #fff;
                }

                .learning-section--guna .lesson-node--island {
                    background: linear-gradient(135deg, rgba(255, 254, 249, 0.96), rgba(255, 179, 0, 0.1));
                    border: 1px solid rgba(255, 179, 0, 0.28);
                    backdrop-filter: blur(4px);
                }

                .learning-section--guna .lesson-node--island::before {
                    display: none;
                }

                .learning-section--guna .lesson-node {
                    display: grid;
                    grid-template-columns: 3.75rem 1fr;
                    grid-template-rows: auto auto auto;
                    column-gap: 1rem;
                    row-gap: 0.55rem;
                    align-items: start;
                    background: rgba(255, 255, 255, 0.94);
                    backdrop-filter: blur(4px);
                    border: 1px solid rgba(192, 57, 43, 0.1);
                    border-radius: 16px;
                    padding: 1.15rem 1.25rem 1rem;
                    box-shadow: 0 8px 28px rgba(61, 31, 10, 0.07);
                    z-index: 2;
                }

                .learning-section--guna .lesson-node:hover {
                    border-color: rgba(17, 128, 43, 0.32);
                    box-shadow: 0 12px 32px rgba(17, 128, 43, 0.12);
                }

                .learning-section--guna .lesson-icon {
                    grid-row: 1 / span 2;
                    margin-right: 0;
                    width: 3.75rem;
                    height: 3.75rem;
                    font-size: 1.35rem;
                }

                .learning-section--guna .lesson-info {
                    grid-column: 2;
                    min-width: 0;
                }

                .learning-section--guna .lesson-title {
                    color: #3d1f0a;
                    margin-bottom: 0.2rem;
                }

                .learning-section--guna .lesson-description {
                    color: #6b4f3a;
                    font-size: 0.88rem;
                    line-height: 1.55;
                    margin-bottom: 0.45rem;
                }

                .learning-section--guna .lesson-stats--guna {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.45rem;
                }

                .learning-section--guna .stat-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.35rem;
                    padding: 0.38rem 0.72rem;
                    border-radius: 10px;
                    font-size: 0.74rem;
                    font-weight: 700;
                    white-space: nowrap;
                }

                .learning-section--guna .stat-pill--xp {
                    background: rgba(255, 179, 0, 0.16);
                    color: #7a4e00;
                    border: 1px solid rgba(255, 179, 0, 0.35);
                }

                .learning-section--guna .stat-pill--xp i {
                    color: #ffb300;
                }

                .learning-section--guna .stat-pill--time {
                    background: rgba(192, 57, 43, 0.1);
                    color: #8b2635;
                    border: 1px solid rgba(192, 57, 43, 0.28);
                }

                .learning-section--guna .stat-pill--time i {
                    color: #c0392b;
                }

                .learning-section--guna .stat-pill--exercises {
                    background: rgba(17, 128, 43, 0.1);
                    color: #1a5c2e;
                    border: 1px solid rgba(17, 128, 43, 0.28);
                }

                .learning-section--guna .stat-pill--exercises i {
                    color: #11802b;
                }

                .learning-section--guna .lesson-actions {
                    grid-column: 1 / -1;
                    width: 100%;
                    flex-direction: row;
                    justify-content: flex-end;
                    align-items: center;
                    padding-top: 0.55rem;
                    margin-top: 0.1rem;
                    border-top: 1px dashed rgba(212, 160, 23, 0.35);
                }

                .learning-section--guna .guna-current-badge {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    width: 2rem;
                    height: 2rem;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: conic-gradient(from 0deg, #c0392b, #ffb300, #11802b, #d4a017, #c0392b);
                    box-shadow: 0 2px 10px rgba(61, 31, 10, 0.14);
                    z-index: 5;
                }

                .learning-section--guna .guna-current-badge::before {
                    content: '';
                    position: absolute;
                    inset: 3px;
                    border-radius: 50%;
                    background: linear-gradient(145deg, #11802b, #1a5c2e);
                }

                .learning-section--guna .guna-current-badge i {
                    position: relative;
                    z-index: 1;
                    font-size: 0.68rem;
                    color: #ffb300;
                }

                .learning-section--guna .module-header {
                    width: 100%;
                    max-width: 100%;
                    margin: 2rem 0 1.25rem;
                    padding: 1.25rem 1.5rem;
                    background: linear-gradient(165deg, rgba(255, 254, 249, 0.98), rgba(248, 243, 234, 0.96));
                    color: #3d1f0a;
                    border: 1px solid rgba(255, 179, 0, 0.28);
                    border-bottom: 3px solid #11802b;
                    z-index: 4;
                }

                .learning-section--guna .module-header::before {
                    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='30' viewBox='0 0 60 30'%3E%3Cpath d='M0 15 L7.5 7.5 L15 15 L22.5 7.5 L30 15 L37.5 7.5 L45 15 L52.5 7.5 L60 15' fill='none' stroke='%23c0392b' stroke-opacity='0.06' stroke-width='1.5'/%3E%3C/svg%3E");
                    background-size: 60px 30px;
                    opacity: 0.7;
                }

                .learning-section--guna .module-divider {
                    background: linear-gradient(90deg, transparent, #ffb300, #c0392b, #11802b, transparent);
                    height: 2px;
                    opacity: 0.85;
                }

                .learning-section--guna .btn-primary,
                .learning-section--guna .btn-secondary {
                    background: linear-gradient(135deg, #11802b 0%, #1a5c2e 100%);
                    color: #fff;
                    border: none;
                    font-weight: 600;
                    box-shadow: 0 4px 12px rgba(17, 128, 43, 0.22);
                }

                .learning-section--guna .btn-primary:hover,
                .learning-section--guna .btn-secondary:hover {
                    background: linear-gradient(135deg, #1a5c2e 0%, #11802b 100%);
                    box-shadow: 0 6px 18px rgba(17, 128, 43, 0.32);
                    transform: translateY(-2px);
                }

                .learning-section--guna .lesson-level-num {
                    background: linear-gradient(135deg, #11802b 0%, #1a5c2e 100%);
                }

                .learning-section--guna .progress-indicator {
                    background: rgba(255, 255, 255, 0.92);
                    border: 1px solid rgba(17, 128, 43, 0.2);
                    color: #3d1f0a;
                }

                .section-title {
                    font-size: 2.5rem;
                    font-weight: 700;
                    margin-bottom: 0.5rem;
                    position: relative;
                    z-index: 1;
                    color: #000000;
                }

                .section-subtitle {
                    font-size: 1.2rem;
                    opacity: 0.9;
                    position: relative;
                    z-index: 1;
                }



                .learning-path {
                    position: relative;
                    padding: 2rem 0 3rem;
                    background: var(--bg-secondary);
                    border-radius: var(--border-radius-lg);
                    box-shadow: var(--shadow-md);
                    margin-bottom: 2rem;
                    overflow: visible;
                }

                .path-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0;
                    padding: 1rem 1.5rem 2rem;
                    max-width: 560px;
                    margin: 0 auto;
                    position: relative;
                }

                .path-container::before {
                    content: '';
                    position: absolute;
                    top: 40px;
                    bottom: 40px;
                    left: 50%;
                    width: 4px;
                    transform: translateX(-50%);
                    background: #22c55e;
                    border-radius: 4px;
                    z-index: 0;
                }

                .path-step {
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    position: relative;
                    z-index: 1;
                    padding: 0.5rem 0;
                }

                .path-step:nth-child(odd) .lesson-node {
                    margin-right: auto;
                    margin-left: 0;
                    max-width: 92%;
                }

                .path-step:nth-child(even) .lesson-node {
                    margin-left: auto;
                    margin-right: 0;
                    max-width: 92%;
                }

                .path-step-connector {
                    width: 4px;
                    height: 20px;
                    background: var(--primary-color);
                    opacity: 0.3;
                    margin: 0 auto;
                }

                .lesson-node {
                    display: flex;
                    align-items: center;
                    padding: 1.25rem 1.5rem;
                    background: var(--bg-tertiary);
                    border-radius: var(--border-radius-lg);
                    transition: all var(--transition-fast);
                    cursor: pointer;
                    position: relative;
                    overflow: visible;
                    width: 100%;
                    box-shadow: var(--shadow-sm);
                    border: 2px solid transparent;
                }

                .lesson-node::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 4px;
                    height: 100%;
                    background: var(--text-light);
                    transition: all var(--transition-fast);
                }

                .lesson-node.completed::before {
                    background: var(--gradient-success);
                }

                .lesson-node.current::before {
                    background: var(--gradient-primary);
                }

                .lesson-node.locked::before {
                    background: var(--text-light);
                }

                .lesson-node:hover {
                    transform: translateY(-4px) scale(1.02);
                    box-shadow: var(--shadow-lg);
                    border-color: var(--primary-color);
                }

                .lesson-node.locked {
                    opacity: 0.75;
                }

                .lesson-node.locked:hover {
                    transform: none;
                    border-color: transparent;
                    box-shadow: var(--shadow-sm);
                }

                .lesson-level-num {
                    position: absolute;
                    top: -10px;
                    left: -10px;
                    width: 28px;
                    height: 28px;
                    background: var(--gradient-primary);
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.8rem;
                    font-weight: 700;
                    box-shadow: var(--shadow-sm);
                    z-index: 2;
                }

                .boss-node .lesson-level-num {
                    background: var(--gradient-accent);
                }

                .lesson-icon {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                    margin-right: 1.5rem;
                    flex-shrink: 0;
                }

                .lesson-node.completed .lesson-icon {
                    background: var(--gradient-success);
                    color: white;
                }

                .lesson-node.current .lesson-icon {
                    background: var(--gradient-primary);
                    color: white;
                    animation: pulse 2s infinite;
                }

                .lesson-node.locked .lesson-icon {
                    background: var(--bg-primary);
                    color: var(--text-light);
                }

                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }

                .lesson-info {
                    flex-grow: 1;
                }

                .lesson-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                    color: #000000;
                }

                .lesson-description {
                    color: var(--text-secondary);
                    font-size: 0.9rem;
                    margin-bottom: 0.75rem;
                }

                .lesson-stats {
                    display: flex;
                    gap: 1rem;
                    font-size: 0.85rem;
                }

                .stat-item {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    color: var(--text-secondary);
                }

                .lesson-actions {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    align-items: flex-end;
                }

                .lesson-btn {
                    padding: 0.5rem 1rem;
                    border: none;
                    border-radius: var(--border-radius);
                    font-weight: 500;
                    cursor: pointer;
                    transition: all var(--transition-fast);
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .btn-primary {
                    background: var(--gradient-primary);
                    color: white;
                }

                .btn-secondary {
                    background: var(--bg-primary);
                    color: var(--text-primary);
                    border: 1px solid var(--text-light);
                }

                .btn-disabled {
                    background: var(--bg-primary);
                    color: var(--text-light);
                    cursor: not-allowed;
                }

                .lesson-btn:hover:not(.btn-disabled) {
                    transform: translateY(-1px);
                    box-shadow: var(--shadow-sm);
                }

                .progress-indicator {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    background: var(--bg-secondary);
                    padding: 0.5rem 1rem;
                    border-radius: var(--border-radius);
                    box-shadow: var(--shadow-sm);
                    font-size: 0.9rem;
                    font-weight: 600;
                }

                .boss-node {
                    background: linear-gradient(135deg, var(--gradient-accent));
                    color: white;
                    position: relative;
                }

                .boss-node::before {
                    background: var(--accent-color) !important;
                }

                .boss-badge {
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    background: var(--gradient-accent);
                    color: white;
                    padding: 0.25rem 0.5rem;
                    border-radius: var(--border-radius);
                    font-size: 0.7rem;
                    font-weight: 700;
                    box-shadow: var(--shadow-md);
                }

                .soggy-avatar-dynamic {
                    position: absolute;
                    top: -15px;
                    right: -15px;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    overflow: hidden;
                    border: 3px solid var(--success-color);
                    box-shadow: 0 4px 12px rgba(40, 167, 69, 0.4);
                    animation: bounce 2s infinite;
                    z-index: 10;
                }

                .soggy-avatar-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }

                .opacity-60 {
                    opacity: 0.6;
                }

                .pointer-events-none {
                    pointer-events: none;
                }

                .module-header {
                    text-align: center;
                    margin: 2rem 0 1.5rem;
                    padding: 1.5rem;
                    background: linear-gradient(135deg, var(--gradient-primary));
                    border-radius: var(--border-radius-lg);
                    color: white;
                    position: relative;
                    overflow: hidden;
                }

                .module-header::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="module-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="6" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23module-pattern)"/></svg>');
                    opacity: 0.3;
                }

                .module-title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    margin: 0;
                    position: relative;
                    z-index: 1;
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
                }

                .module-divider {
                    height: 3px;
                    background: linear-gradient(90deg, transparent, white, transparent);
                    margin-top: 1rem;
                    border-radius: 2px;
                }

                /* Responsive Design */
                @media (max-width: 768px) {
                    .learning-section {
                        padding: 1rem;
                    }

                    .section-title {
                        font-size: 2rem;
                    }

                    .learning-section--guna .path-step:nth-child(odd) .lesson-node,
                    .learning-section--guna .path-step:nth-child(even) .lesson-node {
                        margin-left: 0;
                        margin-right: 0;
                        width: calc(100% - 2.5rem);
                        max-width: calc(100% - 2.5rem);
                    }

                    .learning-section--guna .path-container::before {
                        left: 1.15rem;
                        transform: none;
                    }

                    .learning-section--guna .path-step-dot {
                        left: 1.15rem;
                        transform: translate(-50%, -50%);
                    }

                    .learning-section--guna .lesson-node {
                        grid-template-columns: 1fr;
                        text-align: left;
                    }

                    .learning-section--guna .lesson-icon {
                        grid-row: auto;
                        margin: 0 0 0.5rem;
                    }

                    .learning-section--guna .lesson-info {
                        grid-column: 1;
                    }

                    .lesson-node {
                        flex-direction: column;
                        text-align: center;
                        padding: 1rem;
                    }

                    .lesson-icon {
                        margin-right: 0;
                        margin-bottom: 1rem;
                    }

                    .lesson-actions {
                        align-items: center;
                        margin-top: 1rem;
                    }
                }
            </style>

            <div class="learning-section ${this.currentCourse === 'guna' ? 'learning-section--guna' : ''}">
                <div class="learning-header" data-aos="fade-up">
                    <h2 class="section-title">${typeof GunaI18n !== 'undefined' ? GunaI18n.t('interactivePath') : 'Interactive Learning Path'}</h2>
                    <p class="section-subtitle">${typeof GunaI18n !== 'undefined' ? GunaI18n.t('masterCourse', { name: this.getCourseName() }) : `Master ${this.getCourseName()} through gamified lessons and cultural immersion`}</p>
                    

                </div>

                <div class="learning-path learning-path--duo" data-aos="fade-up" data-aos-delay="100">
                    <div class="progress-indicator" id="pathProgressIndicator">
                        <span id="progressText">0/0 Lessons</span>
                    </div>
                    ${this.generateDuoPath()}
                    <div class="path-container" id="pathContainer" hidden></div>
                </div>
            </div>
        `;
    }

    getCourseName() {
        const names = {
            'ngabe': 'Ngäbe',
            'guna': 'Guna',
            'embera': 'Emberá',
            'naso': 'Naso'
        };
        return names[this.currentCourse] || 'Indigenous Language';
    }

    getDuoOffsets() {
        // Snake / Duolingo zigzag pattern
        return [0, -72, -120, -72, 0, 72, 120, 72];
    }

    generateDuoPath() {
        const lessons = this.getLessonsData().map((lesson) => ({ ...lesson }));
        const currentLevel = this.getCurrentLevel();
        const isGuest = localStorage.getItem('isGuest') === 'true';
        const guestAccessLevel = parseInt(localStorage.getItem('guestAccessLevel') || '2', 10);
        const offsets = this.getDuoOffsets();
        const completed = lessons.filter((l) => l.status === 'completed').length;
        const total = lessons.length;
        const progressLabel = typeof GunaI18n !== 'undefined'
            ? GunaI18n.t('pathLessons', { completed, total })
            : `${completed}/${total} Lessons`;

        let trackHtml = '';
        let currentModule = 0;
        let pathIndex = 0;

        lessons.forEach((lesson) => {
            if (isGuest && lesson.id > guestAccessLevel) {
                lesson.status = 'locked';
                lesson.isLockedForGuest = true;
            }

            if (lesson.module && lesson.module !== currentModule) {
                currentModule = lesson.module;
                const titles = {
                    1: 'MODULE 1 · Roots & Community',
                    2: 'MODULE 2 · Cosmovision & Identity'
                };
                trackHtml += `
                    <div class="duo-module">
                        <h3>${titles[currentModule] || `MODULE ${currentModule}`}</h3>
                    </div>
                `;
            }

            const x = offsets[pathIndex % offsets.length];
            const isRight = x > 0;
            const isCurrent = lesson.status === 'current' || lesson.id === currentLevel;
            const showChest = lesson.type === 'boss' || lesson.id % 5 === 0;
            const icon = lesson.status === 'completed'
                ? '<i class="fas fa-check"></i>'
                : lesson.status === 'locked'
                    ? '<i class="fas fa-lock"></i>'
                    : lesson.type === 'boss'
                        ? '<i class="fas fa-crown"></i>'
                        : `<span>${lesson.id}</span>`;

            trackHtml += `
                <div class="duo-step ${isRight ? 'is-right' : ''} ${isCurrent ? 'is-current' : ''}"
                     style="--duo-x: ${x}px"
                     data-lesson-step="${lesson.id}">
                    <div class="duo-node-wrap">
                        ${isCurrent ? `
                            <span class="duo-ring" aria-hidden="true"></span>
                            <div class="duo-mascot" aria-hidden="true">
                                <img src="../Multimedia/Images/Soged/Newturttle.png" alt="">
                                <div class="duo-speech">${lesson.status === 'completed' ? 'Review!' : 'START!'}</div>
                            </div>
                        ` : ''}
                        <button type="button"
                            class="duo-node duo-node--${lesson.status} ${lesson.type === 'boss' ? 'duo-node--boss' : ''} ${isCurrent ? 'selected' : ''}"
                            data-lesson="${lesson.id}"
                            data-status="${lesson.status}"
                            aria-label="Level ${lesson.id}: ${lesson.title}">
                            ${icon}
                        </button>
                        ${showChest ? `
                            <div class="duo-chest ${lesson.status === 'locked' ? 'duo-chest--locked' : ''}" aria-hidden="true">
                                <i class="fas fa-gift"></i>
                            </div>
                        ` : ''}
                        <div class="duo-label">${lesson.title}</div>
                    </div>
                </div>
            `;
            pathIndex += 1;
        });

        const focusLesson = lessons.find((l) => l.status === 'current')
            || lessons.find((l) => l.id === currentLevel)
            || lessons[0];

        return `
            <div class="duo-path">
                <div class="duo-path__board">
                    <div class="duo-progress-pill">
                        <i class="fas fa-route"></i>
                        <span id="progressText">${progressLabel}</span>
                    </div>
                    <div class="duo-track" id="duoTrack">
                        ${trackHtml}
                    </div>
                </div>
                <aside class="duo-detail" id="duoLessonDetail" data-active-lesson="${focusLesson?.id || 1}">
                    ${this.renderDuoDetail(focusLesson)}
                </aside>
            </div>
        `;
    }

    renderDuoDetail(lesson) {
        if (!lesson) {
            return `<div class="duo-detail__empty">Select a level on the path</div>`;
        }

        const badgeClass = lesson.status === 'completed'
            ? 'is-completed'
            : lesson.status === 'locked'
                ? 'is-locked'
                : '';
        const badgeText = lesson.status === 'completed'
            ? 'Completed'
            : lesson.status === 'locked'
                ? 'Locked'
                : 'Current level';

        let cta = '';
        if (lesson.status === 'completed') {
            cta = `<button type="button" class="duo-detail__cta duo-detail__cta--review" data-duo-action="review" data-lesson="${lesson.id}">
                <i class="fas fa-redo"></i> Review lesson
            </button>`;
        } else if (lesson.status === 'current') {
            const session = typeof GunaProgress !== 'undefined' ? GunaProgress.getLessonSession(lesson.id) : null;
            cta = `<button type="button" class="duo-detail__cta" data-duo-action="start" data-lesson="${lesson.id}">
                <i class="fas fa-play"></i> ${session ? 'Continue' : 'START'}
            </button>`;
        } else {
            cta = `<button type="button" class="duo-detail__cta" disabled>
                <i class="fas fa-lock"></i> Locked
            </button>`;
        }

        return `
            <img class="duo-detail__mascot" src="../Multimedia/Images/Soged/Newturttle.png" alt="SOGED turtle">
            <div class="duo-detail__badge ${badgeClass}">
                <i class="fas fa-flag"></i> Level ${lesson.id} · ${badgeText}
            </div>
            <h3>${lesson.title}</h3>
            <p>${lesson.description}</p>
            <div class="duo-detail__stats">
                <span><i class="fas fa-star"></i> +${lesson.xp} XP</span>
                <span><i class="fas fa-clock"></i> ${lesson.duration} min</span>
                <span><i class="fas fa-layer-group"></i> ${lesson.exercises} exercises</span>
            </div>
            ${cta}
        `;
    }

    generateLessonsForCourse() {
        return this.generateDuoPath();
    }

    generateModuleHeader(moduleNumber) {
        const moduleTitles = {
            1: 'MODULE 1: Roots and Community Environment',
            2: 'MODULE 2: Cosmovision and Advanced Identity'
        };

        return `
            <div class="module-header ${this.currentCourse === 'guna' ? 'module-header--guna' : ''}">
                <h3 class="module-title" style="color: ${this.currentCourse === 'guna' ? '#3d1f0a' : '#000000'};">${moduleTitles[moduleNumber] || `MODULE ${moduleNumber}`}</h3>
                <div class="module-divider"></div>
            </div>
        `;
    }

    getCurrentLevel() {
        const lessons = this.getLessonsData();
        const currentLesson = lessons.find(l => l.status === 'current');
        return currentLesson ? currentLesson.id : 1;
    }

    generateSoggyAvatar() {
        if (this.currentCourse === 'guna') {
            return `
                <div class="guna-current-badge" title="Current lesson">
                    <i class="fas fa-seedling"></i>
                </div>
            `;
        }

        return `
            <div class="soggy-avatar-dynamic">
                <img src="../Multimedia/Images/Soged/Newturttle.png" alt="Soggy" class="soggy-avatar-img">
            </div>
        `;
    }

    getLessonsData() {
        // Course-specific data
        const courseLessons = {
            'ngabe': [
                { id: 1, title: 'Basic Greetings', description: 'Learn essential greetings and polite expressions', status: 'completed', xp: 50, duration: 15, exercises: 8, type: 'normal' },
                { id: 2, title: 'Numbers 1-10', description: 'Master counting and basic numbers', status: 'completed', xp: 75, duration: 20, exercises: 12, type: 'normal' },
                { id: 3, title: 'Family Members', description: 'Identify family relationships and roles', status: 'current', xp: 100, duration: 25, exercises: 15, type: 'normal' },
                { id: 4, title: 'Colors & Nature', description: 'Describe the natural world around you', status: 'locked', xp: 125, duration: 30, exercises: 18, type: 'normal' },
                { id: 5, title: 'Level 1 Assessment', description: 'Test your knowledge with cultural scenarios', status: 'locked', xp: 200, duration: 45, exercises: 25, type: 'boss' }
            ],
            'guna': [
                // MODULE 1: "Roots and Community Environment" (Levels 1-10)
                { id: 1, title: 'Island Greetings', description: 'Traditional welcome expressions from Guna Yala', status: 'completed', xp: 50, duration: 15, exercises: 8, type: 'normal', module: 1 },
                { id: 2, title: 'Family', description: 'Mother, father, siblings and grandparents', status: 'completed', xp: 75, duration: 20, exercises: 10, type: 'normal', module: 1 },
                { id: 3, title: 'Household Objects', description: 'House, table, plate and daily objects', status: 'completed', xp: 75, duration: 20, exercises: 10, type: 'normal', module: 1 },
                { id: 4, title: 'Nature', description: 'Rivers, seas, mountains and local flora', status: 'current', xp: 100, duration: 25, exercises: 12, type: 'normal', module: 1 },
                { id: 5, title: 'Sacred Animals', description: 'Panama fauna, birds, jaguars and marine animals', status: 'locked', xp: 125, duration: 30, exercises: 14, type: 'normal', module: 1 },
                { id: 6, title: 'Plants & Food', description: 'Crops, coconut, cassava and traditional foods', status: 'locked', xp: 125, duration: 30, exercises: 14, type: 'normal', module: 1 },
                { id: 7, title: 'Basic Conversations', description: 'Everyday questions and useful phrases', status: 'locked', xp: 125, duration: 30, exercises: 14, type: 'normal', module: 1 },
                { id: 8, title: 'Weather & Seasons', description: 'Sun, rain, wind and lunar cycles', status: 'locked', xp: 150, duration: 35, exercises: 16, type: 'normal', module: 1 },
                { id: 9, title: 'Clothing & Symbolism', description: 'Molas, beads, textiles and traditional dress', status: 'locked', xp: 150, duration: 35, exercises: 16, type: 'normal', module: 1 },
                { id: 10, title: 'Traditional Medicine', description: 'Medicinal plants, healers and healing songs', status: 'locked', xp: 175, duration: 40, exercises: 18, type: 'normal', module: 1 },
                // MODULE 2: "Worldview and Advanced Identity" (Levels 11-20)
                { id: 11, title: 'Stories and Legends', description: 'Creation myths and grandparents narrations', status: 'locked', xp: 175, duration: 40, exercises: 18, type: 'normal', module: 2 },
                { id: 12, title: 'Community Organization', description: 'The Congress, comarcas and traditional authorities', status: 'locked', xp: 200, duration: 45, exercises: 20, type: 'normal', module: 2 },
                { id: 13, title: 'Celebrations and Music', description: 'Traditional dances, ceremonies and music', status: 'locked', xp: 200, duration: 45, exercises: 20, type: 'normal', module: 2 },
                { id: 14, title: 'Idiomatic Expressions', description: 'Idioms and traditional sayings', status: 'locked', xp: 225, duration: 50, exercises: 22, type: 'normal', module: 2 },
                { id: 15, title: 'Regional Geography', description: 'Territories, rivers and sacred places', status: 'locked', xp: 225, duration: 50, exercises: 22, type: 'normal', module: 2 },
                { id: 16, title: 'Art and Basketry', description: 'Textiles, baskets and craft techniques', status: 'locked', xp: 250, duration: 55, exercises: 24, type: 'normal', module: 2 },
                { id: 17, title: 'Values and Community Law', description: 'Norms, justice and traditional values', status: 'locked', xp: 250, duration: 55, exercises: 24, type: 'normal', module: 2 },
                { id: 18, title: 'Healing Songs', description: 'Spiritual medicine and traditional songs', status: 'locked', xp: 275, duration: 60, exercises: 26, type: 'normal', module: 2 },
                { id: 19, title: 'Traditional Exchange', description: 'Trade, barter and local economy', status: 'locked', xp: 275, duration: 60, exercises: 26, type: 'normal', module: 2 },
                { id: 20, title: 'Linguistic Mastery', description: 'Final exam and mastery certification', status: 'locked', xp: 300, duration: 90, exercises: 30, type: 'boss', module: 2 }
            ],
            'embera': [
                { id: 1, title: 'River Greetings', description: 'Welcome expressions from the rainforest', status: 'completed', xp: 50, duration: 15, exercises: 8, type: 'normal' },
                { id: 2, title: 'Jungle Numbers', description: 'Counting in the forest way', status: 'current', xp: 75, duration: 20, exercises: 12, type: 'normal' },
                { id: 3, title: 'Craft Vocabulary', description: 'Basket weaving and traditional arts', status: 'locked', xp: 100, duration: 25, exercises: 15, type: 'normal' },
                { id: 4, title: 'Rainforest Life', description: 'Plants, animals, and survival', status: 'locked', xp: 125, duration: 30, exercises: 18, type: 'normal' },
                { id: 5, title: 'Shamanic Stories', description: 'Spiritual traditions and healing', status: 'locked', xp: 200, duration: 45, exercises: 25, type: 'boss' }
            ],
            'naso': [
                { id: 1, title: 'Royal Greetings', description: 'Formal expressions of the kingdom', status: 'completed', xp: 50, duration: 15, exercises: 8, type: 'normal' },
                { id: 2, title: 'Sacred Numbers', description: 'Counting in the traditional way', status: 'current', xp: 75, duration: 20, exercises: 12, type: 'normal' },
                { id: 3, title: 'Royal Family', description: 'Titles and hierarchy vocabulary', status: 'locked', xp: 100, duration: 25, exercises: 15, type: 'normal' },
                { id: 4, title: 'Mountain Spirits', description: 'Spiritual and nature vocabulary', status: 'locked', xp: 125, duration: 30, exercises: 18, type: 'normal' },
                { id: 5, title: 'Kingdom Legends', description: 'Historical stories and traditions', status: 'locked', xp: 200, duration: 45, exercises: 25, type: 'boss' }
            ]
        };

        const base = courseLessons[this.currentCourse] || courseLessons['guna'];
        if (this.currentCourse === 'guna' && typeof GunaProgress !== 'undefined') {
            return GunaProgress.getLessonsWithStatus(base);
        }
        return base;
    }

    getLessonIcon(status, type) {
        if (type === 'boss') return 'fa-crown';
        
        switch(status) {
            case 'completed': return 'fa-check-circle';
            case 'current': return 'fa-play-circle';
            case 'locked': return 'fa-lock';
            default: return 'fa-circle';
        }
    }

    getLessonButton(lesson) {
        const session = typeof GunaProgress !== 'undefined' ? GunaProgress.getLessonSession(lesson.id) : null;
        const useGuna = this.currentCourse === 'guna';
        const badge = useGuna
            ? ''
            : `<span class="lesson-status-badge">${({ completed: '✅', current: '🔄', locked: '🔒' })[lesson.status] || ''}</span>`;

        switch(lesson.status) {
            case 'completed':
                return `${badge}
                    <button class="lesson-btn ${useGuna ? 'btn-primary' : 'btn-secondary'}" onclick="event.stopPropagation(); reviewLesson(${lesson.id})">
                        <i class="fas fa-redo"></i>
                        Review
                    </button>
                `;
            case 'current':
                return `${badge}
                    <button class="lesson-btn btn-primary" onclick="event.stopPropagation(); startLesson(${lesson.id})">
                        <i class="fas fa-play"></i>
                        ${session ? 'Continue' : 'Start Lesson'}
                    </button>
                `;
            case 'locked':
                return `${badge}
                    <button class="lesson-btn btn-disabled" disabled>
                        <i class="fas fa-lock"></i>
                        Locked
                    </button>
                `;
            default:
                return '';
        }
    }

    initializeEventListeners() {
        this.querySelectorAll('.duo-node').forEach((node) => {
            node.addEventListener('click', () => {
                const lessonId = node.getAttribute('data-lesson');
                this.selectLesson(lessonId);
            });
        });

        this.querySelectorAll('.lesson-node').forEach((node) => {
            node.addEventListener('click', () => {
                if (!node.classList.contains('locked')) {
                    const lessonId = node.getAttribute('data-lesson');
                    this.selectLesson(lessonId);
                }
            });
        });

        const detail = this.querySelector('#duoLessonDetail');
        if (detail) {
            detail.addEventListener('click', (e) => {
                const btn = e.target.closest('[data-duo-action]');
                if (!btn) return;
                const lessonId = btn.getAttribute('data-lesson');
                const action = btn.getAttribute('data-duo-action');
                if (action === 'review' && typeof window.reviewLesson === 'function') {
                    window.reviewLesson(lessonId);
                } else if (action === 'start' && typeof window.startLesson === 'function') {
                    window.startLesson(lessonId);
                }
            });
        }
    }

    switchCourse(course) {
        if (this.currentCourse !== course) {
            this.currentCourse = course;
            this.setAttribute('course', course);
            
            // Update URL
            const url = new URL(window.location);
            url.searchParams.set('course', course);
            window.history.pushState({}, '', url);
            
            // Re-render with new course
            this.render();
            this.initializeEventListeners();
            
            // Trigger custom event
            this.dispatchEvent(new CustomEvent('courseChanged', {
                detail: { course: course },
                bubbles: true
            }));
        }
    }

    selectLesson(lessonId) {
        this.querySelectorAll('.lesson-node, .duo-node').forEach((node) => {
            node.classList.remove('selected');
        });

        const selectedNode = this.querySelector(`.duo-node[data-lesson="${lessonId}"], .lesson-node[data-lesson="${lessonId}"]`);
        if (selectedNode) {
            selectedNode.classList.add('selected');
        }

        const lessons = this.getLessonsData();
        const lesson = lessons.find((l) => String(l.id) === String(lessonId));
        const detail = this.querySelector('#duoLessonDetail');
        if (detail && lesson) {
            detail.dataset.activeLesson = String(lesson.id);
            detail.innerHTML = this.renderDuoDetail(lesson);
        }

        this.dispatchEvent(new CustomEvent('lessonSelected', {
            detail: { lessonId: lessonId, course: this.currentCourse },
            bubbles: true
        }));
    }

    loadUserProgress() {
        // Load user progress from localStorage or API
        const progress = JSON.parse(localStorage.getItem(`progress_${this.currentCourse}`) || '{}');
        // Update UI based on progress
    }

    saveUserProgress() {
        // Save progress to localStorage or API
        localStorage.setItem(`progress_${this.currentCourse}`, JSON.stringify(this.userProgress));
    }
}

// Register the custom element
customElements.define('learning-section', LearningSection);

// Helper: resolve active course even when learning-section is not in DOM
function getActiveCourse() {
    if (window.learningHub?.currentCourse) return window.learningHub.currentCourse;
    const stored = localStorage.getItem('currentCourse');
    if (stored) return stored;
    const section = document.querySelector('learning-section');
    if (section) return section.getAttribute('course') || 'guna';
    return 'guna';
}

function openGunaLessonViewer(lessonId, review = false) {
    const id = parseInt(lessonId, 10);
    if (typeof GunaProgress !== 'undefined') {
        if (!GunaProgress.canAccessLesson(id, review)) {
            showNotification('🔒 Completa la lección anterior para desbloquear este nivel.', 'info');
            return;
        }
        if (!review && typeof GunaLives !== 'undefined' && !GunaLives.canPlay()) {
            const session = GunaProgress.getLessonSession(id);
            if (!session) {
                showNotification(typeof GunaI18n !== 'undefined' ? GunaI18n.t('noLives') : 'No lives left! Visit the store.', 'error');
                return;
            }
        }
    }

    const contentContainer = document.getElementById('contentContainer');
    if (!contentContainer) return;

    const reviewAttr = review ? ' review="true"' : '';
    contentContainer.innerHTML = `<guna-lesson-viewer lesson-id="${id}"${reviewAttr}></guna-lesson-viewer>`;
    if (window.learningHub && typeof window.learningHub.scrollToPageTop === 'function') {
        window.learningHub.scrollToPageTop();
    } else {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }

    const viewer = contentContainer.querySelector('guna-lesson-viewer');
    if (viewer) {
        viewer.addEventListener('lessonCompleted', (e) => {
            const completedId = e.detail.lessonId;
            showNotification(`🎉 Lesson ${completedId} completed! +25 cocos`, 'success');
            setTimeout(() => {
                if (window.learningHub) {
                    window.learningHub.loadSection('learn', true);
                }
            }, 1500);
        }, { once: true });
    }
}

// Global functions for lesson interaction
window.startLesson = function(lessonId) {
    const currentCourse = getActiveCourse();
    if (currentCourse !== 'guna') {
        showNotification('This course is coming soon!', 'info');
        return;
    }
    const id = parseInt(lessonId, 10);
    if (typeof GunaProgress !== 'undefined') {
        if (!GunaProgress.canAccessLesson(id, false)) {
            showNotification('🔒 Esta lección está bloqueada.', 'info');
            return;
        }
        const completed = GunaProgress.getProgress().completed;
        let currentId = 1;
        for (let i = 1; i <= GunaProgress.TOTAL_LESSONS; i++) {
            if (!completed.includes(i)) { currentId = i; break; }
        }
        if (id !== currentId) {
            showNotification('Solo puedes iniciar la lección actual del camino.', 'info');
            return;
        }
    }
    openGunaLessonViewer(id, false);
};

window.reviewLesson = function(lessonId) {
    const currentCourse = getActiveCourse();
    if (currentCourse !== 'guna') {
        showNotification('This course is coming soon!', 'info');
        return;
    }
    const id = parseInt(lessonId, 10);
    if (typeof GunaProgress !== 'undefined' && !GunaProgress.isCompleted(id)) {
        showNotification('Solo puedes repasar lecciones completadas.', 'info');
        return;
    }
    openGunaLessonViewer(id, true);
};

// Utility function for notifications
window.showNotification = function(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: type === 'success' ? '#2ECC71' : '#00A3E0',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
        zIndex: '10000',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
};
