import express from "express";
import { createUser, getUserId } from "../controller/users";


const usersRouter = express();

usersRouter.post("/login", getUserId);

usersRouter.post("/register", createUser);


export default usersRouter;