// Check if user is logged in
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token && !window.location.href.includes('login.html') && !window.location.href.includes('register.html')) {
        window.location.href = 'login.html';
    }
}

// Handle login form
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = e.target.email.value;
        const password = e.target.password.value;
        const confirmPassword = e.target.confirmPassword.value;

        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password, confirmPassword })
            });

            const data = await response.json();

            if (data.status) {
                localStorage.setItem('token', data.token);
                showNotification('Login successful! Redirecting...', 'success');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            } else {
                showNotification(data.message || 'Login failed. Please check your credentials.');
                e.target.classList.add('shake');
                setTimeout(() => e.target.classList.remove('shake'), 500);
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Server error. Please try again later.');
        }
    });
}

// Handle register form
if (document.getElementById('registerForm')) {
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = e.target.name.value;
        const email = e.target.email.value;
        const password = e.target.password.value;

        try {
            const response = await fetch('http://localhost:5000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    name, 
                    email, 
                    password
                })
            });

            const data = await response.json();

            if (data.status) {
                showNotification('Registration successful! Redirecting to login...', 'success');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
            } else {
                showNotification(data.message || 'Registration failed. Please try again.');
                e.target.classList.add('shake');
                setTimeout(() => e.target.classList.remove('shake'), 500);
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Server error. Please try again later.');
        }
    });
}

// Add logout functionality
function logout() {
    localStorage.removeItem('token');
    showNotification('Logged out successfully', 'success');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1000);
}

// Check authentication on page load
checkAuth(); 