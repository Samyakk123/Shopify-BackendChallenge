const dotenv = require('dotenv');
dotenv.config();

const config = {
  DATABASE_URI: process.env.DATABASE_URI ?? "mongodb://localhost:27017/db",
  PORT: process.env.PORT ?? 5000,
}

module.exports = config;