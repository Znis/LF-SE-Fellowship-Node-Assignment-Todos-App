import express from "express";
import todosRouter from "./todos";
import usersRouter from "./users";
import authRouter from "./auth";
import { auth } from "../middleware/auth";

const router = express();

router.use("/todos", auth, todosRouter);
router.use("/users", usersRouter);
router.use("/auth", authRouter);

export default router;