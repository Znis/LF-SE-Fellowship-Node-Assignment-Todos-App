import express from "express";
import todosRouter from "./todos";
import usersRouter from "./users";

const router = express();

router.use("/todos", todosRouter);
router.use("/", usersRouter);

export default router;