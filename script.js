/**
 * EBSS Web Studio - Main JavaScript
 * Features: Smooth scroll, Form handling, Analytics, Theme switching, Mobile optimization
 */

// ========== MOBILE MENU TOGGLE ==========
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        navLinks.classList.toggle('mobile-open');
    }
}

function closeMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        navLinks.classList.remove('mobile-open');
    }
}

// Close menu when a link is clicked
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });
});
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const element = document.querySelector(href);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
                
                // Track navigation event in analytics
                if (window.gtag) {
                    gtag('event', 'navigation', {
                        'section': href.substring(1)
                    });
                }
            }
        }
    });
});

// ========== CONTACT FORM HANDLING ==========
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = this.querySelector('input[placeholder="Your Name"]').value;
        const email = this.querySelector('input[placeholder="Your Email"]').value;
        
        // Track form submission in analytics
        if (window.gtag) {
            gtag('event', 'form_submission', {
                'form_name': 'contact_form',
                'user_email': email
            });
        }
        
        // Show success message
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Message Sent! ✓';
        submitBtn.disabled = true;
        
        // Reset form
        this.reset();
        
        // Reset button after 3 seconds
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 3000);
        
        console.log('Form submitted:', { name, email });
    });
}

// ========== THEME MANAGEMENT ==========
class ThemeManager {
    constructor() {
        this.themesAvailable = [
            'default',
            'dark-theme',
            'minimalist-theme',
            'ocean-theme',
            'sunset-theme',
            'forest-theme',
            'grape-theme'
        ];
        this.currentTheme = this.getStoredTheme() || 'default';
        this.init();
    }
    
    init() {
        this.applyTheme(this.currentTheme);
        this.createThemeSwitcher();
    }
    
    getStoredTheme() {
        return localStorage.getItem('ebss-theme');
    }
    
    storeTheme(theme) {
        localStorage.setItem('ebss-theme', theme);
    }
    
    applyTheme(theme) {
        document.body.className = '';
        if (theme !== 'default') {
            document.body.classList.add(theme);
        }
        this.currentTheme = theme;
        this.storeTheme(theme);
        
        // Track theme change
        if (window.gtag) {
            gtag('event', 'theme_changed', {
                'theme': theme
            });
        }
    }
    
    switchTheme(theme) {
        if (this.themesAvailable.includes(theme)) {
            this.applyTheme(theme);
        }
    }
    
    createThemeSwitcher() {
        // Create theme switcher UI
        const switcher = document.createElement('div');
        switcher.id = 'theme-switcher';
        switcher.className = 'theme-switcher';
        switcher.innerHTML = `
            <style>
                .theme-switcher {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 999;
                    background: rgba(255, 255, 255, 0.95);
                    border-radius: 50px;
                    padding: 15px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                    backdrop-filter: blur(10px);
                }
                
                .theme-switcher button {
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 20px;
                    margin: 0 5px;
                    transition: transform 0.3s ease;
                    padding: 5px;
                }
                
                .theme-switcher button:hover {
                    transform: scale(1.2);
                }
                
                .theme-switcher button.active {
                    opacity: 0.5;
                }
                
                .theme-switcher-tooltip {
                    position: absolute;
                    bottom: 100%;
                    right: 15px;
                    background: #1a1a1a;
                    color: white;
                    padding: 8px 12px;
                    border-radius: 6px;
                    font-size: 12px;
                    white-space: nowrap;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.2s ease;
                    margin-bottom: 10px;
                }
                
                .theme-switcher button:hover .theme-switcher-tooltip {
                    opacity: 1;
                }
                
                @media (max-width: 768px) {
                    .theme-switcher {
                        bottom: 10px;
                        right: 10px;
                        padding: 10px;
                    }
                    
                    .theme-switcher button {
                        font-size: 16px;
                        margin: 0 3px;
                    }
                }
            </style>
        `;
        
        const themeButtons = {
            '🎨': 'default',
            '🌙': 'dark-theme',
            '⬜': 'minimalist-theme',
            '🌊': 'ocean-theme',
            '🌅': 'sunset-theme',
            '🌲': 'forest-theme',
            '🍇': 'grape-theme'
        };
        
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '5px';
        
        Object.entries(themeButtons).forEach(([icon, theme]) => {
            const btn = document.createElement('button');
            btn.innerHTML = icon;
            btn.title = theme;
            btn.onclick = () => this.switchTheme(theme);
            
            if (this.currentTheme === theme) {
                btn.classList.add('active');
            }
            
            buttonContainer.appendChild(btn);
        });
        
        switcher.appendChild(buttonContainer);
        document.body.appendChild(switcher);
    }
}

// Initialize theme manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
    console.log('✅ Theme Manager Initialized - Click emoji buttons to switch themes!');
});

// ========== ANALYTICS TRACKING ==========
// Page load tracking
window.addEventListener('load', () => {
    if (window.gtag) {
        gtag('event', 'page_view', {
            'page_title': document.title,
            'page_location': window.location.href
        });
    }
});

// Click tracking for buttons
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn')) {
        if (window.gtag) {
            gtag('event', 'button_click', {
                'button_text': e.target.textContent.trim(),
                'button_class': e.target.className
            });
        }
    }
});

// ========== MOBILE OPTIMIZATION ==========
// Add mobile detection
const isMobile = () => window.innerWidth <= 768;

// Prevent pinch zoom on double-tap
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Optimize for mobile performance
if (isMobile()) {
    document.addEventListener('DOMContentLoaded', () => {
        // Lazy load images
        if ('IntersectionObserver' in window) {
            const images = document.querySelectorAll('img[data-src]');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        observer.unobserve(img);
                    }
                });
            });
            images.forEach(img => observer.observe(img));
        }
    });
}

// ========== PERFORMANCE MONITORING ==========
// Log Core Web Vitals
if ('web-vital' in window) {
    // Lazy load web vitals library for performance monitoring
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/web-vitals/dist/web-vitals.iife.js';
    script.async = true;
    document.head.appendChild(script);
}

// ========== ADMIN KEYBOARD SHORTCUTS ==========
document.addEventListener('keydown', (e) => {
    // Admin Theme Control: Ctrl+Shift+T (or Cmd+Shift+T on Mac)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        const switcher = document.getElementById('admin-theme-switcher');
        if (switcher) {
            const isVisible = switcher.style.display !== 'none';
            if (isVisible) {
                switcher.style.display = 'none !important';
            } else {
                switcher.style.display = 'block';
            }
            console.log(`✅ Admin Theme Panel ${isVisible ? 'Hidden' : 'Shown'}`);
        }
    }
});

console.log('💡 Tip: Press Ctrl+Shift+T (or Cmd+Shift+T on Mac) to toggle admin theme switcher');