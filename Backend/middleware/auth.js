const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    const authHeader = req.header("Authorization")
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({error: "Token no enviado o no valido"})
    }

    const token = authHeader.split(" ")[1]

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; 
        next()
    } catch (error) {
        console.error("Error al verificar el token:", error.name, error.message);
        let message = "Token invalido";
        if(error.name === "TokenExpiredError"){
            message = "Token Expirado"
        }
        res.status(400).json({error: message});
    }
}

module.exports = auth;