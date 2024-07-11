import HttpStatusCode from 'http-status-codes';
import jwt, {sign } from "jsonwebtoken";
import bcrypt from "bcrypt";
import Iuser from "../interfaces/user";
import config from "../config";
import { getUserByEmail } from "./users";
import { Request, Response } from "express";
import { getAssignedPermission as getAssignedPermissionFromUserService } from "./users";
import { UnauthenticatedError } from '../../error/unauthenticatedError';

export async function login(
  req: Request,
  res: Response,
  body: Pick<Iuser, "email" | "password">
) {
  const existingUser = await getUserByEmail(body.email);

  if (!existingUser) {
    throw new UnauthenticatedError("Invalid Credentials");


  }
  const isValidPassword = await bcrypt.compare(
    body.password,
    existingUser.password
  );
  if (!isValidPassword) {
    throw new UnauthenticatedError("Invalid Credentials");



  }

  const accessToken = sign(existingUser, config.jwt.secret!, {
    expiresIn: config.jwt.accessTokenExpiry,
  });
  const refreshToken = sign(existingUser, config.jwt.secret!, {
    expiresIn: config.jwt.refreshTokenExpiry,
  });
  return { accessToken: accessToken, refreshToken: refreshToken };

}

export async function refresh(
  req: Request,
  res: Response,
  authorization: string | undefined
) {
  if (!authorization) {
    throw new UnauthenticatedError("No Authorization Headers");

  }
  const token = authorization.split(" ");
  if (token.length !== 2 || token[0] !== "Bearer") {
    throw new UnauthenticatedError("No Bearer Token");



  }

  try {
    const verifiedData = jwt.verify(
      token[1],
      config.jwt.secret!
    ) as Iuser;
    if (verifiedData) {


      const accessToken = sign(verifiedData, config.jwt.secret!, {
        expiresIn: config.jwt.accessTokenExpiry,
      });
      return accessToken;


    } else {
          throw new UnauthenticatedError("Invalid Token");


    }
  } catch {
    throw new UnauthenticatedError("Token Verification Error");
    

  }
}

export async function getAssignedPermission(userId: string){
const permissions = await getAssignedPermissionFromUserService(userId);
return permissions;
}

