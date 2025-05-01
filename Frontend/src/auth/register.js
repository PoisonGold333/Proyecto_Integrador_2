import { apiFetch } from "../utils/api.js";

async function handleRegister(event) {
    event.preventDefault();

    const name = document.getElementById("registerName").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    try {
        const response = await apiFetch("/auth/register", "POST",{
            name,
            email,
            password,
        })

        alert("Registro Exitoso. Redirigiendo a Login");
        window.location.href = "login.html"
    } catch (error) {
        alert(`Error en el registro: ${error.message}`);
        console.log("Error en el registro", error)
    }
}

document
.getElementById("registerForm")
.addEventListener("submit", handleRegister);
