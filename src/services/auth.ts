import jwt, { JwtPayload, sign } from "jsonwebtoken";
import bcrypt from "bcrypt";
import Iuser from "../interfaces/user";
import config from "../config";
import { getUserByEmail } from "./users";
import { Request, Response } from "express";

interface CustomJwtPayload extends JwtPayload {
  id: string;
  name: string;
  email: string;
}

export async function login(
  req: Request,
  res: Response,
  body: Pick<Iuser, "email" | "password">
) {
  const existingUser = await getUserByEmail(body.email);

  if (!existingUser!.length) {
    return res.status(401).json({ error: "Invalid Credentials" });
  }
  const isValidPassword = await bcrypt.compare(
    body.password,
    existingUser![0].password
  );
  if (!isValidPassword) {
    return res.status(401).json({ error: "Invalid Credentials" });
  }


  const accessToken = sign(existingUser![0], config.jwt.secret!, {
    expiresIn: config.jwt.accessTokenExpiry,
  });
  const refreshToken = sign(existingUser![0], config.jwt.secret!, {
    expiresIn: config.jwt.refreshTokenExpiry,
  });
  return res
    .status(200)
    .json({ accessToken: accessToken, refreshToken: refreshToken });
}

export async function refresh(
  req: Request,
  res: Response,
  authorization: string | undefined
) {
  if (!authorization) {
    return res.json({ error: "Authentication Failed", status: 401 });
  }
  const token = authorization.split(" ");
  if (token.length !== 2 || token[0] !== "Bearer") {
    return res.json({ error: "Authentication Failed", status: 401 });
  }

  try {
    const verifiedData = jwt.verify(
      token[1],
      config.jwt.secret!
    ) as CustomJwtPayload;
    if (verifiedData) {
      const payload = {
        id: verifiedData.id,
        name: verifiedData.name,
        email: verifiedData.email,
      };

      const accessToken = sign(payload, config.jwt.secret!, {
        expiresIn: config.jwt.accessTokenExpiry,
      });
      return res.json({ error: "", status: 200, data: accessToken });
    } else {
      return res.json({ error: "Invalid Token", status: 401 });
    }
  } catch {
    return res.json({ error: "Invalid Token", status: 401 });
  }
}
