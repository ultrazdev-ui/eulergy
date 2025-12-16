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

// Enhanced smooth scrolling with active navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            // Remove active class from all nav links
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            
            // Add active class to clicked link
            this.classList.add('active');
            
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Update URL without jumping
            history.pushState(null, null, this.getAttribute('href'));
        }
    });
});

// Enhanced navbar scroll effect with active section detection
let lastScroll = 0;
const navbar = document.querySelector('.navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

// Progress indicator
const progressIndicator = document.createElement('div');
progressIndicator.className = 'progress-indicator';
document.body.appendChild(progressIndicator);

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Navbar styling
    if (currentScroll > 100) {
        navbar.style.padding = '10px 0';
        navbar.style.boxShadow = '0 5px 20px rgba(216, 150, 255, 0.3)';
    } else {
        navbar.style.padding = '20px 0';
        navbar.style.boxShadow = 'none';
    }
    
    // Progress indicator
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressIndicator.style.width = scrolled + '%';
    
    // Active section detection
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (currentScroll >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    // Update active nav link
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === current) {
            link.classList.add('active');
        }
    });
    
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
// Enhanced accessibility features
document.addEventListener('DOMContentLoaded', () => {
    // Keyboard navigation for custom elements
    document.querySelectorAll('.cta-button, .copy-btn, .social-btn').forEach(button => {
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                button.click();
            }
        });
    });
    
    // Focus management for mobile menu
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                menuToggle.click();
            }
        });
        
        // Focus first menu item when menu opens
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (navLinks.classList.contains('active')) {
                        const firstLink = navLinks.querySelector('a');
                        if (firstLink) {
                            setTimeout(() => firstLink.focus(), 100);
                        }
                    }
                }
            });
        });
        
        observer.observe(navLinks, { attributes: true });
    }
    
    // Enhanced section animations with intersection observer
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animate child elements with stagger
                const children = entry.target.querySelectorAll('.objective-item, .info-item');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.style.opacity = '1';
                        child.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('section-enter');
        sectionObserver.observe(section);
    });
    
    // Enhanced copy functionality with better feedback
    window.copyToClipboard = function(text) {
        const button = event.target.closest('.copy-btn');
        const originalText = button.innerHTML;
        
        // Add loading state
        button.classList.add('loading');
        button.disabled = true;
        
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                showCopySuccess(button, originalText);
            }).catch(err => {
                console.error('Error al copiar:', err);
                fallbackCopy(text, button, originalText);
            });
        } else {
            fallbackCopy(text, button, originalText);
        }
    };
    
    function showCopySuccess(button, originalText) {
        button.classList.remove('loading');
        button.classList.add('success');
        button.innerHTML = '<i class="fas fa-check" aria-hidden="true"></i> ¡Copiado!';
        button.disabled = false;
        
        setTimeout(() => {
            button.classList.remove('success');
            button.innerHTML = originalText;
        }, 2000);
        
        showNotification('¡Dirección copiada al portapapeles!', 'success');
    }
    
    function showCopyError(button, originalText) {
        button.classList.remove('loading');
        button.classList.add('error');
        button.innerHTML = '<i class="fas fa-times" aria-hidden="true"></i> Error';
        button.disabled = false;
        
        setTimeout(() => {
            button.classList.remove('error');
            button.innerHTML = originalText;
        }, 2000);
        
        showNotification('Error al copiar. Inténtalo de nuevo.', 'error');
    }
    
    // Enhanced tooltips
    function createTooltip(element, text) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.innerHTML = `
            <span class="tooltiptext">${text}</span>
        `;
        element.appendChild(tooltip);
    }
    
    // Add tooltips to complex elements
    const contractAddress = document.getElementById('contractAddress');
    if (contractAddress) {
        contractAddress.setAttribute('title', 'Dirección oficial del contrato inteligente de Eulergy en la blockchain');
    }
    
    // Enhanced keyboard navigation
    document.addEventListener('keydown', (e) => {
        // ESC key closes mobile menu
        if (e.key === 'Escape') {
            const navLinks = document.getElementById('navLinks');
            const menuToggle = document.getElementById('menuToggle');
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
                menuToggle.focus();
            }
        }
        
        // Tab navigation improvements
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    // Remove keyboard navigation class on mouse use
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // Enhanced loading states for external links
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const button = e.target.closest('.cta-button');
            if (button) {
                button.classList.add('loading');
                setTimeout(() => {
                    button.classList.remove('loading');
                }, 1000);
            }
        });
    });
    
    // Improved focus management
    let focusedElementBeforeModal;
    
    // Store focus when opening modals/menus
    document.addEventListener('focusin', (e) => {
        if (!e.target.closest('.nav-links.active')) {
            focusedElementBeforeModal = e.target;
        }
    });
    
    // Announce page changes to screen readers
    function announcePageChange(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
    
    // Announce section changes
    const sectionTitles = {
        'inicio': 'Sección de inicio',
        'vision': 'Sección de visión',
        'mision': 'Sección de misión',
        'contacto': 'Sección de contacto'
    };
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const section = e.target.getAttribute('data-section');
            if (sectionTitles[section]) {
                setTimeout(() => {
                    announcePageChange(`Navegando a ${sectionTitles[section]}`);
                }, 500);
            }
        });
    });
});

// Enhanced notification system with better accessibility
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.className = `notification notification-${type}`;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'assertive');
    
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
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    document.body.appendChild(notification);
    
    // Focus notification for screen readers
    notification.focus();
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Enhanced 3D card effects with accessibility considerations
document.querySelectorAll('.objective-item, .info-item').forEach(card => {
    let isHovered = false;
    
    function apply3DEffect(e) {
        if (!isHovered) return;
        
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 8;
        const rotateY = (centerX - x) / 8;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    }
    
    function reset3DEffect() {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        isHovered = false;
    }
    
    card.addEventListener('mouseenter', () => {
        isHovered = true;
    });
    
    card.addEventListener('mousemove', apply3DEffect);
    card.addEventListener('mouseleave', reset3DEffect);
    
    // Disable 3D effects for users who prefer reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        card.style.transform = 'none !important';
    }
});