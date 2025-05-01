import { apiFetch } from '../utils/api.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('changePasswordForm');
    const email = sessionStorage.getItem('resetEmail');
    const token = sessionStorage.getItem('resetToken');

    if (!email || !token) {
        alert('Sesión expirada. Por favor, solicita un nuevo enlace de recuperación.');
        window.location.href = './reset-password.html';
        return;
    }

    const emailInput = document.getElementById('resetEmail');
    if (emailInput) {
        emailInput.value = email;
    }

    form.addEventListener('submit', handlePasswordChange);
});

async function handlePasswordChange(e) {
    e.preventDefault();

    const submitButton = e.target.querySelector('button');
    const email = document.getElementById('resetEmail').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const token = sessionStorage.getItem('resetToken');

    if (newPassword !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
    }

    try {
        submitButton.disabled = true;
        submitButton.textContent = 'Actualizando...';

        const response = await apiFetch('/auth/reset-password/confirm', 'POST', {
            email,
            newPassword,
            token
        });

        if (response.success) {
            sessionStorage.removeItem('resetToken');
            sessionStorage.removeItem('resetEmail');
            
            const messageContainer = document.getElementById('messageContainer');
            const form = document.getElementById('changePasswordForm');
            
            form.style.display = 'none';
            messageContainer.style.display = 'block';
            
            let seconds = 5;
            const countdown = document.getElementById('countdown');
            
            const timer = setInterval(() => {
                seconds--;
                countdown.textContent = seconds;
                if (seconds <= 0) {
                    clearInterval(timer);
                    window.location.href = './login.html';
                }
            }, 1000);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error: ' + error.message);
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Cambiar Contraseña';
    }
}