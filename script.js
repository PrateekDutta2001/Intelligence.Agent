// ============================================
// INTELLIGENCE.AGENT - Main JavaScript
// ============================================

(function() {
    'use strict';

    // ============================================
    // INITIALIZATION
    // ============================================

    document.addEventListener('DOMContentLoaded', function() {
        initNavigation();
        initThemeToggle();
        initNeuralNetwork();
        initSmoothScrolling();
        initModuleAccordions();
        initCaseStudies();
        initScrollAnimations();
        initNewsletterForm();
        initScrollToTop();
        
        console.log('%c🤖 Intelligence.Agent', 'color: #3b82f6; font-size: 24px; font-weight: bold;');
        console.log('%cBuild, Learn & Deploy Real-World AI Agents', 'color: #06b6d4; font-size: 14px;');
    });

    // ============================================
    // NAVIGATION
    // ============================================

    function initNavigation() {
        const navbar = document.getElementById('navbar');
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        const navLinks = document.querySelectorAll('.nav-link');

        // Scroll effect on navbar
        let lastScroll = 0;
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            lastScroll = currentScroll;
        }, { passive: true });

        // Mobile menu toggle
        if (navToggle) {
            navToggle.addEventListener('click', function() {
                const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
                navToggle.setAttribute('aria-expanded', !isExpanded);
                navMenu.classList.toggle('active');
            });
        }

        // Active link highlighting
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                if (window.innerWidth <= 768) {
                    navMenu.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });

        // Highlight active section on scroll
        window.addEventListener('scroll', updateActiveNavLink, { passive: true });
    }

    function updateActiveNavLink() {
        const sections = document.querySelectorAll('.section, .hero');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // ============================================
    // THEME TOGGLE
    // ============================================

    function initThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const themeIcon = document.getElementById('themeIcon');
        const html = document.documentElement;
        
        // Load saved theme
        const savedTheme = localStorage.getItem('theme') || 'dark';
        html.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);

        if (themeToggle) {
            themeToggle.addEventListener('click', function() {
                const currentTheme = html.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                
                html.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                updateThemeIcon(newTheme);
            });
        }

        function updateThemeIcon(theme) {
            if (themeIcon) {
                themeIcon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
            }
        }
    }

    // ============================================
    // NEURAL NETWORK CANVAS ANIMATION
    // ============================================

    function initNeuralNetwork() {
        const canvas = document.getElementById('neuralNetwork');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrame;
        
        // Set canvas size
        function resizeCanvas() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Node class
        class Node {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 2 + 1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(59, 130, 246, 0.6)';
                ctx.fill();
            }
        }

        // Create nodes
        const nodeCount = 50;
        const nodes = [];
        
        for (let i = 0; i < nodeCount; i++) {
            nodes.push(new Node(
                Math.random() * canvas.width,
                Math.random() * canvas.height
            ));
        }

        // Animation loop
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update and draw nodes
            nodes.forEach(node => {
                node.update();
                node.draw();
            });

            // Draw connections
            nodes.forEach((nodeA, i) => {
                nodes.slice(i + 1).forEach(nodeB => {
                    const dx = nodeB.x - nodeA.x;
                    const dy = nodeB.y - nodeA.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 150) {
                        ctx.beginPath();
                        ctx.moveTo(nodeA.x, nodeA.y);
                        ctx.lineTo(nodeB.x, nodeB.y);
                        ctx.strokeStyle = `rgba(59, 130, 246, ${0.3 * (1 - distance / 150)})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                });
            });

            animationFrame = requestAnimationFrame(animate);
        }

        // Start animation
        animate();

        // Pause when tab is not visible
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                cancelAnimationFrame(animationFrame);
            } else {
                animate();
            }
        });
    }

    // ============================================
    // SMOOTH SCROLLING
    // ============================================

    function initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#' || !href) return;

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const offsetTop = target.offsetTop - 80;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ============================================
    // MODULE ACCORDIONS
    // ============================================

    function initModuleAccordions() {
        const expandButtons = document.querySelectorAll('.module-expand');
        
        expandButtons.forEach(button => {
            button.addEventListener('click', function() {
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                const newExpanded = !isExpanded;
                
                this.setAttribute('aria-expanded', newExpanded);
                
                // Close other accordions if needed (optional)
                // expandButtons.forEach(btn => {
                //     if (btn !== this) {
                //         btn.setAttribute('aria-expanded', 'false');
                //     }
                // });
            });
        });
    }

    // ============================================
    // CASE STUDIES
    // ============================================

    function initCaseStudies() {
        const caseStudiesGrid = document.getElementById('caseStudiesGrid');
        const modal = document.getElementById('caseStudyModal');
        const modalBody = document.getElementById('caseStudyModalBody');
        const modalClose = document.querySelector('#caseStudyModal .modal-close');
        const modalOverlay = document.querySelector('#caseStudyModal .modal-overlay');
        
        if (!caseStudiesGrid) return;

        // Load modal data
        const modalDataScript = document.getElementById('modalData');
    let modalData = {};

    if (modalDataScript) {
        try {
            modalData = JSON.parse(modalDataScript.textContent);
        } catch (e) {
            console.error('Error parsing modal data:', e);
        }
    }

        // Case studies from all categories
        const caseStudies = [
            // Agentic AI
            { id: 'agentic-ai-1', category: 'Agentic AI', title: 'E-Commerce Personal Shopping Assistant', description: 'An AI agent that autonomously browses products, compares prices, and makes purchase recommendations.', icon: 'fas fa-shopping-cart' },
            { id: 'agentic-ai-2', category: 'Agentic AI', title: 'Autonomous Delivery Drones', description: 'Self-navigating drones that plan routes, avoid obstacles, and coordinate with other drones.', icon: 'fas fa-route' },
            { id: 'agentic-ai-3', category: 'Agentic AI', title: 'Healthcare Diagnostic Agent', description: 'An AI agent that analyzes patient symptoms and provides treatment recommendations.', icon: 'fas fa-user-md' },
            // RAG & Knowledge Workflows
            { id: 'rag-1', category: 'RAG & Knowledge Workflows', title: 'Enterprise Customer Support', description: 'RAG systems that retrieve relevant documentation and FAQs to provide accurate, context-aware answers.', icon: 'fas fa-headset' },
            { id: 'rag-2', category: 'RAG & Knowledge Workflows', title: 'Legal Research Assistant', description: 'AI systems that search through case law and legal precedents to help lawyers find relevant information.', icon: 'fas fa-briefcase' },
            { id: 'rag-3', category: 'RAG & Knowledge Workflows', title: 'Scientific Literature Analysis', description: 'Researchers using RAG to query scientific databases and generate literature reviews with citations.', icon: 'fas fa-flask' },
            // Neural Networks
            { id: 'nn-1', category: 'Neural Networks', title: 'Medical Image Diagnosis', description: 'CNN-based systems that analyze X-rays, MRIs, and CT scans to detect tumors and diseases.', icon: 'fas fa-image' },
            { id: 'nn-2', category: 'Neural Networks', title: 'Real-Time Language Translation', description: 'Sequence-to-sequence neural networks that translate between languages in real-time.', icon: 'fas fa-language' },
            { id: 'nn-3', category: 'Neural Networks', title: 'Autonomous Vehicle Navigation', description: 'Deep neural networks processing sensor data to recognize objects and make driving decisions.', icon: 'fas fa-car' },
            // Explainable AI
            { id: 'xai-1', category: 'Explainable AI', title: 'Loan Approval Transparency', description: 'Banks using XAI to explain why loan applications are approved or rejected.', icon: 'fas fa-credit-card' },
            { id: 'xai-2', category: 'Explainable AI', title: 'Legal Case Prediction & Reasoning', description: 'AI systems that predict case outcomes while providing interpretable explanations.', icon: 'fas fa-gavel' },
            { id: 'xai-3', category: 'Explainable AI', title: 'Medical Diagnosis Explanation', description: 'Healthcare AI that highlights which symptoms and test results led to the diagnosis.', icon: 'fas fa-heartbeat' },
            // Prompt Engineering
            { id: 'prompt-1', category: 'Prompt Engineering', title: 'Code Generation & Debugging', description: 'Engineers using structured prompts to generate production-ready code and debug complex issues.', icon: 'fas fa-code' },
            { id: 'prompt-2', category: 'Prompt Engineering', title: 'Content Creation & Marketing', description: 'Marketing teams crafting prompts to generate blog posts and ad copy tailored to audiences.', icon: 'fas fa-file-alt' },
            { id: 'prompt-3', category: 'Prompt Engineering', title: 'Personalized Learning Tutors', description: 'Educational platforms using engineered prompts to create adaptive learning experiences.', icon: 'fas fa-graduation-cap' },
            // Machine Learning
            { id: 'ml-1', category: 'Machine Learning', title: 'Email Spam Detection', description: 'ML models that automatically classify emails as spam or legitimate by analyzing content patterns.', icon: 'fas fa-envelope' },
            { id: 'ml-2', category: 'Machine Learning', title: 'House Price Prediction', description: 'Regression models that predict real estate prices based on location, size, and features.', icon: 'fas fa-home' },
            { id: 'ml-3', category: 'Machine Learning', title: 'Customer Segmentation', description: 'Unsupervised learning algorithms that group customers based on purchasing behavior.', icon: 'fas fa-users' }
        ];

        // Render case studies
        caseStudies.forEach(study => {
            const card = createCaseStudyCard(study);
            caseStudiesGrid.appendChild(card);
        });

        function createCaseStudyCard(study) {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.setAttribute('data-modal', study.id);
            
            card.innerHTML = `
                <div class="project-image">
                    <div class="project-placeholder">
                        <i class="${study.icon}"></i>
                    </div>
                </div>
                <div class="project-content">
                    <span class="project-category">${study.category}</span>
                    <h3 class="project-title">${study.title}</h3>
                    <p class="project-description">${study.description}</p>
                    <div class="project-actions">
                        <button class="btn btn-demo">View Case Study</button>
                    </div>
                </div>
            `;

            card.addEventListener('click', function() {
                openCaseStudyModal(study.id);
            });

            return card;
        }

        function openCaseStudyModal(studyId) {
            const data = modalData[studyId];
            if (!data) {
                // Fallback for case studies without full modal data
                const study = caseStudies.find(s => s.id === studyId);
                if (!study) {
                    console.error('Case study not found:', studyId);
                    return;
                }
                
                // Show simplified modal
                modalBody.innerHTML = `
                    <div class="modal-header">
                        <span class="modal-category">${study.category}</span>
                        <h2 class="modal-title">
                            <i class="${study.icon}"></i>
                            ${study.title}
                        </h2>
                        <p class="modal-description">${study.description}</p>
                    </div>
                    <div class="modal-section">
                        <p>Full case study details coming soon. Explore more case studies in the <a href="#case-studies" style="color: var(--accent-cyan);">Case Studies</a> section.</p>
                    </div>
                `;
                
                modal.classList.add('active');
                modal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
                return;
            }

        modalBody.innerHTML = `
            <div class="modal-header">
                <span class="modal-category">${data.category}</span>
                <h2 class="modal-title">
                    <i class="${data.icon}"></i>
                    ${data.title}
                </h2>
                <p class="modal-description">${data.description}</p>
            </div>

            <div class="modal-section">
                <h3><i class="fas fa-info-circle"></i> Overview</h3>
                <p>${data.details}</p>
            </div>

            <div class="modal-section">
                <h3><i class="fas fa-cogs"></i> How It Works</h3>
                <ul class="modal-list">
                    ${data.howItWorks.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>

            <div class="modal-section">
                <h3><i class="fas fa-globe"></i> Real-World Example</h3>
                <div class="example-highlight">
                    <p>${data.realWorldExample}</p>
                </div>
            </div>

            <div class="modal-section">
                <h3><i class="fas fa-check-circle"></i> Benefits</h3>
                <ul class="modal-list">
                    ${data.benefits.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>

            <div class="modal-section">
                <h3><i class="fas fa-tools"></i> Key Technologies</h3>
                <div class="modal-tags">
                    ${data.technologies.map(tech => `<span class="modal-tag">${tech}</span>`).join('')}
                </div>
            </div>
        `;

        modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

        function closeCaseStudyModal() {
        modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    if (modalClose) {
            modalClose.addEventListener('click', closeCaseStudyModal);
    }

    if (modalOverlay) {
            modalOverlay.addEventListener('click', closeCaseStudyModal);
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeCaseStudyModal();
            }
        });
    }

    // ============================================
    // SCROLL ANIMATIONS
    // ============================================

    function initScrollAnimations() {
        // Avoid hiding entire .section blocks: on mobile, IntersectionObserver can miss
        // or fire late (dynamic viewport, momentum scroll), leaving Case Studies / Insights invisible.
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            return;
        }

        const observerOptions = {
            threshold: 0,
            rootMargin: '0px 0px 15% 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.path-card, .module-card, .project-card, .blog-card').forEach(el => {
            el.style.opacity = '0';
            observer.observe(el);
        });
    }

    // ============================================
    // NEWSLETTER FORM
    // ============================================

    function initNewsletterForm() {
        const newsletterForm = document.querySelector('.newsletter-form');
        
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = this.querySelector('input[type="email"]').value;
                
                // Mock submission
                alert(`Thank you for subscribing! You'll receive updates at ${email}`);
                this.reset();
            });
        }
    }

    // ============================================
    // SCROLL TO TOP (Optional Enhancement)
    // ============================================

    function initScrollToTop() {
        // Can add a scroll-to-top button if needed
        // Implementation omitted for brevity
    }

})();
