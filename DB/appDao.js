const Pool = require("pg").Pool;
// const token = require('./token')

require("dotenv").config();
const logger = require("../Logger/Logger");

const devConfig = `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`;

const proConfig = process.env.DATABASE_URL; //heroku addons

const pool = new Pool({
  connectionString:
    process.env.NODE_ENV === "production" ? proConfig : devConfig,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on("error", (err, client) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

async function execQuery(query, props) {
  const client = await pool.connect();

  const res = await client.query(query, props);
  console.log(query, props);
  client.release();
  return res;
}

async function execQueryNP(query) {
  const client = await pool.connect();

  const res = await client.query(query);
  console.log(query);
  client.release();
  return res;
}

module.exports = { execQuery, execQueryNP };
