// =====================================================
// BODYACCEL E-COMMERCE - JAVASCRIPT FUNCTIONALITY
// Interactive Features and Cart Management
// ===================================================== 

// =====================================================
// NAVIGATION & HAMBURGER MENU
// =====================================================

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        
        // Remove active class from all links
        navLinks.forEach(l => l.classList.remove('active'));
        // Add active class to clicked link
        link.classList.add('active');
    });
});

// Update active nav link on scroll
window.addEventListener('scroll', () => {
    let current = '';
    
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// =====================================================
// SHOPPING CART FUNCTIONALITY
// =====================================================

let cart = [];
const cartModal = document.getElementById('cartModal');
const cartCount = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const cartSummary = document.getElementById('cartSummary');

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('bodyaccelCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('bodyaccelCart', JSON.stringify(cart));
}

// Add product to cart
function addToCart(productName, price) {
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: cart.length + 1,
            name: productName,
            price: price,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartUI();
    
    // Show confirmation
    showNotification(`${productName} ajouté au panier!`);
}

// Update cart UI
function updateCartUI() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items display
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Votre panier est vide. Commencez à faire vos achats!</p>';
        cartSummary.style.display = 'none';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="item-info">
                    <div class="item-name">${item.name}</div>
                    <div class="item-price">${item.price.toLocaleString('fr-CI')} FCFA x ${item.quantity}</div>
                </div>
                <button class="item-remove" onclick="removeFromCart(${item.id})">Supprimer</button>
            </div>
        `).join('');
        
        updateCartSummary();
        cartSummary.style.display = 'block';
    }
}

// Remove item from cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCart();
    updateCartUI();
}

// Update cart summary
function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal; // Livraison gratuite
    
    document.getElementById('subtotal').textContent = subtotal.toLocaleString('fr-CI') + ' FCFA';
    document.getElementById('total').textContent = total.toLocaleString('fr-CI') + ' FCFA';
}

// Open cart modal
function openCart() {
    const cartLink = document.querySelector('.cart-link');
    cartLink.addEventListener('click', (e) => {
        e.preventDefault();
        cartModal.classList.add('active');
    });
}

// Close cart modal
function closeCart() {
    cartModal.classList.remove('active');
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        alert('Votre panier est vide!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const items = cart.map(item => `- ${item.name} x${item.quantity}`).join('\n');
    
    alert(`
Confirmation de commande:
${items}

Total: ${total.toLocaleString('fr-CI')} FCFA

Vous serez redirigé vers le paiement.
Livraison gratuite à Abidjan!
    `);
    
    // Clear cart
    cart = [];
    saveCart();
    updateCartUI();
    closeCart();
}

// Click on cart link
document.querySelector('.cart-link').addEventListener('click', () => {
    cartModal.classList.add('active');
});

// Close modal when clicking outside
cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        closeCart();
    }
});

// =====================================================
// FAQ TOGGLE FUNCTIONALITY
// ===================================================== 

function toggleFaq(button) {
    const faqItem = button.parentElement;
    const isActive = faqItem.classList.contains('active');
    
    // Close all FAQs
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Open clicked FAQ if it was not active
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// =====================================================
// SMOOTH SCROLL
// ===================================================== 

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

// =====================================================
// NOTIFICATION SYSTEM
// ===================================================== 

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
        font-weight: 500;
        z-index: 9999;
        animation: slideInRight 0.3s ease-out;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOutRight {
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
    document.head.appendChild(style);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// =====================================================
// CONTACT FORM HANDLING
// ===================================================== 

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        
        // Simulate form submission
        showNotification('Message envoyé avec succès! 📧');
        
        // Reset form
        contactForm.reset();
        
        // In a real application, you would send this to a backend:
        // fetch('/api/contact', {
        //     method: 'POST',
        //     body: JSON.stringify(Object.fromEntries(formData))
        // });
    });
}

// =====================================================
// LAZY LOADING IMAGES
// ===================================================== 

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

// =====================================================
// SCROLL ANIMATIONS
// ===================================================== 

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(section);
});

// =====================================================
// PRODUCT OPTION SELECTION
// ===================================================== 

document.querySelectorAll('input[name="product-option"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        const option = e.target.value;
        let newPrice = 5000;
        
        if (option === 'duo') {
            newPrice = 8000;
        } else if (option === 'trio') {
            newPrice = 11000;
        }
        
        // Update the button price display (optional)
        // This could be enhanced to show price on button
    });
});

// =====================================================
// PERFORMANCE & LOADING
// ===================================================== 

// Add loading state to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function() {
        if (this.textContent.includes('PAIEMENT') || this.textContent.includes('ENVOYER')) {
            const originalText = this.textContent;
            this.textContent = '⏳ Traitement...';
            this.disabled = true;
            
            setTimeout(() => {
                this.textContent = originalText;
                this.disabled = false;
            }, 2000);
        }
    });
});

// =====================================================
// ACCESSIBILITY IMPROVEMENTS
// ===================================================== 

// Keyboard navigation for FAQ
document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleFaq(button);
        }
    });
});

// =====================================================
// INITIALIZATION
// ===================================================== 

document.addEventListener('DOMContentLoaded', () => {
    // Load cart from localStorage
    loadCart();
    
    // Initialize tooltips if needed
    initializeTooltips();
    
    // Set up analytics (if needed)
    trackPageView();
});

function initializeTooltips() {
    // Add tooltip functionality if needed
    document.querySelectorAll('[data-tooltip]').forEach(element => {
        element.addEventListener('mouseover', (e) => {
            const tooltip = document.createElement('div');
            tooltip.textContent = element.getAttribute('data-tooltip');
            tooltip.style.cssText = `
                position: absolute;
                background: rgba(26, 58, 92, 0.9);
                color: white;
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 0.85rem;
                white-space: nowrap;
                z-index: 1000;
            `;
            document.body.appendChild(tooltip);
            
            element.addEventListener('mouseout', () => tooltip.remove());
        });
    });
}

function trackPageView() {
    // Add your analytics tracking here
    // Example: Google Analytics, Mixpanel, etc.
    console.log('Page loaded: ' + document.title);
}

// =====================================================
// UTILITY FUNCTIONS
// ===================================================== 

// Format currency
function formatCurrency(value) {
    return value.toLocaleString('fr-CI', {
        style: 'currency',
        currency: 'XOF'
    });
}

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// =====================================================
// SERVICE WORKER (Optional - for offline support)
// ===================================================== 

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable service worker
        // navigator.serviceWorker.register('sw.js');
    });
}

// =====================================================
// DARK MODE TOGGLE (Optional Enhancement)
// ===================================================== 

function toggleDarkMode() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    const newDarkMode = !isDarkMode;
    
    localStorage.setItem('darkMode', newDarkMode);
    
    if (newDarkMode) {
        document.documentElement.style.filter = 'invert(1) hue-rotate(180deg)';
    } else {
        document.documentElement.style.filter = 'none';
    }
}

// Load saved dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
    document.documentElement.style.filter = 'invert(1) hue-rotate(180deg)';
}

// =====================================================
// END OF JAVASCRIPT
// ===================================================== 
