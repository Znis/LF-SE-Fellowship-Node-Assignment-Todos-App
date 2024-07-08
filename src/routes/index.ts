import express from "express";
import todosRouter from "./todos";

const router = express();

router.use("/todos", todosRouter);

export default router;