import express from "express";
import { createTodos, deleteTodos, getTodos, updateTodos } from "../controller/todos";

const todosRouter = express();

todosRouter.get("/", getTodos);

todosRouter.post("/", createTodos);

todosRouter.put("/:id", updateTodos);
 
todosRouter.delete("/:id", deleteTodos);

export default todosRouter;