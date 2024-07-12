import express from "express";
import todosRouter from "./todos";
import usersRouter from "./users";
import authRouter from "./auth";

const router = express();

router.use("/todos", todosRouter);
router.use("/users", usersRouter);
router.use("/auth", authRouter);

export default router;
