import sinon from "sinon";
import expect from "expect";
import * as UserController from "../../../controller/users";
import UserServices from "../../../services/users";
import { Iuser } from "../../../interfaces/user";

describe("Users Controller Test Suite", () => {
  let req, res, next;
  let user: Iuser = {
    id: "1",
    name: "dummy",
    email: "dummy@dummy.com",
    password: "dummy",
  };
  const userServices = UserServices;

  describe("getUserByEmail", () => {
    let userServiceGetUserByEmailStub;
    beforeEach(() => {
      userServiceGetUserByEmailStub = sinon.stub(
        userServices,
        "getUserByEmail"
      );
      req = {
        body: { ...user },
      };
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      next = sinon.stub();
    });
    afterEach(() => {
      userServiceGetUserByEmailStub.restore();
      sinon.restore();
    });
    it("should not call the next function if the getUserByEmail is successful", async () => {
      userServiceGetUserByEmailStub.resolves(user);

      await UserController.getUserByEmail(req, res, next);

      expect(next.called).toBe(false);
    });

    it("should call the next function if the getUserByEmail returns null or fails", async () => {
      userServiceGetUserByEmailStub.resolves(null);

      await UserController.getUserByEmail(req, res, next);

      expect(next.called).toBe(true);
    });
  });

  describe("createUser", () => {
    let usersServiceCreateUserStub;
    beforeEach(() => {
      usersServiceCreateUserStub = sinon.stub(userServices, "createUser");
      req = {
        body: { ...user },
      };
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      next = sinon.stub();
    });
    afterEach(() => {
      usersServiceCreateUserStub.restore();
      sinon.restore();
    });
    it("should not call the next function if the createUser is successful", async () => {
      usersServiceCreateUserStub.resolves(user);

      await UserController.createUser(req, res, next);

      expect(next.called).toBe(false);
    });
    it("should call the next function if the createTodos is failed", async () => {
      usersServiceCreateUserStub.rejects(new Error("Failed to create User"));

      await UserController.createUser(req, res, next);

      expect(next.called).toBe(true);
    });
  });
  describe("editUser", () => {
    let usersServiceEditUserStub;
    beforeEach(() => {
      usersServiceEditUserStub = sinon.stub(userServices, "editUser");
      req = {
        params: { id: "1" },
        body: { ...user },
      };
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      next = sinon.stub();
    });
    afterEach(() => {
      usersServiceEditUserStub.restore();
      sinon.restore();
    });
    it("should not call the next function if the editUser is successful", async () => {
      usersServiceEditUserStub.resolves(user);

      await UserController.editUser(req, res, next);

      expect(next.called).toBe(false);
    });
    it("should call the next function if the editUser is failed", async () => {
      usersServiceEditUserStub.rejects(new Error("Failed to edit User"));

      await UserController.editUser(req, res, next);

      expect(next.called).toBe(true);
    });
  });
  describe("deleteUser", () => {
    let userServiceDeleteUserStub;
    beforeEach(() => {
      userServiceDeleteUserStub = sinon.stub(userServices, "deleteUser");
      req = {
        params: { id: "1" },
        body: { ...user },
      };
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      next = sinon.stub();
    });
    afterEach(() => {
      userServiceDeleteUserStub.restore();
      sinon.restore();
    });
    it("should not call the next function if the deleteUser is successful", async () => {
      userServiceDeleteUserStub.resolves(true);

      await UserController.deleteUser(req, res, next);

      expect(next.called).toBe(false);
    });
    it("should call the next function if the deleteUser is failed", async () => {
      userServiceDeleteUserStub.rejects(new Error("Failed to delete user"));

      await UserController.deleteUser(req, res, next);

      expect(next.called).toBe(true);
    });
  });
});
