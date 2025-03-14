const Pool = require("pg").Pool;
const fs = require('fs')

const pool = new Pool({
  user: "USERNAME",
  password: "PASSWORD",
  host: "HOST",
  port: PORT,
  database: "DATABASE",
  ssl: {        
    ca: fs.readFileSync('CERTPATH').toString()
  }
});

module.exports = pool;
