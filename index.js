"use strict"

const express = require("express");

const cors = require("cors");

const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

const swaggerConfig = require("./config/swagger-config");

const swaggerSpec = swaggerJSDoc(swaggerConfig);

const app = express();

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

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.static('public'));

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

