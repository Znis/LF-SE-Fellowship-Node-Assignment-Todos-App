import { assignRoleQuery, createUserQuery, getAssignedPermissionsForRoleQuery, getRoleIdQuery, getUserByEmailQuery, Iuser } from "../interfaces/user";
import loggerWithNameSpace from "../utils/logger";
import { BaseModel } from "./base";

const logger = loggerWithNameSpace("Users Model");

export default class UserModel extends BaseModel {
  static async getUserByEmail(email: string) {
    try {
      logger.info(`Querying database for user with email ${email}`);
      const resultData: getUserByEmailQuery[] = await this.queryBuilder()
        .select("*")
        .from("users")
        .where("email", email);

      if (!resultData || !resultData.length) {
        logger.error(`User with email ${email} not found`);
        return null;
      }
      logger.info(`User with email ${email} found`);
      return resultData[0];
    } catch (error) {
      logger.error("Query could not be completed");
      return null;
    }
  }

  static async createUser(user: Iuser) {
    try {
      logger.info("Attempting to insert new user in the database");
      const databaseInsert: createUserQuery = await this.queryBuilder()
        .insert({
          name: user.name,
          email: user.email,
          password: user.password,
        })
        .into("users");
      if (!databaseInsert) {
        return {
          modelResponseCode: 400,
          queryResult: null,
        };
      }
      logger.info("Insertion of new user in database completed");
      return {
        modelResponseCode: 200,
        queryResult: user,
      };
    } catch (error) {
      logger.error("Insertion of new user in database could not be completed");
      return {
        modelResponseCode: 400,
        queryResult: null,
      };
    }
  }

  static async assignRole(userId: string, role: string) {
    try {
      logger.info("Attempting to assign role to the user");

      const databaseInsert: assignRoleQuery  = await this.queryBuilder()
        .insert({
          userId: userId,
          roleId: role,
        })
        .into("users_roles");

      if (!databaseInsert) {
        logger.error("Cannot insert the data in the database");
        return {
          modelResponseCode: 400,
          queryResult: null,
        };
      }
      logger.info("Assigning role completed");
      return {
        modelResponseCode: 200,
        queryResult: databaseInsert,
      };
    } catch (error) {
      logger.error("Assigning role could not be completed");
      return {
        modelResponseCode: 400,
        queryResult: null,
      };
    }
  }
  static async editUserById(id: string, user: Iuser) {
    try {
      logger.info(`Attempting to edit user with id ${id} in the database`);
      const resultData: number = await this.queryBuilder()
        .update({
          name: user.name,
          email: user.email,
          password: user.password,
        })
        .from("users")
        .where("id", id);

      if (!resultData) {
        logger.error(`Editing user with id ${id} failed`);
        return {
          modelResponseCode: 400,
          queryResult: null,
        };
      }
      logger.info(`Editing user with id ${id} completed`);
      return {
        modelResponseCode: 200,
        queryResult: user,
      };
    } catch (error) {
      logger.error(`Editing user with id ${id} could not be completed`);
      return {
        modelResponseCode: 400,
        queryResult: null,
      };
    }
  }
  static async deleteUserById(id: string) {
    try {
      logger.info(`Attempting to delete user with id ${id} in the database`);
      const resultData: number = await this.queryBuilder()
        .del()
        .from("users")
        .where("id", id);

      if (!resultData) {
        logger.error(`Deleting user with id ${id} failed`);
        return {
          modelResponseCode: 400,
          queryResult: false,
        };
      }
      logger.info(`Deleted user with id ${id} completed`);
      return {
        modelResponseCode: 200,
        queryResult: true,
      };
    } catch (error) {
      logger.error(`Deleting user with id ${id} could not be completed`);
      return {
        modelResponseCode: 400,
        queryResult: false,
      };
    }
  }
  static async getRoleId(userId: string) {
    try {
      logger.info(`Querying database for roleId of userId ${userId}`);
      const resultData: getRoleIdQuery[] = await this.queryBuilder()
        .select("role_id")
        .table("users_roles")
        .where("user_id", userId);
      if (!resultData.length) {
        logger.error(`roleId of userId ${userId} not found`);
        return null;
      }
      logger.info(`roleId of userId ${userId} found`);
      return resultData[0].roleId;
    } catch (error) {
      logger.error("Query could not be completed");
      return null;
    }
  }

  static async getAssignedPermissionsForRole(roleId: string) {
    try {
      logger.info(
        `Querying database for assigned permissions of roleId ${roleId}`
      );
      const resultData: getAssignedPermissionsForRoleQuery[] = await this.queryBuilder()
        .select("permissions")
        .from("roles_permissions")
        .where("id", roleId);

      if (!resultData.length) {
        logger.error(`Assigned permissions for roleId ${roleId} not found`);
        return null;
      }
      logger.info(`Assigned permissions for roleId ${roleId} found`);
      return resultData[0].permissions;
    } catch (error) {
      logger.error("Query could not be completed");
      return null;
    }
  }
}
