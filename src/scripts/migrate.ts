import knex from "knex";
import config from "../knexfile.js";

async function runMigrations() {
    console.log("Starting database migrations...");

    const environment = process.env.NODE_ENV || "development";
    const dbConfig = config[environment];

    if (!dbConfig) {
        console.error(`No configuration found for environment: ${environment}`);
        process.exit(1);
    }

    const db = knex(dbConfig);

    try {
        console.log(`Running migrations for ${environment}...`);
        const [batchNo, log] = await db.migrate.latest();

        if (log.length === 0) {
            console.log("Already up to date.");
        } else {
            console.log(`Batch ${batchNo} run: ${log.length} migrations`);
            console.log(log.join("\n"));
        }

        console.log("Migrations finished successfully.");
        process.exit(0);
    } catch (error) {
        console.error("Migration failed!");
        console.error(error);
        process.exit(1);
    } finally {
        await db.destroy();
    }
}

runMigrations();
