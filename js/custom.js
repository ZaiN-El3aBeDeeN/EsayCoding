// to get current year
function getYear() {
    const currentYear = new Date().getFullYear();
    const yearElements = document.querySelectorAll("#displayYear");
    yearElements.forEach(el => {
        if (el) el.textContent = currentYear;
    });
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', getYear);
} else {
    getYear();
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing after animation
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Add animation classes to elements
    const sections = document.querySelectorAll('.food_section .box, .offer_section .box, .about_section .detail-box, .about_section .img-box, .client_section .box');
    sections.forEach((section, index) => {
        // Alternate animation types for visual variety
        if (index % 4 === 0) {
            section.classList.add('fade-in');
        } else if (index % 4 === 1) {
            section.classList.add('slide-in-left');
        } else if (index % 4 === 2) {
            section.classList.add('slide-in-right');
        } else {
            section.classList.add('scale-in');
        }
        observer.observe(section);
    });
    
    // Animate headings
    const headings = document.querySelectorAll('.heading_container h2');
    headings.forEach(heading => {
        heading.classList.add('fade-in');
        observer.observe(heading);
    });
}

// ============================================
// SCROLL TO TOP BUTTON
// ============================================
function initScrollToTop() {
    const scrollBtn = document.getElementById('scroll-to-top');
    if (!scrollBtn) return;
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
    
    // Smooth scroll to top on click
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}


// isotope js - Course filtering
$(window).on('load', function () {
    const $grid = $(".grid").isotope({
        itemSelector: ".all",
        percentPosition: false,
        masonry: {
            columnWidth: ".all"
        }
    });
    
    // Use event delegation for better performance
    $('.filters_menu').on('click', 'li', function () {
        $('.filters_menu li').removeClass('active');
        $(this).addClass('active');

        const filterValue = $(this).attr('data-filter') || '*';
        $grid.isotope({ filter: filterValue });
    });
});

// nice select
$(document).ready(function() {
    $('select').niceSelect();
  });

/** google_map js **/
function myMap() {
    const mapElement = document.getElementById("googleMap");
    if (!mapElement) return;
    
    const mapProp = {
        center: new google.maps.LatLng(25.2854, 51.5310), // Doha, Qatar coordinates
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    
    const map = new google.maps.Map(mapElement, mapProp);
    
    // Add marker
    const marker = new google.maps.Marker({
        position: mapProp.center,
        map: map,
        title: 'EasyCoding - Doha, Qatar'
    });
}

// --- Simple cart implementation (stores in localStorage) ---
const CART_KEY = 'ec_cart_v1';

function getCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch (e) {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(name, price) {
    const cart = getCart();
    const idx = cart.findIndex(i => i.name === name);
    if (idx > -1) {
        cart[idx].qty += 1;
    } else {
        cart.push({ name: name, price: Number(price), qty: 1 });
    }
    saveCart(cart);
    renderCart();
}

function removeFromCart(name) {
    let cart = getCart();
    cart = cart.filter(i => i.name !== name);
    saveCart(cart);
    renderCart();
}

function changeQty(name, qty) {
    const cart = getCart();
    const idx = cart.findIndex(i => i.name === name);
    if (idx > -1) {
        cart[idx].qty = Math.max(0, Number(qty));
        if (cart[idx].qty === 0) cart.splice(idx, 1);
        saveCart(cart);
    }
    renderCart();
}

function renderCart() {
    const root = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    const subtotalEl = document.getElementById('cart-subtotal');
    const taxEl = document.getElementById('cart-tax');
    const emptyMsg = document.getElementById('empty-cart-message');
    
    if (!root) return;
    
    const cart = getCart();
    root.innerHTML = '';
    let subtotal = 0;
    
    if (cart.length === 0) {
        if (totalEl) totalEl.textContent = '0.00';
        if (subtotalEl) subtotalEl.textContent = '0.00';
        if (taxEl) taxEl.textContent = '0.00';
        if (emptyMsg) emptyMsg.style.display = 'block';
        return;
    }
    
    if (emptyMsg) emptyMsg.style.display = 'none';
    
    cart.forEach(item => {
        const itemTotal = item.price * item.qty;
        subtotal += itemTotal;
        
        const line = document.createElement('div');
        line.className = 'cart-item';
        
        const info = document.createElement('div');
        info.className = 'item-info';
        
        const nameDiv = document.createElement('div');
        nameDiv.className = 'item-name';
        nameDiv.textContent = item.name;
        
        const detailsDiv = document.createElement('div');
        detailsDiv.className = 'item-details';
        detailsDiv.textContent = '$' + item.price.toFixed(2) + ' × ' + item.qty;
        
        info.appendChild(nameDiv);
        info.appendChild(detailsDiv);
        
        const actions = document.createElement('div');
        actions.className = 'item-actions';
        
        const qtyControl = document.createElement('div');
        qtyControl.className = 'qty-control';
        
        const minusBtn = document.createElement('button');
        minusBtn.className = 'qty-btn';
        minusBtn.innerHTML = '<i class="fa fa-minus"></i>';
        minusBtn.addEventListener('click', function () { changeQty(item.name, item.qty - 1); });
        
        const qtyDisplay = document.createElement('div');
        qtyDisplay.className = 'qty-display';
        qtyDisplay.textContent = item.qty;
        
        const plusBtn = document.createElement('button');
        plusBtn.className = 'qty-btn';
        plusBtn.innerHTML = '<i class="fa fa-plus"></i>';
        plusBtn.addEventListener('click', function () { changeQty(item.name, item.qty + 1); });
        
        qtyControl.appendChild(minusBtn);
        qtyControl.appendChild(qtyDisplay);
        qtyControl.appendChild(plusBtn);
        
        const priceDiv = document.createElement('div');
        priceDiv.className = 'item-price';
        priceDiv.textContent = '$' + itemTotal.toFixed(2);
        
        const remBtn = document.createElement('button');
        remBtn.className = 'remove-btn';
        remBtn.innerHTML = '<i class="fa fa-trash"></i>';
        remBtn.setAttribute('aria-label', 'Remove ' + item.name);
        remBtn.addEventListener('click', function () { removeFromCart(item.name); });
        
        actions.appendChild(qtyControl);
        actions.appendChild(priceDiv);
        actions.appendChild(remBtn);
        
        line.appendChild(info);
        line.appendChild(actions);
        root.appendChild(line);
    });
    
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    
    if (totalEl) totalEl.textContent = total.toFixed(2);
    if (subtotalEl) subtotalEl.textContent = subtotal.toFixed(2);
    if (taxEl) taxEl.textContent = tax.toFixed(2);
}

// bind add-to-cart buttons
document.addEventListener('click', function (e) {
    const target = e.target.closest('.add-to-cart');
    if (!target) return;
    e.preventDefault();
    const name = target.getAttribute('data-item-name') || target.getAttribute('aria-label') || 'Item';
    const price = target.getAttribute('data-item-price') || '0';
    addToCart(name, price);
    
    // Show success notification
    showNotification('Course added to cart successfully!', 'success');
});

// Notification function
function showNotification(message, type) {
    // Remove existing notification if any
    const existing = document.querySelector('.course-notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = 'course-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4caf50' : '#f44336'};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// render cart on load (order page)
document.addEventListener('DOMContentLoaded', function () {
    renderCart();
    const checkout = document.getElementById('checkout-btn');
    if (checkout) {
        checkout.addEventListener('click', function () {
            alert('Proceeding to checkout — implement server-side flow here.');
        });
    }
    
    // Handle enrollment form submission
    const enrollmentForm = document.getElementById('enrollment-form');
    if (enrollmentForm) {
        enrollmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                showNotification('Thank you! We will contact you soon.', 'success');
                this.reset();
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                
                // Reset nice-select if present
                if (typeof $ !== 'undefined' && $.fn.niceSelect) {
                    $('select.nice-select').niceSelect('update');
                }
            }, 1500);
        });
    }

    // Load Google Maps dynamically if config present
    function loadGoogleMaps() {
        try {
            if (window.APP_CONFIG && window.APP_CONFIG.GOOGLE_MAPS_KEY) {
                const key = window.APP_CONFIG.GOOGLE_MAPS_KEY;
                if (key && key !== 'YOUR_API_KEY' && !document.querySelector('script[src*="maps.googleapis.com"]')) {
                    const script = document.createElement('script');
                    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&callback=myMap`;
                    script.async = true;
                    script.defer = true;
                    script.onerror = () => console.warn('Failed to load Google Maps');
                    document.body.appendChild(script);
                }
            }
        } catch (ex) {
            console.warn('Error loading Google Maps:', ex);
        }
    }
    
    loadGoogleMaps();
    
    // Initialize new features
    initScrollAnimations();
    initScrollToTop();
});

// client section owl carousel
$(".client_owl-carousel").owlCarousel({
    loop: true,
    margin: 0,
    dots: false,
    nav: true,
    navText: [],
    autoplay: true,
    autoplayHoverPause: true,
    navText: [
        '<i class="fa fa-angle-left" aria-hidden="true"></i>',
        '<i class="fa fa-angle-right" aria-hidden="true"></i>'
    ],
    responsive: {
        0: {
            items: 1
        },
        768: {
            items: 2
        },
        1000: {
            items: 2
        }
    }
});