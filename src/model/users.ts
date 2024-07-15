import { Logger } from "winston";
import { baseKnexConfig } from "../knexFile";
import knex, { Knex } from "knex";
import Iuser from "../interfaces/user";
import loggerWithNameSpace from "../utils/logger";

export default class UserModel {
  knexInstance: Knex;
  logger: Logger;
  constructor() {
    this.knexInstance = knex(baseKnexConfig);
    this.logger = loggerWithNameSpace("Users Model");
  }

  async getUserByEmail(email: string) {
    try {
      this.logger.info(`Querying database for user with email ${email}`);
      const resultData = await this.knexInstance
        .select("*")
        .from("users")
        .where("email", email);

      if (!resultData || !resultData.length) {
        this.logger.error(`User with email ${email} not found`);
        return null;
      }
      this.logger.info(`User with email ${email} found`);
      return resultData[0];
    } catch (error) {
      this.logger.error("Query could not be completed");
      return null;
    }
  }

  async createUser(user: Iuser) {
    try {
      this.logger.info("Attempting to insert new user in the database");
      const databaseInsert = await this.knexInstance
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
      this.logger.info("Insertion of new user in database completed");
      return {
        modelResponseCode: 200,
        queryResult: user,
      };
    } catch (error) {
      this.logger.error(
        "Insertion of new user in database could not be completed"
      );
      return {
        modelResponseCode: 400,
        queryResult: null,
      };
    }
  }

  async assignRole(userId: string, role: string) {
    try {
      this.logger.info("Attempting to assign role to the user");

      const databaseInsert = await this.knexInstance
        .insert({
          user_id: userId,
          role_id: role,
        })
        .into("users_roles");
        
      if (!databaseInsert) {
        this.logger.error("Cannot insert the data in the database");
        return {
          modelResponseCode: 400,
          queryResult: null,
        };
      }
      this.logger.info("Assigning role completed");
      return {
        modelResponseCode: 200,
        queryResult: databaseInsert,
      };
    } catch (error) {
      this.logger.error("Assigning role could not be completed");
      return {
        modelResponseCode: 400,
        queryResult: null,
      };
    }
  }
  async editUserById(id: string, user: Iuser) {
    try {
      this.logger.info(`Attempting to edit user with id ${id} in the database`);
      const resultData = await this.knexInstance
        .update({
          name: user.name,
          email: user.email,
          password: user.password,
        })
        .from("users")
        .where("id", id);

      if (!resultData) {
        this.logger.error(`Editing user with id ${id} failed`);
        return {
          modelResponseCode: 400,
          queryResult: null,
        };
      }
      this.logger.info(`Editing user with id ${id} completed`);
      return {
        modelResponseCode: 200,
        queryResult: user,
      };
    } catch (error) {
      this.logger.error(`Editing user with id ${id} could not be completed`);
      return {
        modelResponseCode: 400,
        queryResult: null,
      };
    }
  }
  async deleteUserById(id: string) {
    try {
      this.logger.info(
        `Attempting to delete user with id ${id} in the database`
      );
      const resultData = await this.knexInstance
        .del()
        .from("users")
        .where("id", id);

      if (!resultData) {
        this.logger.error(`Deleting user with id ${id} failed`);
        return {
          modelResponseCode: 400,
          queryResult: false,
        };
      }
      this.logger.info(`Deleted user with id ${id} completed`);
      return {
        modelResponseCode: 200,
        queryResult: true,
      };
    } catch (error) {
      this.logger.error(`Deleting user with id ${id} could not be completed`);
      return {
        modelResponseCode: 400,
        queryResult: false,
      };
    }
  }
  async getRoleId(userId: string) {
    try {
      this.logger.info(`Querying database for roleId of userId ${userId}`);
      const resultData = await this.knexInstance
        .select("role_id")
        .from("users_roles")
        .where("user_id", userId);

      if (!resultData.length) {
        this.logger.error(`roleId of userId ${userId} not found`);
        return null;
      }
      this.logger.error(`roleId of userId ${userId} found`);
      return resultData[0].role_id;
    } catch (error) {
      this.logger.error("Query could not be completed");
      return null;
    }
  }

  async getAssignedPermissionsForRole(roleId: string) {
    try {
      this.logger.info(
        `Querying database for assigned permissions of roleId ${roleId}`
      );
      const resultData = await this.knexInstance
        .select("permissions")
        .from("roles_permissions")
        .where("id", roleId);

      if (!resultData.length) {
        this.logger.error(
          `Assigned permissions for roleId ${roleId} not found`
        );
        return null;
      }
      this.logger.info(`Assigned permissions for roleId ${roleId} found`);
      return resultData[0].permissions;
    } catch (error) {
      this.logger.error("Query could not be completed");
      return null;
    }
  }
}
