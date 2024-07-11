import  HttpStatusCode  from 'http-status-codes';
import {Request, Response} from "express";
import * as AuthService from "../services/auth";

export async function login(req: Request, res: Response){
const {body} = req;
const authResponse = await AuthService.login(req, res, body);
if(authResponse.error){
    next(authResponse.error);
    return;
}
res.status(HttpStatusCode.OK).json(authResponse);
}

//function to generate a new accesstoken with the refreshtoken
export async function refresh(req: Request, res: Response){
    const {authorization} = req.headers;
    const authResponse = await AuthService.refresh(req, res, authorization);
    res.status(HttpStatusCode.OK).json(authResponse);

    }

    