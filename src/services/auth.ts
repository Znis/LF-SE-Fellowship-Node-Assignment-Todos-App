import jwt, { sign } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Iuser } from "../interfaces/user";
import config from "../config";
import { UnauthenticatedError } from "../error/unauthenticatedError";
import loggerWithNameSpace from "../utils/logger";
import UserServices from "./users";

const logger = loggerWithNameSpace("Auth Services");

export default class AuthServices {
  static async login(body: Pick<Iuser, "email" | "password">) {
    logger.info(`Checking for existing user with email ${body.email}`);
    const existingUser = await UserServices.getUserByEmail(body.email);

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
      logger.error(
        `Password is not valid for the user with email ${body.email}`
      );
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

  static async refresh(authorization: string | undefined) {
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

    logger.info("Checking if refresh token is valid");
    const verifiedData = jwt.verify(token[1], config.jwt.secret!) as Iuser;
    if (!verifiedData) {
      logger.error("Refresh token invalid");
      throw new UnauthenticatedError("Invalid Token");
    }

    const payload = {
      id: verifiedData.id,
      name: verifiedData.name,
      email: verifiedData.email,
      password: verifiedData.password,
    };
    const accessToken = sign(payload, config.jwt.secret!, {
      expiresIn: config.jwt.accessTokenExpiry,
    });

    logger.info("Refresh token validated");
    return accessToken;
  }

  static async getAssignedPermission(userId: string) {
    logger.info(`Getting assigned permissions for user with userId ${userId}`);
    const permissions = await UserServices.getAssignedPermission(userId);
    return permissions;
  }
}
