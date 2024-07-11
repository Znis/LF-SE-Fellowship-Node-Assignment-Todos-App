import bcrypt from "bcrypt";
import Iuser from "../interfaces/user";
import * as UserModel from "../model/users";
import { roles } from "../enums/users";
import { ModelError } from "../../error/modelError";

export async function getUserByEmail(email: string) {
  const data = await UserModel.getUserByEmail(email);
  return data;
}

export async function createUser(user: Iuser) {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password = hashedPassword;

  const createUserResponse = await UserModel.createUser(user);
  if(createUserResponse.modelResponseCode != 200){
     throw new ModelError("Could not create User");
  }

    const newUser = await getUserByEmail(user.email);

    await assignRole(newUser!.id!, roles.user);

    return createUserResponse.queryResult;

}

export async function editUser(id: string, user: Iuser) {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password = hashedPassword;
  const { modelResponseCode, queryResult } = await UserModel.editUserById(id, user);
  if(modelResponseCode != 200){
    throw new ModelError("Could not edit User");
  }
  return queryResult;

}

export async function deleteUser(id: string) {
  const { modelResponseCode, queryResult } = await UserModel.deleteUserById(id);
  if(modelResponseCode != 200){
    throw new ModelError("Could not delete User");
  }
  return queryResult;

}

export async function assignRole(userId: string, role: string){
const { modelResponseCode, queryResult } = await UserModel.assignRole(userId, role);
if(modelResponseCode != 200){
  throw new ModelError("Could not assign Role");
}
return queryResult;

}

async function getRoleId(userId: string){
  const data = await UserModel.getRoleId(userId);
  return data;

}

async function getAssignedPermissionsForRole(roleId: string){
  const data = await UserModel.getAssignedPermissionsForRole(roleId);
  return data;
}

export async function getAssignedPermission(userId: string){
const roleId = await getRoleId(userId);
if(!roleId!.length){
  return [];
}
const permissions = await getAssignedPermissionsForRole(roleId![0]);
if(!permissions!.length){
  return [];
}
return permissions![0];
}

