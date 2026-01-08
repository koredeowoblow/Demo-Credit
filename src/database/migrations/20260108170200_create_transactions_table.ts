import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("transactions", (table) => {
        table.uuid("id").primary(); // Removed defaultTo(knex.fn.uuid())
        table.uuid("wallet_id").references("id").inTable("wallets").onDelete("CASCADE");
        table.enum("type", ["CREDIT", "DEBIT"]).notNullable();
        table.decimal("amount", 14, 2).notNullable();
        table.string("reference").notNullable().unique();
        table.uuid("counterparty_wallet_id").nullable();
        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("transactions");
}
