// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initParticles();
    initCarousel();
    initIntersectionObserver();
    initForms();
	initCalendarModal();
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

function initCarousel() {
    const slides = document.querySelector('.testimonial-slides');
    const dots = document.querySelectorAll('.carousel-dot');
    if (!slides || dots.length === 0) return;
    
    let currentIndex = 0;
    let autoRotateInterval;
    const rotationDelay = 25000; // 25 seconds
    let startX, moveX;

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

    // Swipe/touch logic
    slides.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        clearInterval(autoRotateInterval);
    });

    slides.addEventListener('touchmove', (e) => {
        moveX = e.touches[0].clientX;
    });

    slides.addEventListener('touchend', () => {
        handleSwipe();
        startAutoRotation();
    });

    // Mouse drag for desktop
    slides.addEventListener('mousedown', (e) => {
        startX = e.clientX;
        clearInterval(autoRotateInterval);
    });

    slides.addEventListener('mousemove', (e) => {
        if (e.buttons === 1) moveX = e.clientX;
    });

    slides.addEventListener('mouseup', () => {
        handleSwipe();
        startAutoRotation();
    });

    function handleSwipe() {
        if (startX - moveX > 50) { // Swipe left
            goToSlide(currentIndex + 1);
        } else if (startX - moveX < -50) { // Swipe right
            goToSlide(currentIndex - 1);
        }
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

    document.querySelectorAll('.service-card').forEach(el => {
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

function initCalendarModal() {
    const modal = document.getElementById("calendarModal");
    const btn = document.getElementById("calendarBtn");
    const span = document.getElementsByClassName("close")[0];

    if (!modal || !btn) return;

    // Open modal when button is clicked
    btn.onclick = function() {
        modal.style.display = "block";
        document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
    }

    // Close modal when X is clicked
    span.onclick = function() {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }

    // Close modal when clicking outside
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        }
    }
}
