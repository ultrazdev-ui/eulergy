// Loading Screen
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }, 1000);
});

// Energy Canvas Animation - Optimized with mobile detection
const canvas = document.getElementById('energyCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d', { alpha: true });
    let animationId;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resizeCanvas, 250);
    });
    
    // Energy particles - Optimized
    class EnergyParticle {
        constructor() {
            this.reset();
            this.baseR = 0 + Math.random() * 100;
            this.baseG = 150 + Math.random() * 100;
            this.baseB = 200 + Math.random() * 55;
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2.5 + 1;
            this.speedX = (Math.random() - 0.5) * 1.5;
            this.speedY = (Math.random() - 0.5) * 1.5;
            this.life = 1;
            this.decay = Math.random() * 0.008 + 0.004;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life -= this.decay;
            
            if (this.life <= 0 || this.x < -10 || this.x > canvas.width + 10 || this.y < -10 || this.y > canvas.height + 10) {
                this.reset();
            }
        }
        
        draw() {
            ctx.globalAlpha = this.life * 0.8;
            ctx.fillStyle = `rgb(${this.baseR}, ${this.baseG}, ${this.baseB})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Create particles - Reduced count for mobile
    const particles = [];
    const particleCount = isMobile ? 25 : 50;
    for (let i = 0; i < particleCount; i++) {
        particles.push(new EnergyParticle());
    }
    
    // Animation loop - Optimized
    let lastTime = 0;
    const fps = 60;
    const interval = 1000 / fps;
    
    function animateEnergy(currentTime) {
        animationId = requestAnimationFrame(animateEnergy);
        
        const deltaTime = currentTime - lastTime;
        if (deltaTime < interval) return;
        
        lastTime = currentTime - (deltaTime % interval);
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.shadowBlur = 10;
        
        // Update and draw particles
        particles.forEach(particle => {
            particle.update();
            ctx.shadowColor = `rgba(${particle.baseR}, ${particle.baseG}, ${particle.baseB}, ${particle.life * 0.5})`;
            particle.draw();
        });
        
        // Draw connections - Optimized with distance check
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    const opacity = (1 - distance / 120) * 0.25;
                    ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    animateEnergy(0);
    
    // Pause animation when tab is not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            animateEnergy(0);
        }
    });
}

// Logo rotation effect on click
const logoImg = document.querySelector('.logo-img');
if (logoImg) {
    logoImg.addEventListener('click', () => {
        logoImg.style.animation = 'none';
        setTimeout(() => {
            logoImg.style.animation = 'logoSpin 0.6s ease-in-out';
        }, 10);
        
        // Remove animation after it completes
        setTimeout(() => {
            logoImg.style.animation = '';
        }, 610);
    });
}

// Smooth scrolling para los enlaces de navegación
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.padding = '10px 0';
        navbar.style.boxShadow = '0 5px 20px rgba(216, 150, 255, 0.3)';
    } else {
        navbar.style.padding = '20px 0';
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// Animación de entrada para elementos
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observar elementos para animación
document.querySelectorAll('.objective-item, .vision-text, .mission-intro').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// Menu toggle para móvil - Mejorado con overlay
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

// Crear overlay para menú móvil
const mobileOverlay = document.createElement('div');
mobileOverlay.className = 'mobile-menu-overlay';
document.body.appendChild(mobileOverlay);

if (menuToggle && navLinks) {
    function toggleMenu() {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
        
        // Prevenir scroll del body cuando el menú está abierto
        if (!isExpanded) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
    
    function closeMenu() {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
        mobileOverlay.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
    
    menuToggle.addEventListener('click', toggleMenu);
    
    // Cerrar menú al hacer clic en el overlay
    mobileOverlay.addEventListener('click', closeMenu);
    
    // Cerrar menú al hacer clic en un enlace
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    // Cerrar menú con tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            closeMenu();
        }
    });
}

// Efecto parallax en hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Función para copiar al portapapeles - Mejorada con fallback
function copyToClipboard(text) {
    // Método moderno
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('¡Copiado al portapapeles!', 'success');
        }).catch(err => {
            console.error('Error al copiar:', err);
            fallbackCopy(text);
        });
    } else {
        // Fallback para navegadores antiguos
        fallbackCopy(text);
    }
}

// Fallback para copiar en navegadores antiguos
function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
        document.execCommand('copy');
        showNotification('¡Copiado al portapapeles!', 'success');
    } catch (err) {
        console.error('Error al copiar:', err);
        showNotification('Error al copiar', 'error');
    }
    document.body.removeChild(textArea);
}

// Función para mostrar notificaciones
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #27ae60, #2ecc71)' : 'linear-gradient(135deg, #e74c3c, #c0392b)'};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 10px 30px ${type === 'success' ? 'rgba(39, 174, 96, 0.4)' : 'rgba(231, 76, 60, 0.4)'};
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Agregar animaciones para notificaciones
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyle);

// Efecto hover en cards con movimiento 3D
document.querySelectorAll('.objective-item').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// Contador animado para proyectos
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 20);
}



// Back to Top Button
const backToTopButton = document.getElementById('backToTop');

if (backToTopButton) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Efecto parallax optimizado en hero
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const heroBackground = document.querySelector('.hero-background');
            if (heroBackground && scrolled < window.innerHeight) {
                heroBackground.style.transform = `translate3d(0, ${scrolled * 0.5}px, 0)`;
            }
            ticking = false;
        });
        ticking = true;
    }
});
// ===== ACCESSIBILITY & VISUAL IMPROVEMENTS =====

// Accessibility and Motion Preferences Detection
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;

// Announcements for Screen Readers
function announceToScreenReader(message) {
    const announcements = document.getElementById('announcements');
    if (announcements) {
        announcements.textContent = message;
        setTimeout(() => {
            announcements.textContent = '';
        }, 1000);
    }
}

// Enhanced Navigation System with Accessibility
const enhancedNavigationLinks = document.querySelectorAll('.nav-link');
const enhancedSections = document.querySelectorAll('section[id]');

if (enhancedSections.length > 0 && enhancedNavigationLinks.length > 0) {
    // Improved section detection
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '-100px 0px -100px 0px'
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                
                // Update active nav link with accessibility
                enhancedNavigationLinks.forEach(link => {
                    link.classList.remove('active');
                    link.setAttribute('aria-current', 'false');
                    if (link.getAttribute('data-section') === sectionId) {
                        link.classList.add('active');
                        link.setAttribute('aria-current', 'page');
                        
                        // Visual feedback with reduced motion respect
                        if (!prefersReducedMotion) {
                            link.style.transform = 'scale(1.05)';
                            setTimeout(() => {
                                link.style.transform = 'scale(1)';
                            }, 200);
                        }
                        
                        // Announce section change
                        const sectionNames = {
                            'inicio': 'Sección de Inicio',
                            'vision': 'Sección de Visión',
                            'mision': 'Sección de Misión',
                            'contacto': 'Sección de Contacto'
                        };
                        announceToScreenReader(`Navegando a ${sectionNames[sectionId]}`);
                    }
                });
            }
        });
    }, observerOptions);
    
    enhancedSections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    // Enhanced click navigation with accessibility
    enhancedNavigationLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Calculate offset for navbar
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight - 20;
                
                // Smooth scroll with reduced motion respect
                if (prefersReducedMotion) {
                    window.scrollTo(0, targetPosition);
                } else {
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
                
                // Immediate visual feedback
                enhancedNavigationLinks.forEach(l => {
                    l.classList.remove('active');
                    l.setAttribute('aria-current', 'false');
                });
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
                
                // Focus management
                targetSection.setAttribute('tabindex', '-1');
                targetSection.focus();
                setTimeout(() => {
                    targetSection.removeAttribute('tabindex');
                }, 1000);
            }
        });
    });
}

// Enhanced Back to Top Button with Accessibility
const enhancedBackToTopButton = document.getElementById('backToTop');

if (enhancedBackToTopButton) {
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        if (scrollPosition > windowHeight * 0.3) {
            enhancedBackToTopButton.classList.add('visible');
            enhancedBackToTopButton.setAttribute('aria-hidden', 'false');
        } else {
            enhancedBackToTopButton.classList.remove('visible');
            enhancedBackToTopButton.setAttribute('aria-hidden', 'true');
        }
    });

    // Enhanced click functionality with accessibility
    enhancedBackToTopButton.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Add click animation if motion is allowed
        if (!prefersReducedMotion) {
            enhancedBackToTopButton.style.transform = 'scale(0.9)';
            setTimeout(() => {
                enhancedBackToTopButton.style.transform = 'scale(1)';
            }, 150);
        }
        
        // Smooth scroll to top with motion preference
        const heroSection = document.getElementById('inicio');
        if (heroSection) {
            if (prefersReducedMotion) {
                window.scrollTo(0, 0);
            } else {
                heroSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
        
        // Update active navigation and announce
        enhancedNavigationLinks.forEach(link => {
            link.classList.remove('active');
            link.setAttribute('aria-current', 'false');
            if (link.getAttribute('data-section') === 'inicio') {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        });
        
        // Focus management and announcement
        if (heroSection) {
            heroSection.setAttribute('tabindex', '-1');
            heroSection.focus();
            setTimeout(() => {
                heroSection.removeAttribute('tabindex');
            }, 1000);
        }
        
        announceToScreenReader('Volviendo al inicio de la página');
        showToast('¡Volviendo al inicio! 🚀', 'info', 2000);
    });
    
    // Add keyboard support
    enhancedBackToTopButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            enhancedBackToTopButton.click();
        }
    });
}

// Enhanced Button Ripple Effects with Motion Preference
const enhancedButtons = document.querySelectorAll('.enhanced-button');

enhancedButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        // Only add ripple effect if motion is not reduced
        if (!prefersReducedMotion) {
            const ripple = this.querySelector('.button-ripple');
            if (ripple) {
                // Reset ripple
                ripple.style.width = '0';
                ripple.style.height = '0';
                
                // Trigger ripple effect
                setTimeout(() => {
                    ripple.style.width = '300px';
                    ripple.style.height = '300px';
                }, 10);
                
                // Reset after animation
                setTimeout(() => {
                    ripple.style.width = '0';
                    ripple.style.height = '0';
                }, 600);
            }
            
            // Add micro-bounce animation
            this.classList.add('micro-bounce');
            setTimeout(() => {
                this.classList.remove('micro-bounce');
            }, 600);
        }
    });
});

// Enhanced Toast Notification System with Accessibility
const toastContainer = document.getElementById('toastContainer');

function showToast(message, type = 'success', duration = 3000) {
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    
    // Create toast content
    const toastContent = document.createElement('div');
    toastContent.style.cssText = `
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 500;
        font-size: 14px;
    `;
    
    // Add icon based on type
    const icon = document.createElement('i');
    icon.setAttribute('aria-hidden', 'true');
    switch(type) {
        case 'success':
            icon.className = 'fas fa-check-circle';
            break;
        case 'error':
            icon.className = 'fas fa-exclamation-circle';
            break;
        case 'info':
            icon.className = 'fas fa-info-circle';
            break;
        default:
            icon.className = 'fas fa-bell';
    }
    
    const messageSpan = document.createElement('span');
    messageSpan.textContent = message;
    
    toastContent.appendChild(icon);
    toastContent.appendChild(messageSpan);
    toast.appendChild(toastContent);
    
    // Add to container
    toastContainer.appendChild(toast);
    
    // Show toast with motion preference
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, prefersReducedMotion ? 100 : 400);
    }, duration);
    
    // Click to dismiss
    toast.addEventListener('click', () => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, prefersReducedMotion ? 100 : 400);
    });
    
    // Keyboard dismiss
    toast.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            toast.click();
        }
    });
}

// Section Transition Animations with Motion Preference
const sectionElements = document.querySelectorAll('.vision-text, .mission-intro, .objective-item, .info-item');

if (!prefersReducedMotion) {
    const transitionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-transition', 'visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    sectionElements.forEach(element => {
        element.classList.add('section-transition');
        transitionObserver.observe(element);
    });
} else {
    // For reduced motion, just make elements visible
    sectionElements.forEach(element => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    });
}

// Enhanced Copy Function with Accessibility
window.copyToClipboard = function(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('¡Copiado al portapapeles!', 'success');
            announceToScreenReader('Dirección copiada al portapapeles');
        }).catch(err => {
            console.error('Error al copiar:', err);
            fallbackCopy(text);
        });
    } else {
        fallbackCopy(text);
    }
};

function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.setAttribute('aria-hidden', 'true');
    document.body.appendChild(textArea);
    textArea.select();
    try {
        document.execCommand('copy');
        showToast('¡Copiado al portapapeles!', 'success');
        announceToScreenReader('Dirección copiada al portapapeles');
    } catch (err) {
        console.error('Error al copiar:', err);
        showToast('Error al copiar', 'error');
        announceToScreenReader('Error al copiar al portapapeles');
    }
    document.body.removeChild(textArea);
}

// Enhanced 3D Card Effects with Motion Preference
document.querySelectorAll('.objective-item, .info-item').forEach(card => {
    if (!prefersReducedMotion) {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'transform 0.1s ease';
        });
        
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transition = 'transform 0.3s ease';
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    }
    
    // Add keyboard interaction
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            // Add focus effect
            card.style.transform = 'translateY(-5px)';
            setTimeout(() => {
                card.style.transform = 'translateY(0)';
            }, 200);
        }
    });
});

// Keyboard Navigation Enhancement with Accessibility
document.addEventListener('keydown', (e) => {
    // Back to top with 'Home' key
    if (e.key === 'Home' && e.ctrlKey) {
        e.preventDefault();
        if (enhancedBackToTopButton) {
            enhancedBackToTopButton.click();
        }
    }
    
    // Section navigation with arrow keys (when not in input)
    if (!['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
        if (e.key === 'ArrowDown' && e.ctrlKey) {
            e.preventDefault();
            scrollToNextSection();
        } else if (e.key === 'ArrowUp' && e.ctrlKey) {
            e.preventDefault();
            scrollToPrevSection();
        }
    }
});

// Section Navigation Functions
function scrollToNextSection() {
    const currentSection = getCurrentSection();
    const sectionIds = ['inicio', 'vision', 'mision', 'contacto'];
    const currentIndex = sectionIds.indexOf(currentSection);
    const nextIndex = (currentIndex + 1) % sectionIds.length;
    const nextSection = document.getElementById(sectionIds[nextIndex]);
    
    if (nextSection) {
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = nextSection.offsetTop - navbarHeight - 20;
        
        if (prefersReducedMotion) {
            window.scrollTo(0, targetPosition);
        } else {
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
        
        announceToScreenReader(`Navegando a la siguiente sección: ${sectionIds[nextIndex]}`);
    }
}

function scrollToPrevSection() {
    const currentSection = getCurrentSection();
    const sectionIds = ['inicio', 'vision', 'mision', 'contacto'];
    const currentIndex = sectionIds.indexOf(currentSection);
    const prevIndex = currentIndex === 0 ? sectionIds.length - 1 : currentIndex - 1;
    const prevSection = document.getElementById(sectionIds[prevIndex]);
    
    if (prevSection) {
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = prevSection.offsetTop - navbarHeight - 20;
        
        if (prefersReducedMotion) {
            window.scrollTo(0, targetPosition);
        } else {
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
        
        announceToScreenReader(`Navegando a la sección anterior: ${sectionIds[prevIndex]}`);
    }
}

function getCurrentSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.pageYOffset + 200;
    
    for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i].offsetTop <= scrollPosition) {
            return sections[i].id;
        }
    }
    return 'inicio';
}

// Initialize accessibility features on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Set initial aria-current for active nav link
    const activeLink = document.querySelector('.nav-link.active');
    if (activeLink) {
        activeLink.setAttribute('aria-current', 'page');
    }
    
    // Add glow effect to important elements (respecting motion preference)
    if (!prefersReducedMotion) {
        const glowElements = document.querySelectorAll('.cta-button, .logo-img');
        glowElements.forEach(element => {
            element.classList.add('micro-glow');
        });
    }
    
    // Show welcome toast
    setTimeout(() => {
        showToast('¡Bienvenido a Eulergy! 🚀', 'info', 4000);
    }, 2000);
    
    // Announce page load completion
    announceToScreenReader('Página de Eulergy cargada completamente');
});

// Performance and Error Monitoring
let performanceMetrics = {
    loadTime: 0,
    scrollEvents: 0,
    interactions: 0
};

// Track load time
window.addEventListener('load', () => {
    performanceMetrics.loadTime = performance.now();
    console.log(`Eulergy loaded in ${performanceMetrics.loadTime.toFixed(2)}ms`);
    
    // Log accessibility preferences
    console.log('Accessibility preferences:', {
        reducedMotion: prefersReducedMotion,
        highContrast: prefersHighContrast
    });
});

// Welcome message with accessibility info
console.log('%c🚀 Eulergy - Cada idea genera energía', 'color: #00d4ff; font-size: 16px; font-weight: bold;');
console.log('%c♿ Accessibility Enhanced Version', 'color: #2ecc71; font-size: 12px;');
console.log('%c✨ Visual Improvements Active', 'color: #2196f3; font-size: 12px;');