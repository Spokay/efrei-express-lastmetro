

const healthRoutes = require("express").Router();

healthRoutes.get("/", (req, res) => {
    res.json({ status: "ok" });
});

module.exports = healthRoutes;