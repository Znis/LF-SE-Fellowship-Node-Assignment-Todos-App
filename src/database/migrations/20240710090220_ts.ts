import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users_roles", (table) => {
    table.increments("id").primary();
    table.integer("user_id").unsigned().notNullable();
    table.integer("role_id").unsigned().notNullable();

    table
      .foreign("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .foreign("role_id")
      .references("id")
      .inTable("roles_permissions")
      .onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("users_roles");
}
