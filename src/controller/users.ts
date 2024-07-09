import { Request, Response } from "express";
import * as UsersService from "../services/users";
import userSchema from "../schema/user";

export async function getUserByEmail(req: Request, res: Response) {
  const user = req.body;
  const { error, value } = userSchema.validate(user);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const data = await UsersService.getUserByEmail(value.email);
  if (data!.length > 0) {
    const modelResponse = {
      responseCode: 200,
    };
    return modelResponse;
  } else {
    const modelResponse = {
      responseCode: 401,
      responseMessage: "Invalid User",
    };
    return modelResponse;
  }
}

export async function createUser(req: Request, res: Response) {
  const data = req.body;
  const { error, value } = userSchema.validate(data);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { responseMessage, responseCode } = await UsersService.createUser(
    value
  );

  return res.status(responseCode).json(responseMessage);
}
