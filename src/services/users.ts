import bcrypt from "bcrypt";
import Iuser from "../interfaces/user";
import * as UserModel from "../model/users";

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
  return modelResponse;
}
