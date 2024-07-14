import bcrypt from "bcrypt";
import Iuser from "../interfaces/user";
import UserModel from "../model/users";
import { roles } from "../enums/users";
import { ModelError } from "../error/modelError";
import loggerWithNameSpace from "../utils/logger";
import { Logger } from "winston";

export default class UserServices {
  logger: Logger;
  salt: number;
  userModel: UserModel;
  constructor() {
    this.logger = loggerWithNameSpace("Users Service");
    this.salt = 10;
    this.userModel = new UserModel();
  }

  async getUserByEmail(email: string) {
    this.logger.info(`Getting User with email ${email} from Users Model`);
    const data = await this.userModel.getUserByEmail(email);
    return data;
  }

  async createUser(user: Iuser) {
    this.logger.info("Creating new user");

    const hashedPassword = await bcrypt.hash(user.password, this.salt);
    user.password = hashedPassword;
    const createUserResponse = await this.userModel.createUser(user);

    if (createUserResponse.modelResponseCode != 200) {
      this.logger.error("Could not create new user");
      throw new ModelError("Could not create User");
    }

    const newUser = await this.getUserByEmail(user.email);

    this.logger.info("Assigning role to new user");
    await this.assignRole(newUser!.id!, roles.user);

    return createUserResponse.queryResult;
  }

  async editUser(id: string, user: Iuser) {
    this.logger.info(`Editing user with id ${id}`);
    const hashedPassword = await bcrypt.hash(user.password, this.salt);
    user.password = hashedPassword;
    const { modelResponseCode, queryResult } =
      await this.userModel.editUserById(id, user);
    if (modelResponseCode != 200) {
      this.logger.error(`Could not edit user with id ${id}`);
      throw new ModelError("Could not edit User");
    }
    return queryResult;
  }

  async deleteUser(id: string) {
    this.logger.info(`Deleting user with id ${id}`);
    const { modelResponseCode, queryResult } =
      await this.userModel.deleteUserById(id);
    if (modelResponseCode != 200) {
      this.logger.error(`Could not delete user with id ${id}`);
      throw new ModelError("Could not delete User");
    }
    return queryResult;
  }

  async assignRole(userId: string, role: string) {
    this.logger.info(`Assigning role to the user with id ${userId}`);
    const { modelResponseCode, queryResult } = await this.userModel.assignRole(
      userId,
      role
    );
    if (modelResponseCode != 200) {
      this.logger.error(`Could not assign role to the user with id ${userId}`);
      throw new ModelError("Could not assign Role");
    }
    return queryResult;
  }

  async getRoleId(userId: string) {
    const data = await this.userModel.getRoleId(userId);
    return data;
  }

  async getAssignedPermissionsForRole(roleId: string) {
    const data = await this.userModel.getAssignedPermissionsForRole(roleId);
    return data;
  }

  async getAssignedPermission(userId: string) {
    this.logger.info(
      `Getting assigned permissions for user with userId ${userId}`
    );
    const roleId = await this.getRoleId(userId);
    if (!roleId!) {
      this.logger.error(`roleId for user ${userId} not found`);
      return [];
    }
    const permissions = await this.getAssignedPermissionsForRole(roleId!);
    if (!permissions!) {
      this.logger.error(`No any permission for user with userId ${userId}`);
      return [];
    }
    return permissions!;
  }
}
