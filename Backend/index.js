const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const config = require("./config");
const path = require("path");

const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const app = express();

app.use(express.json());
app.use(cors());

/**
 * @see https://mongoosejs.com/docs/migrating_to_6.html#no-more-deprecation-warning-options
 */
mongoose.connect(config.DATABASE_URI);

const db = mongoose.connection;

db.once("open", () => {
  console.info("MongoDB connected!");
});

const inventoryRouter = require("./routes/inventory");

app.use("/api/inventory", inventoryRouter);

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "API - Inventory Manager",
      description: "Inventory Manager Information",
      contact: {
        name: "Samyak Mehta",
      },
    },
    host: ["shopifybackendchallenge.herokuapp.com"],
    schemes: ["https"],
    definitions: {
      Inventory: {
        type: "object",
        properties: {
          name: {
            type: "string",
          },
          price: {
            type: "integer",
            format: "int64",
          },
          description: {
            type: "string",
          },
          quantity: {
            type: "integer",
            format: "int64",
          },
          brand: {
            type: "string",
          },
        },
      },
    },
  },
  apis: ["./routes/inventory.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.static(__dirname + "/public"));
app.use(express.static(path.join(__dirname, "..", "Frontend", "build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "Frontend", "build", "index.html"));
});

app.listen(config.PORT, () => {
  console.info(`server is running on port: ${config.PORT}`);
});

module.exports = app;
