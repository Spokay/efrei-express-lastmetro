
const healthRoutes = require("express").Router();
const { sequelize } = require("../database/database");

healthRoutes.get("/", (req, res) => {
    res.json({ status: "ok" });
});


healthRoutes.get("/db", (req, res) => {
    sequelize.authenticate()
        .then(() => {
            res.status(200).json({ database: "Connected" });
        })
        .catch(err => {
            console.error("Database connection error:", err);
            res.status(500).json({ database: "Unreachable", error: err.message });
        });
});

module.exports = healthRoutes;