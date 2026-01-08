import type { Knex } from "knex";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

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
            directory: path.join(__dirname, "src", "database", "migrations"),
            extension: "ts",
        },
        seeds: {
            directory: path.join(__dirname, "src", "database", "seeds"),
            extension: "ts",
        },
    },
    test: {
        client: "sqlite3",
        connection: ":memory:",
        useNullAsDefault: true,
        migrations: {
            directory: path.join(__dirname, "src", "database", "migrations"),
        },
        seeds: {
            directory: path.join(__dirname, "src", "database", "seeds"),
        },
    },
    production: {
        client: "mysql2",
        connection: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: Number(process.env.DB_PORT),
        },
        migrations: {
            directory: path.join(__dirname, "src", "database", "migrations"),
        },
    },
};

export default config;
