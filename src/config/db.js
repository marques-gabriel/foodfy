const { Pool } = require("pg")

module.exports = new Pool ({
    user: 'gabriel',
    password: "",
    host: "localhost",
    port: 5432,
    database: "foodfy"
})
