import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('roles_permissions', (table) => {
        table.increments('id').primary();
        table.string('role').notNullable();
        table.specificType('permissions', 'text ARRAY').notNullable();
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('roles_permissions');
}

