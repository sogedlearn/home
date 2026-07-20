// Web Component para el Footer
class SogedFooter extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    render() {
        const currentPath = window.location.pathname;
        let basePath = '';

        if (currentPath.includes('/pages/') || currentPath.includes('/auth/') || currentPath.includes('/dashboard/') || currentPath.includes('/courses/')) {
            basePath = '../';
        } else {
            basePath = './';
        }

        this.shadowRoot.innerHTML = `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&family=Fredoka+One&display=swap');
                @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');
                @import url('../css/footer.css');

                :host {
                    display: block;
                }

                :root {
                    --primary-color: #00A3E0;
                    --primary-hover: #0088C7;
                    --secondary-color: #FF6B35;
                    --accent-color: #FFD23F;
                    --success-color: #2ECC71;
                    --warning-color: #F39C12;
                    --info-color: #3498DB;
                    --bg-primary: #F8FAFC;
                    --bg-secondary: #ffffff;
                    --bg-tertiary: #F1F5F9;
                    --card-bg: #fff;
                    --header-bg: #fff;
                    --footer-bg: #F8FAFC;
                    --navbar-bg: #fff;
                    --shadow-color: rgba(0, 163, 224, 0.08);
                    --text-primary: #1E293B;
                    --text-secondary: #64748B;
                    --text-color: #1E293B;
                    --border-color: #E2E8F0;
                    --input-bg: #fff;
                    --input-border: #CBD5E1;
                    --input-text: #1E293B;
                    --transition: all 0.3s cubic-bezier(.4,0,.2,1);
                    --gradient-primary: linear-gradient(135deg, #00A3E0 0%, #0088C7 100%);
                    --gradient-secondary: linear-gradient(135deg, #FF6B35 0%, #FF8A65 100%);
                    --gradient-accent: linear-gradient(135deg, #FFD23F 0%, #FFA726 100%);
                    --gradient-success: linear-gradient(135deg, #2ECC71 0%, #27AE60 100%);
                }

                [data-theme="dark"] {
                    --primary-color: #00A3E0;
                    --primary-hover: #0088C7;
                    --secondary-color: #FF6B35;
                    --accent-color: #FFD23F;
                    --success-color: #2ECC71;
                    --warning-color: #F39C12;
                    --info-color: #3498DB;
                    --bg-primary: #0F172A;
                    --bg-secondary: #1E293B;
                    --bg-tertiary: #334155;
                    --card-bg: #1E293B;
                    --header-bg: #0F172A;
                    --footer-bg: #0F172A;
                    --navbar-bg: #0F172A;
                    --shadow-color: rgba(0, 163, 224, 0.15);
                    --text-primary: #F1F5F9;
                    --text-secondary: #94A3B8;
                    --text-color: #F1F5F9;
                    --border-color: #334155;
                    --input-bg: #1E293B;
                    --input-border: #475569;
                    --input-text: #F1F5F9;
                    --transition: all 0.3s cubic-bezier(.4,0,.2,1);
                    --gradient-primary: linear-gradient(135deg, #00A3E0 0%, #0088C7 100%);
                    --gradient-secondary: linear-gradient(135deg, #FF6B35 0%, #FF8A65 100%);
                    --gradient-accent: linear-gradient(135deg, #FFD23F 0%, #FFA726 100%);
                    --gradient-success: linear-gradient(135deg, #2ECC71 0%, #27AE60 100%);
                }

                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                .footer {
                    background: var(--bg-secondary);
                    border-top: 1px solid var(--border-color);
                    padding: 4rem 0 0;
                    position: relative;
                }

                .footer::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 4px;
                    background: var(--gradient-primary);
                }

                .container {
                    margin: 0 auto;
                    padding: 0 5rem;
                }

                .row {
                    display: flex;
                    flex-wrap: wrap;
                    margin: 0 -0.5rem;
                }

                .col-lg-3, .col-lg-6, .col-md-6 {
                    padding: 0 0.5rem;
                }

                .col-lg-3 {
                    flex: 0 0 25%;
                    max-width: 25%;
                }

                .col-lg-6 {
                    flex: 0 0 50%;
                    max-width: 50%;
                }

                .col-md-6 {
                    flex: 0 0 50%;
                    max-width: 50%;
                }

                .g-4 {
                    gap: 1.5rem;
                }

                .footer-brand {
                    display: flex;
                    align-items: center;
                    gap: 0.8rem;
                    margin-bottom: 1.5rem;
                }

                .footer-brand img {
                    height: 40px;
                    width: auto;
                    max-width: 140px;
                    object-fit: contain;
                }

                .footer-brand i {
                    font-size: 2.5rem;
                    color: var(--primary-color);
                }

                .footer-brand span {
                    font-size: 2rem;
                    font-weight: 700;
                    color: var(--text-primary);
                    font-family: 'Fredoka One', cursive;
                }

                .footer-description {
                    color: var(--text-secondary);
                    line-height: 1.6;
                    margin-bottom: 2rem;
                    font-size: 1rem;
                }

                .footer-stats {
                    display: flex;
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }

                .footer-stats .stat {
                    text-align: center;
                }

                .footer-stats .stat-number {
                    display: block;
                    font-size: 1.3rem;
                    font-weight: 700;
                    color: var(--primary-color);
                }

                .footer-stats .stat-label {
                    font-size: 0.8rem;
                    color: var(--text-secondary);
                    font-weight: 500;
                }

                .footer-title {
                    color: var(--text-primary);
                    font-size: 1.2rem;
                    font-weight: 700;
                    margin-bottom: 1.5rem;
                    position: relative;
                }

                .footer-title::after {
                    content: '';
                    position: absolute;
                    bottom: -0.5rem;
                    left: 0;
                    width: 30px;
                    height: 3px;
                    background: var(--gradient-primary);
                    border-radius: 2px;
                }

                .footer-links {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .footer-links li {
                    margin-bottom: 0.8rem;
                }

                .footer-links a {
                    color: var(--text-secondary);
                    text-decoration: none;
                    transition: var(--transition);
                    font-weight: 500;
                    display: inline-block;
                    position: relative;
                    font-size: 0.95rem;
                }

                .footer-links a::before {
                    content: '';
                    position: absolute;
                    bottom: -2px;
                    left: 0;
                    width: 0;
                    height: 2px;
                    background: var(--gradient-primary);
                    transition: var(--transition);
                }

                .footer-links a:hover {
                    color: var(--primary-color);
                    transform: translateX(5px);
                }

                .footer-links a:hover::before {
                    width: 100%;
                }

                .social-links {
                    display: flex;
                    gap: 1rem;
                    margin-top: 1.5rem;
                }

                .social-link {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: var(--card-bg);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--text-primary);
                    text-decoration: none;
                    transition: var(--transition);
                    border: 2px solid var(--border-color);
                    font-size: 1.1rem;
                }

                .social-link:hover {
                    background: var(--gradient-primary);
                    color: white;
                    transform: translateY(-5px);
                    border-color: var(--primary-color);
                    box-shadow: 0 5px 15px rgba(0, 163, 224, 0.3);
                }

                .newsletter-section {
                    background: var(--card-bg);
                    border: 2px solid var(--border-color);
                    border-radius: 20px;
                    padding: 2.5rem;
                    margin: 3rem 0;
                    position: relative;
                    overflow: hidden;
                }

                .newsletter-section::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 4px;
                    background: var(--gradient-primary);
                    transform: scaleX(0);
                    transition: transform 0.3s ease;
                }

                .newsletter-section:hover::before {
                    transform: scaleX(1);
                }

                .newsletter-section h3 {
                    color: var(--text-primary);
                    font-size: 1.8rem;
                    font-weight: 700;
                    margin-bottom: 1rem;
                }

                .newsletter-section p {
                    color: var(--text-secondary);
                    font-size: 1.1rem;
                    margin-bottom: 0;
                }

                .newsletter-form .input-group {
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 16px var(--shadow-color);
                    display: flex;
                }

                .newsletter-form .form-control {
                    border: none;
                    padding: 1rem 1.5rem;
                    font-size: 1rem;
                    background: var(--input-bg);
                    color: var(--input-text);
                    flex: 1;
                }

                .newsletter-form .form-control:focus {
                    box-shadow: none;
                    border-color: var(--primary-color);
                    outline: none;
                }

                .newsletter-form .btn {
                    padding: 1rem 2rem;
                    border: none;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: var(--gradient-primary);
                    color: white;
                    cursor: pointer;
                    transition: var(--transition);
                }

                .newsletter-form .btn:hover {
                    background: var(--gradient-primary);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 16px rgba(0, 163, 224, 0.25);
                }

                .footer-bottom {
                    border-top: 1px solid var(--border-color);
                    padding: 2rem 0;
                    margin-top: 2rem;
                    background: var(--bg-tertiary);
                }

                .copyright {
                    color: var(--text-secondary);
                    font-size: 0.9rem;
                    margin: 0;
                }

                .footer-bottom-links {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: flex;
                    gap: 2rem;
                    justify-content: flex-end;
                    flex-wrap: wrap;
                }

                .footer-bottom-links a {
                    color: var(--text-secondary);
                    text-decoration: none;
                    font-size: 0.9rem;
                    transition: var(--transition);
                }

                .footer-bottom-links a:hover {
                    color: var(--primary-color);
                }

                .align-items-center {
                    align-items: center;
                }

                /* Responsive */
                @media (max-width: 991px) {
                    .col-lg-3 {
                        flex: 0 0 50%;
                        max-width: 50%;
                    }
                }

                @media (max-width: 768px) {
                    .footer-stats {
                        gap: 1rem;
                    }

                    .newsletter-section {
                        padding: 2rem;
                        text-align: center;
                    }

                    .footer-bottom-links {
                        justify-content: center;
                        gap: 1rem;
                    }

                    .copyright {
                        text-align: center;
                        margin-bottom: 1rem;
                    }

                    .col-lg-3, .col-lg-6, .col-md-6 {
                        flex: 0 0 100%;
                        max-width: 100%;
                    }
                }

                @media (max-width: 576px) {
                    .footer {
                        padding: 2rem 0 0;
                    }

                    .footer-stats {
                        flex-direction: column;
                        gap: 1rem;
                    }

                    .social-links {
                        justify-content: center;
                    }

                    .newsletter-section {
                        padding: 1.5rem;
                    }

                    .newsletter-form .input-group {
                        flex-direction: column;
                    }

                    .newsletter-form .btn {
                        width: 100%;
                        justify-content: center;
                        margin-top: 1rem;
                    }
                }

                .footer .row.g-4 {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 2.5rem;
                    margin: 0;
                }

                .footer .col-lg-3, .footer .col-md-6 {
                    flex: 1 1 0;
                    min-width: 0;
                    padding-left: 0;
                    padding-right: 0;
                }

                .footer .col-lg-3:first-child {
                    flex: 2 1 0;
                }

                @media (max-width: 991px) {
                    .footer .row.g-4 {
                        flex-direction: column;
                        gap: 1.5rem;
                    }
                    .footer .col-lg-3, .footer .col-md-6 {
                        flex: 1 1 100%;
                    }
                }
            </style>

            <footer class="footer">
                <div class="container">
                    <!-- Main Footer Widgets -->
                    <div class="row g-4">
                        <!-- Logo + Descripción -->
                        <div class="col-lg-3 col-md-6">
                            <div class="footer-brand">
                                <img src="${basePath}Multimedia/Images/Soged/LOGO%20SOGED.png" alt="SOGED">
                            </div>
                            <p class="footer-description">
                                Preserving and promoting the indigenous languages of Panama.<br>Modern, interactive learning for all.
                            </p>
                            <div class="social-links">
                                <a href="#" class="social-link"><i class="fab fa-facebook-f"></i></a>
                                <a href="#" class="social-link"><i class="fab fa-twitter"></i></a>
                                <a href="#" class="social-link"><i class="fab fa-instagram"></i></a>
                                <a href="#" class="social-link"><i class="fab fa-youtube"></i></a>
                            </div>
                        </div>
                        <!-- Learn -->
                        <div class="col-lg-3 col-md-6">
                            <h3 class="footer-title">Learn</h3>
                            <ul class="footer-links">
                                <li><a href="languages.html">Languages</a></li>
                                <li><a href="lessons.html">Lessons</a></li>
                                <li><a href="courses.html">Courses</a></li>
                                <li><a href="games.html">Games</a></li>
                            </ul>
                        </div>
                        <!-- Resources -->
                        <div class="col-lg-3 col-md-6">
                            <h3 class="footer-title">Resources</h3>
                            <ul class="footer-links">
                                <li><a href="dictionary.html">Dictionary</a></li>
                                <li><a href="audio.html">Audio Library</a></li>
                                <li><a href="videos.html">Video Lessons</a></li>
                                <li><a href="blog.html">Blog</a></li>
                            </ul>
                        </div>
                        <!-- Support -->
                        <div class="col-lg-3 col-md-6">
                            <h3 class="footer-title">Support</h3>
                            <ul class="footer-links">
                                <li><a href="help.html">Help Center</a></li>
                                <li><a href="contact.html">Contact Us</a></li>
                                <li><a href="faq.html">FAQ</a></li>
                                <li><a href="about.html">About Us</a></li>
                            </ul>
                        </div>
                    </div>
                    <!-- Newsletter Section -->
                    <div class="newsletter-section">
                        <div class="row align-items-center">
                            <div class="col-lg-6">
                                <h3>Stay Updated</h3>
                                <p>Get the latest updates about new languages, features, and cultural events.</p>
                            </div>
                            <div class="col-lg-6">
                                <form class="newsletter-form">
                                    <div class="input-group">
                                        <input type="email" class="form-control" placeholder="Enter your email">
                                        <button class="btn" type="submit">
                                            <i class="fas fa-paper-plane"></i>
                                            Subscribe
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Bottom Footer with Policies -->
                <div class="footer-bottom">
                    <div class="container">
                        <div class="row align-items-center">
                            <div class="col-lg-6">
                                <p class="copyright">
                                    <script>let year = new Date().getFullYear();</script>© ${year} Soged. All rights reserved. Preserving indigenous languages of Panama.
                                </p>
                            </div>
                            <div class="col-lg-6">
                                <ul class="footer-bottom-links">
                                    <li><a href="privacy.html">Privacy Policy</a></li>
                                    <li><a href="terms.html">Terms of Service</a></li>
                                    <li><a href="cookies.html">Cookie Policy</a></li>
                                    <li><a href="accessibility.html">Accessibility</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        `;
    }

    setupEventListeners() {
        const shadow = this.shadowRoot;
        
        // Newsletter form submission
        const newsletterForm = shadow.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = shadow.querySelector('.form-control').value;
                if (email) {
                    // Here you would typically send the email to your backend
                    alert('Thank you for subscribing!');
                    shadow.querySelector('.form-control').value = '';
                }
            });
        }

        // Social links hover effects
        const socialLinks = shadow.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                link.style.transform = 'translateY(-5px) scale(1.1)';
            });
            
            link.addEventListener('mouseleave', () => {
                link.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
}

// Register the custom element
customElements.define('soged-footer', SogedFooter); 