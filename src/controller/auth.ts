import HttpStatusCode from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import * as AuthService from "../services/auth";
import loggerWithNameSpace from "../utils/logger";

const logger = loggerWithNameSpace("Auth Controller");

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { body } = req;
    logger.info("Attempting to login");
    const authResponse = await AuthService.login(req, res, body);
    logger.info("Login Successful");
    return res.status(HttpStatusCode.OK).json(authResponse);
  } catch (error) {
    logger.error("Login Failed");
    next(error);
  }
}

//function to generate a new accesstoken with the refreshtoken
export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const { authorization } = req.headers;
    logger.info("Attempting to generate new access token");
    const authResponse = await AuthService.refresh(req, res, authorization);
    logger.info("New access token generated");
    return res.status(HttpStatusCode.OK).json(authResponse);
  } catch (error) {
    logger.error("New access token generation failed");
    next(error);
  }
}
