import { Iuser } from "../interfaces/user";
import { BaseModel } from "./base";

export default class UserModel extends BaseModel {
  static getUserByEmail(email: string) {
    try {
      return this.queryBuilder()
        .select("*")
        .from("users")
        .where("email", email)
        .first();
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  static createUser(user: Iuser) {
    try {
      return this.queryBuilder()
        .insert({
          name: user.name,
          email: user.email,
          password: user.password,
        })
        .into("users");
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  static assignRole(userId: string, role: string) {
    try {
      return this.queryBuilder()
        .insert({
          userId: userId,
          roleId: role,
        })
        .into("users_roles");
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  static editUserById(id: string, user: Iuser) {
    try {
      return this.queryBuilder()
        .update({
          name: user.name,
          email: user.email,
          password: user.password,
        })
        .from("users")
        .where("id", id);
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  static deleteUserById(id: string) {
    try {
      return this.queryBuilder().del().from("users").where("id", id);
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  static getRoleId(userId: string) {
    try {
      return this.queryBuilder()
        .select("role_id")
        .table("users_roles")
        .where("user_id", userId)
        .first();
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static getAssignedPermissionsForRole(roleId: string) {
    try {
      return this.queryBuilder()
        .select("permissions")
        .from("roles_permissions")
        .where("id", roleId)
        .first();
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
