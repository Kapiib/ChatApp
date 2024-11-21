const mysql = require("mysql2/promise");
require("dotenv").config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true,
    waitForConnections: true,
    queueLimit: 5000,
    connectionLimit: 10
});

db.getConnection()
    .then(connection => {
        console.log("Database connected successfully.");
        connection.release(); // Release connection back to pool
    })
    .catch(err => {
        console.error("Database connection failed:", err.message);
    });

module.exports = db;