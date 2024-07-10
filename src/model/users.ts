import { baseKnexConfig } from "../knexFile";
import knex from "knex";
import Iuser from "../interfaces/user";

const knexInstance = knex(baseKnexConfig);

export async function getUserByEmail(email: string) {
  try {
    const resultData = await knexInstance
      .select("*")
      .from("users")
      .where("email", email)
      .then(function (data) {
        return data;
      }) as Iuser[];
    if (resultData.length > 0) {
      return resultData;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
  }
}

export async function createUser(user: Iuser) {
  try {
    const databaseInsert = await knexInstance
      .insert({
        name: user.name,
        email: user.email,
        password: user.password,
      })
      .into("users")
      .then(function () {
        return 200;
      });
    return databaseInsert;
  } catch (error) {
    console.log(error);
    return 400;
  }
}

export async function assignRole(userId: string, role: string){
try{   
  const databaseInsert = await knexInstance
  .insert({
    user_id: userId,
    role_id: role
  })
  .into("users_roles")
  .then(function () {
    return 200;
  });
return databaseInsert;
} catch (error) {
console.log(error);
return 400;
}
}

export async function getRoleId(userId: string){
  try {
    const resultData = await knexInstance
      .select("role_id")
      .from("users_roles")
      .where("user_id", userId)
      .then(function (data) {
        return data;
      });
    if (resultData.length > 0) {
      return resultData;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
  }
}

export async function getAssignedPermissionsForRole(role: string){
  try {
    const resultData = await knexInstance
      .select("permissions")
      .from("roles_permissions")
      .where("role", role)
      .then(function (data) {
        return data;
      });
    if (resultData.length > 0) {
      return resultData[0];
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
  }
}