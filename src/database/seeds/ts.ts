import { Knex } from "knex";
import * as bcrypt from "bcrypt";

export async function seed(knex: Knex): Promise<void> {
  await knex("users_roles").del();
  await knex("users").del();
  await knex("roles_permissions").del();

  await knex("roles_permissions").insert([
    {
      role: "admin",
      permissions: [
        "create_todo",
        "delete_todo",
        "update_todo",
        "view_todo",
        "create_user",
        "delete_user",
        "edit_user",
      ],
    },
    {
      role: "user",
      permissions: ["create_todo", "update_todo", "view_todo", "delete_todo"],
    },
  ]);

  const hashedPassword = await bcrypt.hash("admin", 10);

  await knex("users").insert({
    name: "admin",
    email: "admin@admin.com",
    password: hashedPassword,
  });

  const [userId] = await knex("users")
    .select("id")
    .where("name", "admin")
    .andWhere("email", "admin@admin.com")
    .andWhere("password", hashedPassword);

  const [roleId] = await knex("roles_permissions")
    .select("id")
    .where("role", "admin");

  await knex("users_roles").insert({
    role_id: roleId.id,
    user_id: userId.id,
  });
}
