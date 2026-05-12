// Onboarding Flow Interactions

let currentSlide = 1;
const totalSlides = 7;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateProgress();
});

// Next Button
const nextBtn = document.getElementById('nextBtn');
nextBtn.addEventListener('click', () => {
    if (currentSlide < totalSlides) {
        goToSlide(currentSlide + 1);
    }
});

// Skip Button
const skipBtn = document.getElementById('skipBtn');
skipBtn.addEventListener('click', () => {
    if (confirm('Skip onboarding? You can always access this later in settings.')) {
        window.location.href = 'index.html';
    }
});

// Go to specific slide
function goToSlide(slideNumber) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');

    // Remove active class from current
    slides[currentSlide - 1].classList.remove('active');
    slides[currentSlide - 1].classList.add('prev');
    dots[currentSlide - 1].classList.remove('active');

    // Add active to new
    currentSlide = slideNumber;
    slides[currentSlide - 1].classList.remove('prev');
    slides[currentSlide - 1].classList.add('active');
    dots[currentSlide - 1].classList.add('active');

    updateProgress();
    updateButtons();
}

// Update progress bar
function updateProgress() {
    const progressFill = document.getElementById('progressFill');
    const percentage = (currentSlide / totalSlides) * 100;
    progressFill.style.width = `${percentage}%`;
}

// Update button states
function updateButtons() {
    const nextBtn = document.getElementById('nextBtn');
    const skipBtn = document.getElementById('skipBtn');

    if (currentSlide === totalSlides) {
        nextBtn.style.display = 'none';
        skipBtn.style.display = 'none';
    } else {
        nextBtn.style.display = 'block';
        skipBtn.style.display = 'block';
    }
}

// Swipe gestures for mobile
let touchStartX = 0;
let touchEndX = 0;

const slidesContainer = document.getElementById('slidesContainer');

slidesContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

slidesContainer.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeDistance = touchStartX - touchEndX;

    // Swipe left (next)
    if (swipeDistance > 50 && currentSlide < totalSlides) {
        goToSlide(currentSlide + 1);
    }

    // Swipe right (previous)
    if (swipeDistance < -50 && currentSlide > 1) {
        goToSlide(currentSlide - 1);
    }
}

// Income input formatting
const incomeInput = document.getElementById('incomeInput');
if (incomeInput) {
    incomeInput.addEventListener('input', (e) => {
        // Remove non-numeric characters
        let value = e.target.value.replace(/[^0-9]/g, '');

        // Format with commas
        if (value) {
            value = parseInt(value).toLocaleString();
        }

        e.target.value = value;
    });
}

console.log('Onboarding flow loaded');
