import { baseKnexConfig } from "../knexFile";
import knex from "knex";
import Iuser from "../interfaces/user";
import loggerWithNameSpace from "../utils/logger";

const knexInstance = knex(baseKnexConfig);
const logger = loggerWithNameSpace("Users Model");

export async function getUserByEmail(email: string) {
  try {
    logger.info(`Querying database for user with email ${email}`);
    const resultData = await knexInstance
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

export async function createUser(user: Iuser) {
  try {
    logger.info("Attempting to insert new user in the database");
    const databaseInsert = await knexInstance
      .insert({
        name: user.name,
        email: user.email,
        password: user.password,
      })
      .into("users");
    if(!databaseInsert){
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

export async function assignRole(userId: string, role: string) {
  try {
    logger.info("Attempting to assign role to the user");
    const data = {
      user_id: userId,
      role_id: role,
    }
    const databaseInsert = await knexInstance
      .insert({
        user_id: userId,
        role_id: role,
      })
      .into("users_roles")
      .then(function () {
        return {
          modelResponseCode: 200,
          queryResult: data,
        };
      });
    logger.info("Assigning role completed");
    return databaseInsert;
  } catch (error) {
    logger.error("Assigning role could not be completed");
    return {
      modelResponseCode: 400,
      queryResult: null,
    };
  }
}
export async function editUserById(id: string, user: Iuser) {
  try {
    logger.info(`Attempting to edit user with id ${id} in the database`);
    const resultData = await knexInstance
    .update({
      name: user.name,
      email: user.email,
      password: user.password,
    })  
    .from("users")
    .where("id", id)
    .then((data) => {
        if (!data) {
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
      });
    return resultData;
  } catch (error) {
    logger.error(`Editing user with id ${id} could not be completed`);
    return {
      modelResponseCode: 400,
      queryResult: null,
    };
  }
}
export async function deleteUserById(id: string) {
  try {
    logger.info(`Attempting to delete user with id ${id} in the database`);
    const resultData = await knexInstance
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
export async function getRoleId(userId: string) {
  try {
    logger.info(`Querying database for roleId of userId ${userId}`);
    const resultData = await knexInstance
      .select("role_id")
      .from("users_roles")
      .where("user_id", userId);
  
    if (!resultData.length) {
      logger.error(`roleId of userId ${userId} not found`);
      return null;
    }
    logger.error(`roleId of userId ${userId} found`);
    return resultData[0].role_id;
  } catch (error) {
    logger.error("Query could not be completed");
    return null;
  }
}

export async function getAssignedPermissionsForRole(roleId: string) {
  try {
    logger.info(
      `Querying database for assigned permissions of roleId ${roleId}`
    );
    const resultData = await knexInstance
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
