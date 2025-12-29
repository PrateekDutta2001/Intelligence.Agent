// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';

    // Get all service items
    const serviceItems = document.querySelectorAll('.service-item');

    // Add click tracking and animation
    serviceItems.forEach(item => {
        // Add ripple effect on click
        item.addEventListener('click', function(e) {
            // Create ripple element
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');

            this.appendChild(ripple);

            // Remove ripple after animation
            setTimeout(() => {
                ripple.remove();
            }, 600);

            // Add loading state
            this.classList.add('loading');
        });

        // Add mouse enter/leave effects
        item.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            
            // Animate icon
            const icon = this.querySelector('.bg-icon i');
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(10deg)';
            }
        });

        item.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.bg-icon i');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });

        // Add keyboard navigation support
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all fadeInUp elements
    const fadeElements = document.querySelectorAll('.fadeInUp');
    fadeElements.forEach(el => {
        observer.observe(el);
    });

    // Add parallax effect to background (subtle)
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const container = document.querySelector('.container-xxl');
        
        if (container) {
            const parallaxValue = (scrollTop - lastScrollTop) * 0.1;
            container.style.transform = `translateY(${parallaxValue}px)`;
        }
        
        lastScrollTop = scrollTop;
    }, { passive: true });

    // Add cursor trail effect (optional, can be disabled)
    let cursorTrail = [];
    const maxTrailLength = 5;

    document.addEventListener('mousemove', function(e) {
        // Only add trail on service items
        const serviceItem = e.target.closest('.service-item');
        if (serviceItem) {
            const trail = document.createElement('div');
            trail.className = 'cursor-trail';
            trail.style.left = e.clientX + 'px';
            trail.style.top = e.clientY + 'px';
            document.body.appendChild(trail);

            cursorTrail.push(trail);

            if (cursorTrail.length > maxTrailLength) {
                const oldTrail = cursorTrail.shift();
                oldTrail.remove();
            }

            setTimeout(() => {
                trail.style.opacity = '0';
                trail.style.transform = 'scale(0)';
                setTimeout(() => trail.remove(), 300);
            }, 500);
        }
    });

    // Add interactions for example cards
    const exampleCards = document.querySelectorAll('.example-card');
    
    exampleCards.forEach(card => {
        // Add hover effect with icon animation
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.example-icon');
            if (icon) {
                icon.style.transform = 'rotate(5deg) scale(1.15)';
            }
            
            // Animate tags
            const tags = this.querySelectorAll('.tag');
            tags.forEach((tag, index) => {
                setTimeout(() => {
                    tag.style.transform = 'translateY(-3px)';
                }, index * 50);
            });
        });

        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.example-icon');
            if (icon) {
                icon.style.transform = 'rotate(0deg) scale(1)';
            }
            
            const tags = this.querySelectorAll('.tag');
            tags.forEach(tag => {
                tag.style.transform = 'translateY(0)';
            });
        });

        // Add click handler to open modal
        card.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.getAttribute('data-modal');
            if (modalId) {
                openModal(modalId);
            }
        });
    });

    // Add staggered animation for example categories
    const exampleCategories = document.querySelectorAll('.example-category');
    const categoryObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Animate cards within category
                const cards = entry.target.querySelectorAll('.example-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });

    exampleCategories.forEach(category => {
        category.style.opacity = '0';
        category.style.transform = 'translateY(30px)';
        category.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        const cards = category.querySelectorAll('.example-card');
        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });
        
        categoryObserver.observe(category);
    });

    // Modal functionality
    const modal = document.getElementById('exampleModal');
    const modalBody = document.getElementById('modalBody');
    const modalClose = document.querySelector('.modal-close');
    const modalOverlay = document.querySelector('.modal-overlay');
    let modalData = {};

    // Load modal data from JSON script tag
    const modalDataScript = document.getElementById('modalData');
    if (modalDataScript) {
        try {
            modalData = JSON.parse(modalDataScript.textContent);
        } catch (e) {
            console.error('Error parsing modal data:', e);
        }
    }

    // Function to open modal
    function openModal(modalId) {
        const data = modalData[modalId];
        if (!data) {
            console.error('Modal data not found for:', modalId);
            return;
        }

        // Populate modal content
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

        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Function to close modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Event listeners for closing modal
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }

    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Console welcome message
    console.log('%c🎓 Welcome to Personalized Tutorial!', 'color: #4f46e5; font-size: 20px; font-weight: bold;');
    console.log('%cExplore AI, ML, and Data Science concepts', 'color: #6b7280; font-size: 14px;');
});

// Add CSS for ripple effect dynamically
const style = document.createElement('style');
style.textContent = `
    .service-item {
        position: relative;
        overflow: hidden;
    }

    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }

    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    .cursor-trail {
        position: fixed;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: rgba(79, 70, 229, 0.5);
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        transition: opacity 0.3s ease, transform 0.3s ease;
    }

    .service-item:focus {
        outline: 3px solid var(--primary-color);
        outline-offset: 3px;
    }
`;
document.head.appendChild(style);

