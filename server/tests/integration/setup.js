const path = require("path");
const fs = require("fs");
const { Client } = require("pg");

require("dotenv").config({ path: path.resolve(__dirname, "../../.env.test") });

module.exports = async () => {
    const config = {
        user: process.env.DB_USER || "user",
        password: process.env.DB_PASSWORD || "password",
        host: process.env.DB_HOST || "localhost",
        port: process.env.DB_PORT || 5433,
    };
    const dbName = process.env.DB_NAME || "cd_database_test";

    const admin = new Client({ ...config, database: "postgres" });
    await admin.connect();
    const exists = await admin.query(
        "SELECT 1 FROM pg_database WHERE datname = $1",
        [dbName],
    );
    if (exists.rowCount === 0) {
        await admin.query(`CREATE DATABASE ${dbName}`);
    }
    await admin.end();

    const schema = fs.readFileSync(
        path.resolve(__dirname, "../../configs/import.sql"),
        "utf-8",
    );
    const db = new Client({ ...config, database: dbName });
    await db.connect();
    await db.query(schema);
    await db.end();
};
