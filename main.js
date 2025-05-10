// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initParticles();
    initCarousel();
    initIntersectionObserver();
    initForms();
});

// Particle Effects
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    
    const particleCount = window.innerWidth < 768 ? 20 : 40;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random size between 2px and 5px
        const size = Math.random() * 3 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random position
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.bottom = `-${size}px`;
        
        // Random animation
        particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
        particle.style.animationDelay = `${Math.random() * 10}s`;
        
        container.appendChild(particle);
    }
}

// Testimonial Carousel
function initCarousel() {
    const slides = document.querySelector('.testimonial-slides');
    const dots = document.querySelectorAll('.carousel-dot');
    if (!slides || dots.length === 0) return;
    
    let currentIndex = 0;
    let autoRotateInterval;
    const rotationDelay = 25000; // 25 seconds
    
    function goToSlide(index) {
        currentIndex = index % dots.length;
        if (currentIndex < 0) currentIndex = dots.length - 1;
        
        slides.scrollTo({
            left: slides.children[currentIndex].offsetLeft,
            behavior: 'smooth'
        });
        
        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }
    
    // Dot click handlers
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            clearInterval(autoRotateInterval);
            goToSlide(index);
            startAutoRotation();
        });
    });
    
    function startAutoRotation() {
        clearInterval(autoRotateInterval);
        autoRotateInterval = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, rotationDelay);
    }
    
    // Pause on hover
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', () => {
            clearInterval(autoRotateInterval);
        });
        
        carousel.addEventListener('mouseleave', startAutoRotation);
    }
    
    // Start auto rotation
    startAutoRotation();
}

// Intersection Observer for Animations
function initIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.service-card, .tech-category, .stat-item').forEach(el => {
        observer.observe(el);
    });
}

// Form Handling
function initForms() {
    // Handle Netlify form submission
    const messageForm = document.getElementById("messageForm");
    if (messageForm) {
        messageForm.addEventListener("submit", function(e) {
            e.preventDefault();
            
            // Honeypot check
            const honeypot = this.querySelector('[name="bot-field"]').value;
            if (honeypot) {
                return false; // Likely a bot
            }
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            // Submit to Netlify
            fetch("/", {
                method: "POST",
                body: new FormData(this)
            })
            .then(response => {
                if (response.ok) {
                    // Show success popup
                    document.getElementById("successPopup").style.display = "block";
                    document.getElementById("overlay").style.display = "block";
                    // Reset form
                    this.reset();
                } else {
                    throw new Error('Form submission failed');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert("There was an error sending your message. Please try again or contact us directly.");
            })
            .finally(() => {
                // Restore button state
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            });
        });
    }

    // Close popup function
    window.closePopup = function() {
        document.getElementById("successPopup").style.display = "none";
        document.getElementById("overlay").style.display = "none";
    };
}
