"use strict"

require('dotenv').config();

const express = require("express");

const cors = require("cors");

const swaggerUi = require("swagger-ui-express");

const openapiSpecs = require("./config/openapi-specs");

const app = express();

const { initDb, seedDb } = require("./database/database");
const { MetroLine, MetroStation } = require("./database/models");

initDb().then(() => {
    console.log("Database initialized");
    seedDb(MetroLine, MetroStation).then(() => {
        console.log("Database seeded");
    }).catch(err => {
        console.error("Failed to seed database:", err);
    });
}).catch(err => {
    console.error("Failed to initialize database:", err);
});

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });

  next();
});

const port = process.env.PORT || 3000;

const healthRoutes = require("./routes/health-routes");
const metroRoutes = require("./routes/metro-routes");

app.use("/metro", metroRoutes);
app.use("/health", healthRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecs));

app.use(express.static('public'));

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

