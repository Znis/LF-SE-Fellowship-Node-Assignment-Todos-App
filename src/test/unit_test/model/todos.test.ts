import expect from "expect";
import sinon from "sinon";
import proxyquire from "proxyquire";
import Itodos from "../../../interfaces/todos";
import * as TodosModel from "../../../model/todos";

describe("Todos Model Test Suite", () => {
  describe("getTodos", () => {
    let knexStub = {
      select: sinon.stub().returnsThis(),
      from: sinon.stub().returnsThis(),
      where: sinon.stub().resolves([]),
    };

    let { getTodos } = proxyquire.noCallThru()("../../../model/todos", {
      knex: () => knexStub,
    });

    afterEach(() => {
      sinon.restore();
    });

    it("should return array of Todos if found", async () => {
      knexStub.where.resolves([{ todoId: 1 }, { todoId: 2 }]);
      const userId = "1";
      const mResponse = [{ todoId: 1 }, { todoId: 2 }];
      const result = await getTodos(userId);

      expect(result).toStrictEqual(mResponse);
    });

    it("should return empty array if no any Todos found", async () => {
      knexStub.where.resolves([]);
      const userId = "1";
      const mResponse = [];

      const result = await getTodos(userId);

      expect(result).toStrictEqual(mResponse);
    });

    it("should return null if database error", async () => {
      const error = new Error("Database error");
      knexStub.where.rejects(error);
      const userId = "1";
      const result = await getTodos(userId);

      expect(result).toBe(null);
    });
  });
  describe("createTodos", () => {
    let knexStub = {
      insert: sinon.stub().returnsThis(),
      into: sinon.stub().resolves(),
    };
    const todo: Itodos = {
      title: "dummy",
      description: "dummydummy",
      dueDate: "2001-01-01",
      completed: false,
      priority: "Medium",
      category: "Sports",
    };
    const userId = "1";

    let { createTodos } = proxyquire.noCallThru()("../../../model/todos", {
      knex: () => knexStub,
    });

    afterEach(() => {
      sinon.restore();
    });

    it("should insert a new user and return success response", async () => {
      const mResponse = { modelResponseCode: 200, queryResult: todo };
      knexStub.into.resolves(1);
      const result = await createTodos(userId,todo);
      expect(knexStub.insert.calledOnceWithExactly({...todo, user_id: userId})).toBeTruthy;
      expect(result).toStrictEqual(mResponse);
    });

    it("should return an error response if insertion fails", async () => {
      knexStub.into.rejects(new Error("Insertion error"));
      knexStub.into.resolves(0);

      const result = await createTodos(userId,todo);

      expect(result).toStrictEqual({
        modelResponseCode: 400,
        queryResult: null,
      });
    });
  });
//   describe("updateTodosById", () => {

//     let knexStub = {
//       update: sinon.stub().returnsThis(),
//       from: sinon.stub().returnsThis(),
//       where: sinon.stub().resolves()
//     };
//     let checkTodoOwnershipStub = {
//         select: sinon.stub().returnsThis(),
//         from: sinon.stub().returnsThis(),
//         where: sinon.stub().resolves()
//       };




//     const todo: Itodos = {
//       title: "dummy",
//       description: "dummydummy",
//       dueDate: "2001-01-01",
//       completed: false,
//       priority: "Medium",
//       category: "Sports",
//     };
//     const userId = "1";
//     const id = "1";

//     let { updateTodosById } = proxyquire.noCallThru()("../../../model/todos", {
//       knex: () => knexStub,
//     });

//     afterEach(() => {
//       sinon.restore();
//     });

//     it("should return 403 if todo ownership cannot be verified", async () => {
//         checkTodoOwnershipStub.where.resolves([]);
    
//         const result = await updateTodosById(userId, id, todo);
    
//         expect(result).toStrictEqual({
//           modelResponseCode: 403,
//           queryResult: null,
//         });
//       });
    
//       it("should return 200 and updated todo object when update is successful", async () => {
//         checkTodoOwnershipStub.where.resolves([{userId: id}]);
//         knexStub.where.resolves(1);

    
//         const result = await updateTodosById(userId, id, todo);
    
//         expect(knexStub.where.calledWith("id", id)).toBeTruthy;
//         expect(knexStub.update.calledWith({
//           title: todo.title,
//           description: todo.description,
//           completed: todo.completed,
//           dueDate: todo.dueDate,
//           priority: todo.priority,
//           category: todo.category,
//           user_id: userId,
//         })).toBeTruthy;
//         expect(result).toStrictEqual({
//           modelResponseCode: 200,
//           queryResult: todo,
//         });
//       });
    
//       it("should return 400 if update fails", async () => {
//         checkTodoOwnershipStub.where.resolves([{userId: id}]);
//         knexStub.where.resolves(0);
    
//         const result = await updateTodosById(userId, id, todo);
    
//         expect(knexStub.where.calledWith("id", id)).toBeTruthy;
//         expect(knexStub.update.calledWith({
//           title: todo.title,
//           description: todo.description,
//           completed: todo.completed,
//           dueDate: todo.dueDate,
//           priority: todo.priority,
//           category: todo.category,
//           user_id: userId,
//         })).toBeTruthy;
//         expect(result).toStrictEqual({
//           modelResponseCode: 400,
//           queryResult: null,
//         });
//       });
    
//       it("should return 400 if there is a database error", async () => {
//         checkTodoOwnershipStub.where.resolves([{userId: id}]);
//         knexStub.where.rejects(new Error("Database error"));

//         const result = await updateTodosById(userId, id, todo);
    
//         expect(knexStub.where.calledWith("id", id)).toBeTruthy;
//         expect(knexStub.update.calledWith({
//           title: todo.title,
//           description: todo.description,
//           completed: todo.completed,
//           dueDate: todo.dueDate,
//           priority: todo.priority,
//           category: todo.category,
//           user_id: userId,
//         })).toBeTruthy;
//         expect(result).toStrictEqual({
//           modelResponseCode: 400,
//           queryResult: null,
//         });
//       });
//   });
describe("checkTodoOwnership", () => {
    let knexStub = {
      select: sinon.stub().returnsThis(),
      from: sinon.stub().returnsThis(),
      where: sinon.stub().resolves(),
    };

    let { checkTodoOwnership } = proxyquire.noCallThru()("../../../model/todos", {
      knex: () => knexStub,
    });

    afterEach(() => {
      sinon.restore();
    });

    it("should return true if todo belongs to the userId", async () => {
      knexStub.where.resolves([{user_id: 1}]);
      const userId = "1";
      const id = "1";
      const result = await checkTodoOwnership(userId, id);

      expect(result).toStrictEqual(true);
    });

    it("should return false if todo does not belong to the userId", async () => {
      knexStub.where.resolves([{user_id: 2}]);
      const userId = "1";
      const id = "1";

      const result = await checkTodoOwnership(userId,id);

      expect(result).toStrictEqual(false);
    });

    it("should return null if database error", async () => {
      const error = new Error("Database error");
      knexStub.where.rejects(error);
      const userId = "1";
      const id = "1";
      const result = await checkTodoOwnership(userId, id);

      expect(result).toBe(false);
    });
  });
});
