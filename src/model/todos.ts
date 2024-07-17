import { getTodosQueryParams, Itodos } from "../interfaces/todos";
import { BaseModel } from "./base";

export default class TodosModel extends BaseModel {
  static getCount(userId: string) {
    try {
      return this.queryBuilder()
        .count("*")
        .table("todos")
        .where("user_id", userId)
        .first();
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static getTodos(filter: getTodosQueryParams, userId: string) {
    try {
      return this.queryBuilder()
        .select("*")
        .from("todos")
        .limit(filter.size)
        .offset((filter.page - 1) * filter.size)
        .where("user_id", userId);
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static createTodos(userId: string, todos: Itodos) {
    try {
      return this.queryBuilder()
        .insert({
          title: todos.title,
          description: todos.description,
          completed: todos.completed,
          dueDate: todos.dueDate,
          priority: todos.priority,
          category: todos.category,
          user_id: userId,
        })
        .into("todos");
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  static updateTodosById(userId: string, id: string, todo: Itodos) {
    try {
      return this.queryBuilder()
        .update({
          title: todo.title,
          description: todo.description,
          completed: todo.completed,
          dueDate: todo.dueDate,
          priority: todo.priority,
          category: todo.category,
          user_id: userId,
        })
        .into("todos")
        .where("id", id);
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  static deleteTodosById(userId: string, id: string) {
    try {
      return this.queryBuilder()
        .del()
        .from("todos")
        .where("id", id)
        .andWhere("user_id", userId);
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static checkTodoOwnership(id: string) {
    try {
      return this.queryBuilder()
        .select("user_id")
        .from("todos")
        .where("id", id)
        .first();
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
