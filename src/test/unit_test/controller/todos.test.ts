import sinon from "sinon";
import expect from "expect";
import * as TodosController from "../../../controller/todos";
import TodosServices from "../../../services/todos";

describe("Todos Controller Test Suite", () => {
  let req, res, next;
  let todo = {
    title: "dummy",
    description: "dummydummy",
    dueDate: "2001-01-01",
    completed: false,
    priority: "Medium",
    category: "Sports",
  };

  describe("getTodos", () => {
    let todosServiceGetTodosStub;
    beforeEach(() => {
      todosServiceGetTodosStub = sinon.stub(TodosServices, "getTodos");
      req = {
        body: { ...todo },
        user: {
          id: "1",
          name: "dummy",
          email: "dummy@dummy.com",
          password: "dummy",
        },
      };
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      next = sinon.stub();
    });
    afterEach(() => {
      sinon.restore();
    });
    it("should not call the next function if the getTodos is successful", async () => {
      todosServiceGetTodosStub.resolves({meta:{}, data: [todo, todo]});

      await TodosController.getTodos(req, res, next);

      expect(next.called).toBe(false);
    });
  });

  describe("createTodos", () => {
    let todosServiceCreateTodosStub;
    beforeEach(() => {
      todosServiceCreateTodosStub = sinon.stub(TodosServices, "createTodos");
      req = {
        body: { ...todo },
        user: {
          id: "1",
          name: "dummy",
          email: "dummy@dummy.com",
          password: "dummy",
        },
      };
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      next = sinon.stub();
    });
    afterEach(() => {
      todosServiceCreateTodosStub.restore();
      sinon.restore();
    });
    it("should not call the next function if the createTodos is successful", async () => {
      todosServiceCreateTodosStub.resolves(todo);

      await TodosController.createTodos(req, res, next);

      expect(next.called).toBe(false);
    });
    it("should call the next function if the createTodos is failed", async () => {
      todosServiceCreateTodosStub.rejects(new Error("Failed to create Todos"));

      await TodosController.createTodos(req, res, next);

      expect(next.called).toBe(true);
    });
  });
  describe("updateTodos", () => {
    let todosServiceUpdateTodosStub;
    beforeEach(() => {
      todosServiceUpdateTodosStub = sinon.stub(TodosServices, "updateTodos");
      req = {
        query: { id: "1" },
        body: { ...todo },
        user: {
          id: "1",
          name: "dummy",
          email: "dummy@dummy.com",
          password: "dummy",
        },
      };
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      next = sinon.stub();
    });
    afterEach(() => {
      todosServiceUpdateTodosStub.restore();
      sinon.restore();
    });
    it("should not call the next function if the updateTodos is successful", async () => {
      todosServiceUpdateTodosStub.resolves(todo);

      await TodosController.updateTodos(req, res, next);

      expect(next.called).toBe(false);
    });
    it("should call the next function if the updateTodos is failed", async () => {
      todosServiceUpdateTodosStub.rejects(new Error("Failed to update Todos"));

      await TodosController.updateTodos(req, res, next);

      expect(next.called).toBe(true);
    });
  });
  describe("deleteTodos", () => {
    let todosServiceDeleteTodosStub;
    beforeEach(() => {
      todosServiceDeleteTodosStub = sinon.stub(TodosServices, "deleteTodos");
      req = {
        query: { id: "1" },
        body: { ...todo },
        user: {
          id: "1",
          name: "dummy",
          email: "dummy@dummy.com",
          password: "dummy",
        },
      };
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      next = sinon.stub();
    });
    afterEach(() => {
      todosServiceDeleteTodosStub.restore();
      sinon.restore();
    });
    it("should not call the next function if the deleteTodos is successful", async () => {
      todosServiceDeleteTodosStub.resolves(todo);

      await TodosController.deleteTodos(req, res, next);

      expect(next.called).toBe(false);
    });
    it("should call the next function if the deleteTodos is failed", async () => {
      todosServiceDeleteTodosStub.rejects(new Error("Failed to delete Todos"));

      await TodosController.deleteTodos(req, res, next);

      expect(next.called).toBe(true);
    });
  });
});
