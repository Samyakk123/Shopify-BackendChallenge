const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config');

const app = express();

app.use(express.json());
app.use(cors());

/**
 * @see https://mongoosejs.com/docs/migrating_to_6.html#no-more-deprecation-warning-options
 */
mongoose.connect(config.DATABASE_URI);

const db = mongoose.connection;

db.once('open', () => {
  console.info('MongoDB connected!');
});

const inventoryRouter = require('./routes/inventory');

app.use('/api/inventory', inventoryRouter);

app.listen(config.PORT, () => {
  console.info(`server is running on port: ${config.PORT}`);
});

module.exports = app;

