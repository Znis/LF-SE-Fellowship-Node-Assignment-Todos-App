import { NextFunction, Response } from "express";
import { Request } from "../interfaces/auth";
import jwt from "jsonwebtoken";
import config from "../config";
import AuthService from "../services/auth";
import { UnauthenticatedError } from "../error/unauthenticatedError";
import { Iuser } from "../interfaces/user";
import { ForbiddenError } from "../error/forbiddenError";
import loggerWithNameSpace from "../utils/logger";
import { ModelError } from "../error/modelError";

const logger = loggerWithNameSpace("Auth Middleware");

export function auth(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers;
  logger.info("Checking for authorization headers");
  if (!authorization) {
    logger.error("Authorization header not found");
    return res.status(401).json({ error: "Authentication Failed" });
  }
  logger.info("Checking for Access Token");
  const token = authorization.split(" ");
  if (token.length !== 2 || token[0] !== "Bearer") {
    logger.info("Access Token not found");
    return res.status(401).json({ error: "Authentication Failed" });
  }

  try {
    logger.info("Verifying the Access Token");
    const verifiedData = jwt.verify(token[1], config.jwt.secret!) as Iuser;
    if (!verifiedData) {
      logger.error("Error verifying the authenticity of token");
      next(new UnauthenticatedError("Unauthenticated"));
      return;
    }
    logger.info("Token Verified");
    req.user = verifiedData;

    next();
  } catch {
    logger.error("Token Verification failed");
    next(new UnauthenticatedError("Unauthenticated"));
  }
}

export function authorize(permission: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try{
    const user = req.user!;
    logger.info("Checking for the permission");
    const permissions = await AuthService.getAssignedPermission(user.id!);
    if (!permissions!.includes(permission)) {
      logger.error("Operation not permitted");
      next(new ForbiddenError("Forbidden"));
      return;
    }
    logger.info("Operation permitted");
    next();
  }catch{
    logger.error("Permission Checking failed");
    next(new ModelError("Permission retrieval error"));
  }
  };
}
