import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("wallets", (table) => {
        table.uuid("id").primary(); // Removed defaultTo(knex.fn.uuid())
        table.uuid("user_id").references("id").inTable("users").onDelete("CASCADE");
        table.decimal("balance", 14, 2).defaultTo(0);
        table.string("currency").defaultTo("NGN");
        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("wallets");
}
