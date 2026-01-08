import db from "../src/database";

beforeAll(async () => {
    await db.migrate.latest();
});

afterAll(async () => {
    await db.destroy();
});

beforeEach(async () => {
    // Truncate tables to clean up between tests
    await db("transactions").truncate();
    await db("wallets").truncate(); // Cascade might handle this but safer to be explicit or use CASCADE
    // SQLite doesn't support TRUNCATE with CASCADE well, wait.
    // For MySQL it works. For SQLite in memory, we need to delete.
    // Let's use delete()
    await db("transactions").del();
    await db("wallets").del();
    await db("users").del();
});
