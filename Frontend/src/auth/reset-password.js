import { apiFetch } from '../utils/api.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('resetPasswordForm');
    
    if (!form) {
        console.error('Formulario no encontrado');
        return;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitButton = e.target.querySelector('button');
        const emailInput = document.getElementById('resetEmail');

        if (!emailInput) {
            console.error('Campo de email no encontrado');
            return;
        }

        const email = emailInput.value.trim();

        try {
            submitButton.disabled = true;
            submitButton.textContent = 'Enviando...';

            console.log('Solicitando reset de contraseña para:', email);

            const response = await apiFetch('/auth/request-password-reset', 'POST', { 
                email: email 
            });
            
            console.log('Respuesta del servidor:', response);

            if (response.resetToken) {
                sessionStorage.setItem('resetToken', response.resetToken);
                sessionStorage.setItem('resetEmail', email);
                alert('Se ha enviado un enlace de recuperación');
                window.location.href = './change-password.html';
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error: ' + error.message);
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Enviar enlace de recuperación';
        }
    });
});