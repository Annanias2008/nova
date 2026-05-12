// Authentication Pages Interactions

// Login Form
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;

        // Simulate login
        alert(`Welcome back!\n\nLogging in as: ${email}\n\nRedirecting to dashboard...`);

        // In production, this would redirect to index.html
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    });
}

// Register Form
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('fullName').value;
        const email = document.getElementById('emailRegister').value;

        // Simulate registration
        alert(`Account Created!\n\nWelcome, ${name}!\n\nEmail: ${email}\n\nLet's set up your budget...`);

        // Redirect to onboarding flow for new users
        setTimeout(() => {
            window.location.href = 'onboarding.html';
        }, 1500);
    });
}

// Password Toggle
const togglePasswordBtns = document.querySelectorAll('.toggle-password');
togglePasswordBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const input = btn.previousElementSibling;
        const type = input.type === 'password' ? 'text' : 'password';
        input.type = type;
        btn.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
    });
});

// Password Strength Checker
const passwordRegister = document.getElementById('passwordRegister');
if (passwordRegister) {
    passwordRegister.addEventListener('input', (e) => {
        const password = e.target.value;
        const strengthFill = document.getElementById('strengthFill');
        const strengthText = document.getElementById('strengthText');

        let strength = 0;
        let message = '';

        // Check length
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;

        // Check for numbers
        if (/\d/.test(password)) strength++;

        // Check for lowercase and uppercase
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;

        // Check for special characters
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        // Update UI
        strengthFill.classList.remove('weak', 'medium', 'strong');

        if (strength <= 2) {
            strengthFill.classList.add('weak');
            message = 'Weak password - add more characters and variety';
        } else if (strength <= 4) {
            strengthFill.classList.add('medium');
            message = 'Medium strength - consider adding special characters';
        } else {
            strengthFill.classList.add('strong');
            message = 'Strong password! ✓';
        }

        strengthText.textContent = message;
    });
}

// Biometric Login
const biometricBtn = document.querySelector('.biometric-btn');
if (biometricBtn) {
    biometricBtn.addEventListener('click', () => {
        alert('Face ID Authentication\n\n🔐 Authenticating...\n\n✓ Face ID successful!\n\nWelcome back!');

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    });
}

// Social Login Buttons
const socialBtns = document.querySelectorAll('.social-btn');
socialBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const provider = btn.textContent.trim().replace('Continue with ', '');
        const isSignUp = window.location.pathname.includes('register');

        if (isSignUp) {
            alert(`${provider} Sign Up\n\n🔐 Redirecting to ${provider} authentication...\n\n✓ Account created successfully!\n\nLet's set up your budget...`);

            // Redirect to onboarding for new users
            setTimeout(() => {
                window.location.href = 'onboarding.html';
            }, 1500);
        } else {
            alert(`${provider} Sign In\n\n🔐 Redirecting to ${provider} authentication...\n\n✓ Authentication successful!\n\nWelcome back!`);

            // Redirect to dashboard for existing users
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        }
    });
});

// Forgot Password Link
const forgotLink = document.querySelector('.forgot-link');
if (forgotLink) {
    forgotLink.addEventListener('click', (e) => {
        e.preventDefault();
        const email = prompt('Enter your email address to reset your password:');
        if (email) {
            alert(`Password Reset\n\nWe've sent a reset link to:\n${email}\n\nCheck your inbox and follow the instructions.`);
        }
    });
}

// Add visual feedback to inputs
const inputs = document.querySelectorAll('.glass-input');
inputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
    });

    input.addEventListener('blur', () => {
        input.parentElement.classList.remove('focused');
    });
});

// Animate logo on load
window.addEventListener('load', () => {
    const logoIcon = document.querySelector('.logo-icon');
    if (logoIcon) {
        logoIcon.style.opacity = '0';
        logoIcon.style.transform = 'scale(0.8)';

        setTimeout(() => {
            logoIcon.style.transition = 'all 0.6s ease';
            logoIcon.style.opacity = '1';
            logoIcon.style.transform = 'scale(1)';
        }, 100);
    }
});

console.log('Authentication page loaded');
