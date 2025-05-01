export function setToken(token) {
    localStorage.setItem('token', token);
}

export function getToken() {
    return localStorage.getItem('token');
}

export function removeToken() {
    localStorage.removeItem('token');
}

export async function checkAuth() {
    const token = getToken();
    if (!token) {
        window.location.href = '../login.html';
        return false;
    }

    try {
        const response = await fetch('http://localhost:5000/auth/verify', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Token inválido');
        }
        return true;
    } catch (error) {
        console.error('Error de autenticación:', error);
        removeToken();
        window.location.href = '../login.html';
        return false;
    }
}

export function logout() {
    removeToken();
    window.location.href = '../login.html';
}