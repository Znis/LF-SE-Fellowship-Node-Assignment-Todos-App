import {Request, Response} from "express";
import * as AuthService from "../services/auth";

export async function login(req: Request, res: Response){
const {body} = req;
const authResponse = await AuthService.login(req, res, body)
return authResponse;
}

//function to generate a new accesstoken with the refreshtoken
export async function refresh(req: Request, res: Response){
    const {authorization} = req.headers;
    const authResponse = await AuthService.refresh(req, res, authorization)
    return authResponse;
    }

    