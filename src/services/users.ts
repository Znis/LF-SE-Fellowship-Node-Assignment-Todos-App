import bcrypt from "bcrypt";
import Iuser from "../interfaces/user";
import * as UserModel from "../model/users";
import { roles } from "../enums/users";
import { ModelError } from "../error/modelError";
import loggerWithNameSpace from "../utils/logger";

const logger = loggerWithNameSpace("Users Service");
const salt = 10;

export async function getUserByEmail(email: string) {
  logger.info(`Getting User with email ${email} from Todos Model`);
  const data = await UserModel.getUserByEmail(email);
  return data;
}

export async function createUser(user: Iuser) {
  logger.info("Creating new user");
  const hashedPassword = await bcrypt.hash(user.password, salt);
  user.password = hashedPassword;

  const createUserResponse = await UserModel.createUser(user);
  if (createUserResponse.modelResponseCode != 200) {
    logger.error("Could not create new user");
    throw new ModelError("Could not create User");
  }

  const newUser = await getUserByEmail(user.email);

  logger.info("Assigning role to new user");
  await assignRole(newUser!.id!, roles.user);

  return createUserResponse.queryResult;
}

export async function editUser(id: string, user: Iuser) {
  logger.info(`Editing user with id ${id}`);
  const hashedPassword = await bcrypt.hash(user.password, salt);
  user.password = hashedPassword;
  const { modelResponseCode, queryResult } = await UserModel.editUserById(
    id,
    user
  );
  if (modelResponseCode != 200) {
    logger.error(`Could not edit user with id ${id}`);
    throw new ModelError("Could not edit User");
  }
  return queryResult;
}

export async function deleteUser(id: string) {
  logger.info(`Deleting user with id ${id}`);
  const { modelResponseCode, queryResult } = await UserModel.deleteUserById(id);
  if (modelResponseCode != 200) {
    logger.error(`Could not delete user with id ${id}`);
    throw new ModelError("Could not delete User");
  }
  return queryResult;
}

export async function assignRole(userId: string, role: string) {
  logger.info(`Assigning role to the user with id ${userId}`);
  const { modelResponseCode, queryResult } = await UserModel.assignRole(
    userId,
    role
  );
  if (modelResponseCode != 200) {
    logger.error(`Could not assign role to the user with id ${userId}`);
    throw new ModelError("Could not assign Role");
  }
  return queryResult;
}

async function getRoleId(userId: string) {
  const data = await UserModel.getRoleId(userId);
  return data;
}

async function getAssignedPermissionsForRole(roleId: string) {
  const data = await UserModel.getAssignedPermissionsForRole(roleId);
  return data;
}

export async function getAssignedPermission(userId: string) {
  logger.info(`Getting assigned permissions for user with userId ${userId}`);
  const roleId = await getRoleId(userId);
  if (!roleId!.length) {
    logger.error(`roleId for user ${userId} not found`);
    return [];
  }
  const permissions = await getAssignedPermissionsForRole(roleId![0]);
  if (!permissions!.length) {
    logger.error(`No any permission for user with userId ${userId}`);
    return [];
  }
  return permissions![0];
}
