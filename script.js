class AuthManager {
    constructor() {
        this.currentForm = 'login';
        this.isLoading = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupFloatingLabels();
        this.animateCounters();
    }

    bindEvents() {
        // Form toggle
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchForm(e.target.dataset.form));
        });

        // Password toggles
        document.querySelectorAll('.password-toggle').forEach(btn => {
            btn.addEventListener('click', (e) => this.togglePassword(e.target.closest('.form-group')));
        });

        // Form submissions
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('signupForm').addEventListener('submit', (e) => this.handleSignup(e));

        // Password strength
        const passwordInput = document.getElementById('signup-password');
        if (passwordInput) {
            passwordInput.addEventListener('input', (e) => {
                this.validateField(e.target);
            });
        }

        // Real-time validation
        document.querySelectorAll('input, select').forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    switchForm(formType) {
        if (this.currentForm === formType || this.isLoading) return;

        this.currentForm = formType;

        // Update toggle buttons
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.form === formType);
        });

        // Move indicator
        const indicator = document.querySelector('.toggle-indicator');
        indicator.classList.toggle('slide-right', formType === 'signup');

        // Switch forms
        document.querySelectorAll('.form-wrapper').forEach(wrapper => {
            const isActive = wrapper.id === `${formType}-form`;
            wrapper.classList.toggle('active', isActive);
        });

        // Reset forms
        this.resetForm(formType);
    }

    togglePassword(formGroup) {
        const input = formGroup.querySelector('input');
        const icon = formGroup.querySelector('.eye-icon');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.innerHTML = `
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
            `;
        } else {
            input.type = 'password';
            icon.innerHTML = `
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
            `;
        }
    }

    resetForm(formType) {
        const form = document.getElementById(`${formType}Form`);
        if (form) {
            form.reset();
            
            // Reset validation states
            form.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('error', 'success');
            });
            
            form.querySelectorAll('.form-error').forEach(error => {
                error.textContent = '';
                error.classList.remove('show');
            });
        }
    }

    validateField(field) {
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup.querySelector('.form-error');
        let isValid = true;
        let errorMessage = '';

        // Clear previous state
        formGroup.classList.remove('error', 'success');
        errorElement.classList.remove('show');

        // Email validation
        if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        // Password validation
        if (field.type === 'password' && field.value && field.id === 'signup-password') {
            if (field.value.length < 8) {
                isValid = false;
                errorMessage = 'Password must be at least 8 characters long';
            }
        }

        // Required field validation
        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Name validation
        if ((field.id === 'signup-firstname' || field.id === 'signup-lastname') && field.value) {
            if (field.value.length < 2) {
                isValid = false;
                errorMessage = 'Name must be at least 2 characters long';
            }
        }

        // Show error or success state
        if (!isValid && errorMessage) {
            formGroup.classList.add('error');
            errorElement.textContent = errorMessage;
            errorElement.classList.add('show');
        } else if (field.value && field.value.trim()) {
            formGroup.classList.add('success');
        }

        return isValid;
    }

    clearFieldError(field) {
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup.querySelector('.form-error');
        
        if (formGroup.classList.contains('error')) {
            formGroup.classList.remove('error');
            errorElement.classList.remove('show');
            
            // Add success state if field is valid and not empty
            if (field.value.trim() && this.validateField(field)) {
                formGroup.classList.add('success');
            }
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        if (this.isLoading) return;

        const form = e.target;
        const formData = new FormData(form);
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        // Validate form
        let isValid = true;
        form.querySelectorAll('input[required]').forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) return;

        // Show loading state
        this.setLoadingState(form, true);

        try {
            // Simulate API call
            await this.simulateApiCall();
            
            // Success
            this.showNotification('Welcome back! Redirecting to your dashboard...', 'success');
            
            // Simulate redirect
            setTimeout(() => {
                alert('Login successful! This would redirect to the dashboard.');
            }, 1500);
            
        } catch (error) {
            this.showNotification('Invalid email or password. Please try again.', 'error');
        } finally {
            this.setLoadingState(form, false);
        }
    }

    async handleSignup(e) {
        e.preventDefault();
        if (this.isLoading) return;

        const form = e.target;
        const firstName = document.getElementById('signup-firstname').value;
        const lastName = document.getElementById('signup-lastname').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const role = document.getElementById('signup-role').value;
        const termsAgreed = document.getElementById('terms-agreement').checked;

        // Validate form
        let isValid = true;
        form.querySelectorAll('input[required], select[required]').forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        // Check terms agreement
        if (!termsAgreed) {
            this.showNotification('Please agree to the Terms of Service and Privacy Policy', 'error');
            return;
        }

        // Check password length
        if (password.length < 6) {
            this.showNotification('Password must be at least 6 characters long', 'error');
            return;
        }

        if (!isValid) return;

        // Show loading state
        this.setLoadingState(form, true);

        try {
            // Simulate API call
            await this.simulateApiCall(2000);
            
            // Success
            this.showNotification('Account created successfully! Please check your email to verify your account.', 'success');
            
            // Simulate redirect or email verification
            setTimeout(() => {
                alert('Account created! This would show an email verification screen.');
            }, 1500);
            
        } catch (error) {
            this.showNotification('An error occurred while creating your account. Please try again.', 'error');
        } finally {
            this.setLoadingState(form, false);
        }
    }

    setLoadingState(form, loading) {
        this.isLoading = loading;
        const submitBtn = form.querySelector('.submit-btn');
        const formWrapper = form.closest('.form-wrapper');
        
        submitBtn.classList.toggle('loading', loading);
        submitBtn.disabled = loading;
        formWrapper.classList.toggle('loading', loading);
        
        // Disable form toggle while loading
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.style.pointerEvents = loading ? 'none' : '';
        });
    }

    async simulateApiCall(delay = 1500) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success/failure (90% success rate)
                if (Math.random() > 0.1) {
                    resolve();
                } else {
                    reject(new Error('API Error'));
                }
            }, delay);
        });
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            border-radius: 12px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 400px;
            box-shadow: var(--shadow-xl);
            background: ${type === 'success' ? '#10B981' : '#EF4444'};
        `;
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Hide notification after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    setupFloatingLabels() {
        // Handle floating labels for form fields that might be autofilled
        document.querySelectorAll('input').forEach(input => {
            const handleFloatingLabel = () => {
                const label = input.nextElementSibling;
                if (label && label.tagName === 'LABEL') {
                    if (input.value || input === document.activeElement) {
                        label.style.transform = 'translateY(-8px) scale(0.85)';
                        label.style.color = 'var(--primary-color)';
                    } else {
                        label.style.transform = '';
                        label.style.color = '';
                    }
                }
            };

            input.addEventListener('focus', handleFloatingLabel);
            input.addEventListener('blur', handleFloatingLabel);
            input.addEventListener('input', handleFloatingLabel);
            
            // Check initial state (for autofilled fields)
            setTimeout(handleFloatingLabel, 100);
        });
    }

    animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        if (counters.length === 0) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });

        counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.count);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                element.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
        }, 16);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AuthManager();
});

// Add smooth scroll behavior for any anchor links
document.documentElement.style.scrollBehavior = 'smooth';

// Handle form autofill detection
window.addEventListener('load', () => {
    // Check for autofilled inputs after a short delay
    setTimeout(() => {
        document.querySelectorAll('input:-webkit-autofill').forEach(input => {
            const label = input.nextElementSibling;
            if (label && label.tagName === 'LABEL') {
                label.style.transform = 'translateY(-8px) scale(0.85)';
                label.style.color = 'var(--primary-color)';
            }
        });
    }, 500);
});