import { baseKnexConfig } from "../knexFile";
import knex from "knex";
import Iuser from "../interfaces/user";

const knexInstance = knex(baseKnexConfig);




export async function getUserId(user: Iuser){
    try{
        const resultData = await knexInstance
          .select("id")
          .from("users")
          .where("email", user.email).andWhere("password", user.password)
          .then(function (data) {
            return data;
          });
          if(resultData.length > 0){
            return resultData;
          }else{
            return [];
          }
      }
      catch(error){
        console.log(error);
      }
}

export async function createUser(user: Iuser){
    try {
        const databaseInsert = await knexInstance
          .insert({
            email: user.email, 
            password: user.password,
          })
          .into("users")
          .then(function () {
            return (200);
          });
        return databaseInsert;
      } catch (error) {
        console.log(error);
        return 400;
      }

    
}
