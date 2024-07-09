import express from "express";
import { createTodos, deleteTodos, getTodos, updateTodos } from "../controller/todos";


const todosRouter = express();

todosRouter.post("/", getTodos);

todosRouter.post("/create", createTodos);

todosRouter.put("/update/:id", updateTodos);
 
todosRouter.delete("/delete/:id", deleteTodos);

export default todosRouter;