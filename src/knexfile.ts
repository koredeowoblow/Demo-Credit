import type { Knex } from "knex";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Adjusted path to .env. 
// In dev: src/knexfile.ts -> __dirname is src/. .env is ../.env
// In prod: dist/knexfile.js -> __dirname is dist/. .env is ../.env
dotenv.config({ path: path.join(__dirname, "../.env") });

const config: { [key: string]: Knex.Config } = {
    development: {
        client: "mysql2",
        connection: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: Number(process.env.DB_PORT),
        },
        migrations: {
            // Adjusted paths to be relative to the location of this file
            directory: path.join(__dirname, "database", "migrations"),
            extension: "ts",
        },
        seeds: {
            directory: path.join(__dirname, "database", "seeds"),
            extension: "ts",
        },
    },
    test: {
        client: "sqlite3",
        connection: ":memory:",
        useNullAsDefault: true,
        migrations: {
            directory: path.join(__dirname, "database", "migrations"),
        },
        seeds: {
            directory: path.join(__dirname, "database", "seeds"),
        },
    },
    production: {
        client: "postgres",
        connection: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: Number(process.env.DB_PORT),
        },
        migrations: {
            directory: path.join(__dirname, "database", "migrations"),
        },
    },
};

export default config;
