//db.js

// Import Pool class from pg to manage PostgreSQL connections
const { Pool } = require('pg');

//Load environment variables (like reading from appsettings.json)
require('dotenv').config();
const isRender = Boolean(process.env.DATABASE_URL);
const pool = new Pool({
    connectionString:  process.env.DATABASE_URL|| "postgresql://postgres:Sibonelo25!@localhost:5432/BottleStore",
    ssl: isRender
    ? {rejectUnauthorized: false} //Required for render
    : false, //No SSL for local
});

// Export pool so we can reuse it in other files (like dependency injection)
module.exports = pool;