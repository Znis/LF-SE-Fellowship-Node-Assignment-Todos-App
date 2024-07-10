import bcrypt from "bcrypt";
import Iuser from "../interfaces/user";
import * as UserModel from "../model/users";
import { roles } from "../enums/users";

export async function getUserByEmail(email: string) {
  const data = await UserModel.getUserByEmail(email);
  return data;
}

export async function createUser(user: Iuser) {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password = hashedPassword;

  const modelResponseCode = await UserModel.createUser(user);
  const modelResponse = {
    responseCode: modelResponseCode,
    responseMessage:
      modelResponseCode == 200 ? "Creation Successful" : "Creation Failed",
  };
  if(modelResponse.responseCode == 200){
    const userId = await getUserByEmail(user.email);
    const assignRoleResponse = await assignRole(userId![0].id!, roles.user);
    if(!(assignRoleResponse.responseCode == 200)){
      return {
        responseCode: 500,
        responseMessage: "Role Assigning Failed"
      };
    }
  }
  return modelResponse;
}

export async function assignRole(userId: string, role: string){
const modelResponseCode = await UserModel.assignRole(userId, role);
const modelResponse = {
  responseCode: modelResponseCode,
  responseMessage:
    modelResponseCode == 200 ? "Role Assignment Successful" : "Role Assignment Failed",
};
return modelResponse;
}

async function getRoleId(userId: string){
  const data = await UserModel.getRoleId(userId);
  return data;

}

async function getAssignedPermissionsForRole(role: string){
  const data = await UserModel.getAssignedPermissionsForRole(role);
  return data;
}

export async function getAssignedPermission(userId: string){
const roleId = await getRoleId(userId);
if(roleId!.length == 0){
  return {error: "No RoleId found"};
}
const permissions = await getAssignedPermissionsForRole(roleId![0]);
if(permissions!.length == 0){
  return {error: "No Permissions found"};
}
return permissions;
}