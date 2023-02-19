const buildDevLogger = require("./Devlogger");
const buildProdLogger = require("./ProdLogger");
const dotenv = require("dotenv").config();

let logger = null;

if (process.env.NODE_ENV == "production") {
  logger = buildProdLogger();
} else {
  logger = buildDevLogger();
}

module.exports = logger;
