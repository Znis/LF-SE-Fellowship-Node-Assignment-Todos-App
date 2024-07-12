import HttpStatusCode from "http-status-codes";
import jwt, { sign } from "jsonwebtoken";
import bcrypt from "bcrypt";
import Iuser from "../interfaces/user";
import config from "../config";
import { getUserByEmail } from "./users";
import { Request, Response } from "express";
import { getAssignedPermission as getAssignedPermissionFromUserService } from "./users";
import { UnauthenticatedError } from "../error/unauthenticatedError";
import loggerWithNameSpace from "../utils/logger";

const logger = loggerWithNameSpace("Auth Services");

export async function login(
  req: Request,
  res: Response,
  body: Pick<Iuser, "email" | "password">
) {
  logger.info(`Checking for existing user with email ${body.email}`);
  const existingUser = await getUserByEmail(body.email);

  if (!existingUser) {
    logger.error(`User with email ${body.email} not found`);
    throw new UnauthenticatedError("Invalid Credentials");
  }
  const isValidPassword = await bcrypt.compare(
    body.password,
    existingUser.password
  );
  logger.info(
    `Checking if password is valid for the user with email ${body.email}`
  );
  if (!isValidPassword) {
    logger.error(`Password is not valid for the user with email ${body.email}`);
    throw new UnauthenticatedError("Invalid Credentials");
  }
  logger.info("Verification completed");
  logger.info("Generating Access Token and Refresh Token");

  const accessToken = sign(existingUser, config.jwt.secret!, {
    expiresIn: config.jwt.accessTokenExpiry,
  });
  const refreshToken = sign(existingUser, config.jwt.secret!, {
    expiresIn: config.jwt.refreshTokenExpiry,
  });
  logger.info("Generated Access Token and Refresh Token");
  return { accessToken: accessToken, refreshToken: refreshToken };
}

export async function refresh(
  req: Request,
  res: Response,
  authorization: string | undefined
) {
  logger.info(
    "Checking for authorization header for regenerating access token"
  );
  if (!authorization) {
    logger.error("Authorization header not found");
    throw new UnauthenticatedError("No Authorization Headers");
  }
  const token = authorization.split(" ");
  logger.info("Checking for refresh token for regenerating access token");
  if (token.length !== 2 || token[0] !== "Bearer") {
    logger.error("Refresh token not found");
    throw new UnauthenticatedError("No Bearer Token");
  }

  try {
    logger.info("Checking if refresh token is valid");
    const verifiedData = jwt.verify(token[1], config.jwt.secret!) as Iuser;
    if (verifiedData) {
      const accessToken = sign(verifiedData, config.jwt.secret!, {
        expiresIn: config.jwt.accessTokenExpiry,
      });
      logger.info("Refresh token validated");
      return accessToken;
    } else {
      logger.error("Refresh token invalid");
      throw new UnauthenticatedError("Invalid Token");
    }
  } catch {
    logger.error("Refresh token could not be verified");
    throw new UnauthenticatedError("Token Verification Error");
  }
}

export async function getAssignedPermission(userId: string) {
  logger.info(`Getting assigned permissions for user with userId ${userId}`);
  const permissions = await getAssignedPermissionFromUserService(userId);
  return permissions;
}
