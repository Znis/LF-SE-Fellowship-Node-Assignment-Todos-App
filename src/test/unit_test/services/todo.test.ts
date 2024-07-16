import { Itodos } from "../../../interfaces/todos";
import TodosService from "../../../services/todos";
import TodosModel from "../../../model/todos";
import expect from "expect";
import sinon from "sinon";

describe("Todos Service Test Suite", () => {
  const todosModel = TodosModel;
  let todo: Itodos = {
    title: "dummy",
    description: "dummydummy",
    dueDate: "2001-01-01",
    completed: false,
    priority: "Medium",
    category: "Sports",
  };
  describe("getTodos", () => {
    let todosModelGetTodosStub;
    beforeEach(() => {
      todosModelGetTodosStub = sinon.stub(todosModel, "getTodos");
    });
    afterEach(() => {
      sinon.restore();
    });
    it("should return todos when the todos are available for the user", async () => {
      todosModelGetTodosStub.resolves([todo, todo]);
      const id = "1";
      const filter = {size:10, page:1};
      const mResponse = [todo, todo];
      const result = await TodosService.getTodos(filter,id);

      expect(result.data).toStrictEqual(mResponse);
    });
    it("should return empty array when the todos are not available for the user", async () => {
      todosModelGetTodosStub.resolves([]);
      const id = "1";
      const filter = {size:10, page:1};
      const mResponse = [];
      const result = await TodosService.getTodos(filter,id);

      expect(result.data).toStrictEqual(mResponse);
    });
  });
  describe("createTodos", () => {
    let todosModelCreateTodosStub;
    beforeEach(() => {
      todosModelCreateTodosStub = sinon.stub(todosModel, "createTodos");
    });
    afterEach(() => {
      sinon.restore();
    });
    it("should create todo for the user", async () => {
      todosModelCreateTodosStub.resolves({
        modelResponseCode: 200,
        queryResult: todo,
      });
      const id = "1";
      const mResponse = todo;
      const result = await TodosService.createTodos(id, todo);

      expect(result).toStrictEqual(mResponse);
    });
    it("should throw an error if the model response code is not 200", async () => {
      todosModelCreateTodosStub.resolves({
        modelResponseCode: 400,
        queryResult: null,
      });
      const id = "1";
      try {
        await TodosService.createTodos(id, todo);
        throw new Error("Expected method to throw.");
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe("Could not create Todo");
      }
    });
  });
  describe("createTodos", () => {
    let todosModelUpdateTodosStub;
    beforeEach(() => {
      todosModelUpdateTodosStub = sinon.stub(todosModel, "updateTodosById");
    });
    afterEach(() => {
      sinon.restore();
    });
    it("should update todo for the user", async () => {
      todosModelUpdateTodosStub.resolves({
        modelResponseCode: 200,
        queryResult: todo,
      });
      const id = "1";
      const todoId = "1";
      const mResponse = todo;
      const result = await TodosService.updateTodos(id, todoId, todo);

      expect(result).toStrictEqual(mResponse);
    });
    it("should throw an forbidden error if the todo does not belong to the user", async () => {
      todosModelUpdateTodosStub.resolves({
        modelResponseCode: 403,
        queryResult: null,
      });
      const id = "1";
      const todoId = "1";
      try {
        await TodosService.updateTodos(id, todoId, todo);
        throw new Error("Expected method to throw.");
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe("Forbidden");
      }
    });
    it("should throw an error if the model response code is not 200", async () => {
      todosModelUpdateTodosStub.resolves({
        modelResponseCode: 400,
        queryResult: null,
      });
      const id = "1";
      const todoId = "1";
      try {
        await TodosService.updateTodos(id, todoId, todo);
        throw new Error("Expected method to throw.");
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe("Could not update Todo");
      }
    });
  });
  describe("deleteTodos", () => {
    let todosModelDeleteTodosStub;
    beforeEach(() => {
      todosModelDeleteTodosStub = sinon.stub(todosModel, "deleteTodosById");
    });
    afterEach(() => {
      sinon.restore();
    });
    it("should delete todo for the user", async () => {
      todosModelDeleteTodosStub.resolves({
        modelResponseCode: 200,
        queryResult: true,
      });
      const id = "1";
      const todoId = "1";
      const mResponse = true;
      const result = await TodosService.deleteTodos(id, todoId);

      expect(result).toStrictEqual(mResponse);
    });
    it("should throw an forbidden error if the todo does not belong to the user", async () => {
      todosModelDeleteTodosStub.resolves({
        modelResponseCode: 403,
        queryResult: false,
      });
      const id = "1";
      const todoId = "1";
      try {
        await TodosService.deleteTodos(id, todoId);
        throw new Error("Expected method to throw.");
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe("Forbidden");
      }
    });
    it("should throw an error if the model response code is not 200", async () => {
      todosModelDeleteTodosStub.resolves({
        modelResponseCode: 400,
        queryResult: false,
      });
      const id = "1";
      const todoId = "1";
      try {
        await TodosService.deleteTodos(id, todoId);
        throw new Error("Expected method to throw.");
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe("Could not delete Todo");
      }
    });
  });
});
