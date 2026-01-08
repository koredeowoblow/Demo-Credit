import type { Knex } from "knex";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: { [key: string]: Knex.Config } = {
    development: {
        client: "mysql2",
        connection: {
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT || 3306),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        },
        migrations: {
            directory: path.join(__dirname, "database", "migrations")
        },
        seeds: {
            directory: path.join(__dirname, "database", "seeds")
        }
    },

    production: {
        client: "pg",
        connection: {
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT || 5432),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            ssl: { rejectUnauthorized: false }
        },
        migrations: {
            directory: path.join(__dirname, "database", "migrations")
        }
    }
};

export default config;
