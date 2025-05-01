require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

const corsOptions = {
    origin: [
        'http://localhost:5500',
        'http://127.0.0.1:5500',
        'http://localhost:5000',
        'http://127.0.0.1:5000'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use(cors(corsOptions));
app.use(express.json());

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Conexion Exitosa a MongoDB"))
    .catch((error) => console.error("Error de Conexion:", error));

app.get("/", (req, res) => {
    res.send("Bienvenido a la gestion de gastos");
});

app.use("/auth", require("./routes/authRoutes"));
app.use("/categories", require("./routes/categoryRoutes"));
app.use("/expenses", require("./routes/expenseRoutes"));

app.use((req, res, next) => {
    res.status(404).json({ error: "Ruta no encontrada" });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Algo salió mal!" });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => 
    console.log(`Servidor corriendo en http://localhost:${PORT}/`)
);