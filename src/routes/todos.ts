import express from "express";
import { createTodos, deleteTodos, getTodos, updateTodos } from "../controller/todos";
import { authorize } from "../middleware/auth";
import { permissions } from "../enums/users";


const todosRouter = express();

todosRouter.post("/", authorize(permissions.view_todo), getTodos);

todosRouter.post("/create", authorize(permissions.create_todo), createTodos);

todosRouter.put("/update/:id", authorize(permissions.update_todo), updateTodos);
 
todosRouter.delete("/delete/:id", authorize(permissions.delete_todo), deleteTodos);

export default todosRouter;