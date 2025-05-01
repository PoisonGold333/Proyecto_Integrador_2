const express = require("express");
const Expense = require("../models/Expense");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, async (req, res) => {
    try {
        const {title, amount, category, date} = req.body;
        
        if (!title || !amount || !category) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }

        const expense = new Expense({
            title,
            amount,
            category,
            date: date || Date.now(),
            user: req.user.id,
        });

        await expense.save();
        res.status(201).json(expense);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

router.get("/", auth, async (req, res) => {
    try {
        const expenses = await Expense.find({user: req.user.id}).populate({
            path: "category",
            select: "name"
        });
        res.json(expenses);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error al obtener los gastos"});
    }
});

router.put("/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, amount, category, date } = req.body;

        if (!title || !amount || !category) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }

        const expense = await Expense.findOneAndUpdate(
            { _id: id, user: req.user.id },
            { title, amount, category, date },
            { new: true }
        );

        if (!expense) {
            return res.status(404).json({ error: "Gasto no encontrado" });
        }

        res.json(expense);
    } catch (error) {
        res.status(500).json({error: "Error al actualizar el gasto"});
    }
});

router.delete("/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;

        const expense = await Expense.findOneAndDelete({
            _id: id,
            user: req.user.id
        });

        if (!expense) {
            return res.status(404).json({ error: "Gasto no encontrado" });
        }

        res.json({ message: "Gasto eliminado correctamente" });
    } catch (error) {
        res.status(500).json({error: "Error al eliminar el gasto"});
    }
});

module.exports = router;