// Import Pool class from pg to manage PostgreSQL connections
const { Pool } = require('pg');

// Create a new Pool instance (like configuring DbContext with a connection string)
const pool = new Pool ({
    host: "localhost",
    user: "postgres",
    password: "Sibonelo25!",
    database: "BottleStore",
    port: 5432,
});

// Export pool so we can reuse it in other files (like dependency injection)
module.exports = pool;