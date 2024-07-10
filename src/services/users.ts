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

export async function editUser(id: string, user: Iuser) {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password = hashedPassword;
  const modelResponseCode = await UserModel.editUserById(id, user);
  const modelResponse = {
    status: modelResponseCode,
    error: modelResponseCode == 200 ? "" : "Update Failed",
    data: "",
  };
  return modelResponse;
}

export async function deleteUser(id: string) {
  const modelResponseCode = await UserModel.deleteUserById(id);
  const modelResponse = {
    status: modelResponseCode,
    error: modelResponseCode == 200 ? "" : "Deletion Failed",
    data: "",
  };
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

async function getAssignedPermissionsForRole(roleId: string){
  const data = await UserModel.getAssignedPermissionsForRole(roleId);
  return data;
}

export async function getAssignedPermission(userId: string){
const roleId = await getRoleId(userId);
if(roleId!.length == 0){
  return [];
}
const permissions = await getAssignedPermissionsForRole(roleId![0]);
if(permissions!.length == 0){
  return [];
}
return permissions![0];
}