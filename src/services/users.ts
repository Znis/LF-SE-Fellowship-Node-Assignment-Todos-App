import bcrypt from "bcrypt";
import {
  getAssignedPermissionsForRoleQuery,
  getRoleIdQuery,
  getUserByEmailQuery,
  Iuser,
} from "../interfaces/user";
import UserModel from "../model/users";
import { roles } from "../enums/users";
import { ModelError } from "../error/modelError";
import loggerWithNameSpace from "../utils/logger";

const logger = loggerWithNameSpace("Users Service");
const salt = 10;
export default class UserServices {
  static async getUserByEmail(email: string) {
    logger.info(`Getting User with email ${email} from Users Model`);
    const data: getUserByEmailQuery = await UserModel.getUserByEmail(email);
    if (!data) {
      logger.error(`User with email ${email} not found`);
      return null;
    }
    logger.info(`User with email ${email} found`);
    return data;
  }

  static async createUser(user: Iuser) {
    logger.info("Creating new user");
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
    const queryResult: number[] = await UserModel.createUser(user);
    if (!queryResult) {
      logger.error("Could not create new user");
      throw new ModelError("Could not create User");
    }
    logger.info("Insertion of new user in database completed");
    const newUser = await this.getUserByEmail(user.email);

    logger.info("Assigning role to new user");
    await this.assignRole(newUser!.id!, roles.user);
    return user;
  }

  static async editUser(id: string, user: Iuser) {
    logger.info(`Editing user with id ${id}`);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
    const queryResult: number = await UserModel.editUserById(id, user);
    if (!queryResult) {
      logger.error(`Editing user with id ${id} failed`);
      logger.error(`Could not edit user with id ${id}`);
      throw new ModelError("Could not edit User");
    }
    logger.info(`Editing user with id ${id} completed`);

    return user;
  }

  static async deleteUser(id: string) {
    logger.info(`Deleting user with id ${id}`);
    const queryResult: number = await UserModel.deleteUserById(id);
    if (!queryResult) {
      logger.error(`Deleting user with id ${id} failed`);
      logger.error(`Could not delete user with id ${id}`);
      throw new ModelError("Could not delete User");
    }
    logger.info(`Deleted user with id ${id} completed`);
    return true;
  }

  static async assignRole(userId: string, role: string) {
    logger.info(`Assigning role to the user with id ${userId}`);
    const queryResult: number[] = await UserModel.assignRole(userId, role);
    if (!queryResult) {
      logger.error("Cannot insert the data in the database");
      logger.error(`Could not assign role to the user with id ${userId}`);
      throw new ModelError("Could not assign Role");
    }
    logger.info("Assigning role completed");
    return queryResult;
  }

  static async getRoleId(userId: string) {
    const data: getRoleIdQuery = await UserModel.getRoleId(userId);
    if (!data) {
      logger.error(`roleId of userId ${userId} not found`);
      return null;
    }
    logger.info(`roleId of userId ${userId} found`);
    return data.roleId;
  }

  static async getAssignedPermissionsForRole(roleId: string) {
    const data: getAssignedPermissionsForRoleQuery =
      await UserModel.getAssignedPermissionsForRole(roleId);
    if (!data) {
      logger.error(`Assigned permissions for roleId ${roleId} not found`);
      return null;
    }
    logger.info(`Assigned permissions for roleId ${roleId} found`);
    return data.permissions;
  }

  static async getAssignedPermission(userId: string) {
    logger.info(`Getting assigned permissions for user with userId ${userId}`);
    const roleId = await this.getRoleId(userId);
    if (!roleId!) {
      logger.error(`roleId for user ${userId} not found`);
      return [];
    }
    const permissions = await this.getAssignedPermissionsForRole(roleId!);
    if (!permissions!) {
      logger.error(`No any permission for user with userId ${userId}`);
      return [];
    }
    return permissions!;
  }
}
