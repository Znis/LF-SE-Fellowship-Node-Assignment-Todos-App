import { Request as expressRequest } from "express";
import { Iuser } from "./user";

export interface Request extends expressRequest {
  user?: Iuser;
}
