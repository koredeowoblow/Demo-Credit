export async function up(knex) {
    await knex.schema.createTable("users", (table) => {
        table.uuid("id").primary(); // Removed defaultTo(knex.fn.uuid())
        table.string("name").notNullable();
        table.string("email").notNullable().unique();
        table.string("password").notNullable();
        table.timestamps(true, true);
    });
}
export async function down(knex) {
    await knex.schema.dropTable("users");
}
