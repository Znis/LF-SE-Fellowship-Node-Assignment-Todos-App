import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('todos',function(table){
        table.increments('id');
        table.string('title').notNullable().unique();
        table.string('description').notNullable(); 
        table.boolean('completed').notNullable();
        table.string('dueDate').notNullable();
        table.string('priority').notNullable();
        table.string('category').notNullable();
        table.integer('user_id').unsigned().notNullable();

        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');

    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('todos');
}

