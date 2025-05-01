const BASE_URL = 'http://localhost:5000';

export async function apiFetch(endpoint, method = 'GET', body = null) {
    try {
        const token = localStorage.getItem('token');
        const config = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        if (body) {
            config.body = JSON.stringify(body);
            console.log('Datos enviados:', body);
        }

        console.log('Haciendo petición con token:', token ? 'Sí' : 'No');
        const response = await fetch(`${BASE_URL}${endpoint}`, config);
        const data = await response.json();

        console.log('Respuesta completa:', {
            status: response.status,
            data: data
        });

        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login.html';
                throw new Error('Sesión expirada');
            }
            throw new Error(data.error || `Error ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error('Error completo:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        throw error;
    }
}