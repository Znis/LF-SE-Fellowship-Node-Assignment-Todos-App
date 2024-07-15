import expect from "expect";
import sinon from "sinon";
import proxyquire from "proxyquire";
import Iuser from "../../../interfaces/user";

describe("User Model Test Suite", () => {
  describe("getUserByEmail", () => {
    let knexStub = {
      select: sinon.stub().returnsThis(),
      from: sinon.stub().returnsThis(),
      where: sinon.stub().resolves([]),
    };

    let { default: UserModel } = proxyquire.noCallThru()(
      "../../../model/users",
      {
        knex: () => knexStub,
      }
    );
    let userModel = new UserModel();

    afterEach(() => {
      sinon.restore();
    });

    it("should return null if no user is found", async () => {
      knexStub.where.resolves([]);
      const result = await userModel.getUserByEmail("nonexistent@example.com");

      expect(result).toBeNull;
    });

    it("should return the user if found", async () => {
      const userModel = new UserModel();

      const mockUser = { id: 1, email: "test@example.com", name: "Test User" };
      knexStub.where.resolves([mockUser]);

      const result = await userModel.getUserByEmail("test@example.com");

      expect(result).toStrictEqual(mockUser);
    });

    it("should handle errors", async () => {
      const error = new Error("Database error");
      knexStub.where.rejects(error);

      const result = await userModel.getUserByEmail("error@example.com");

      expect(result).toBe(null);
    });
  });
  describe("createUser", () => {
    let knexStub = {
      insert: sinon.stub().returnsThis(),
      into: sinon.stub().resolves(),
    };
    let { default: UserModel } = proxyquire.noCallThru()(
      "../../../model/users",
      {
        knex: () => knexStub,
      }
    );
    let userModel = new UserModel();

    const user: Iuser = {
      name: "dummy",
      email: "dummy@dummy.com",
      password: "hashedPassword",
    };

    afterEach(() => {
      sinon.restore();
    });

    it("should insert a new user and return success response", async () => {
      knexStub.into.resolves(1);

      const mResponse = { modelResponseCode: 200, queryResult: user };
      const result = await userModel.createUser(user);
      expect(knexStub.insert.calledOnceWithExactly(user)).toBeTruthy;
      expect(result).toStrictEqual(mResponse);
    });

    it("should return an error response if insertion fails", async () => {
      knexStub.into.rejects(new Error("Insertion error"));

      const result = await userModel.createUser(user);

      expect(result).toStrictEqual({
        modelResponseCode: 400,
        queryResult: null,
      });
    });
  });
  describe("assignRole", () => {
    let knexStub = {
      insert: sinon.stub().returnsThis(),
      into: sinon.stub(),
    };
    let { default: UserModel } = proxyquire.noCallThru()(
      "../../../model/users",
      {
        knex: () => knexStub,
      }
    );
    let userModel = new UserModel();
    afterEach(() => {
      sinon.restore();
    });

    it("should assign a role to a user and return success response", async () => {
      const userId = "1";
      const role = "admin";
      const data = {
        user_id: userId,
        role_id: role,
      };

      knexStub.into.resolves(data);

      const result = await userModel.assignRole(userId, role);
      expect(result).toStrictEqual({
        modelResponseCode: 200,
        queryResult: { role_id: "admin", user_id: "1" },
      });
    });

    it("should return an error response if role assignment fails", async () => {
      knexStub.into.rejects(new Error("Insertion Error"));

      const userId = "1";
      const role = "admin";

      const result = await userModel.assignRole(userId, role);

      expect(result).toStrictEqual({
        modelResponseCode: 400,
        queryResult: null,
      });
    });
  });
  describe("editUserById", () => {
    let knexStub = {
      update: sinon.stub().returnsThis(),
      from: sinon.stub().returnsThis(),
      where: sinon.stub(),
    };
    let { default: UserModel } = proxyquire.noCallThru()(
      "../../../model/users",
      {
        knex: () => knexStub,
      }
    );
    let userModel = new UserModel();

    afterEach(() => {
      sinon.restore();
    });

    it("should edit a user by id and return success response", async () => {
      const id = "2";
      const user: Iuser = {
        name: "John Doe",
        email: "john.doe@example.com",
        password: "hashedPassword",
      };
      const mResponse = { modelResponseCode: 200, queryResult: user };
      knexStub.where.resolves(1);

      const result = await userModel.editUserById(id, user);

      expect(knexStub.where.calledOnceWithExactly("id", id));
      expect(
        knexStub.update.calledOnceWithExactly({
          name: user.name,
          email: user.email,
          password: user.password,
        })
      );
      expect(result).toStrictEqual(mResponse);
    });

    it("should return an error response if editing user fails", async () => {
      const id = "4";
      const user: Iuser = {
        name: "Non existent",
        email: "non.existent@example.com",
        password: "hashedPassword",
      };
      const mResponse = { modelResponseCode: 400, queryResult: null };

      knexStub.where.resolves(0);

      const result = await userModel.editUserById(id, user);

      expect(knexStub.where.calledOnceWithExactly("id", id));
      expect(
        knexStub.update.calledOnceWithExactly({
          name: user.name,
          email: user.email,
          password: user.password,
        })
      );

      expect(result).toStrictEqual(mResponse);
    });

    it("should return an error response if an exception occurs", async () => {
      const id = "4";
      const user: Iuser = {
        name: "Non existent",
        email: "non.existent@example.com",
        password: "hashedPassword",
      };
      const mResponse = { modelResponseCode: 400, queryResult: null };

      knexStub.where.throws(new Error("Database error"));

      const result = await userModel.editUserById(id, user);

      expect(knexStub.where.calledOnceWithExactly("id", id));
      expect(
        knexStub.update.calledOnceWithExactly({
          name: user.name,
          email: user.email,
          password: user.password,
        })
      );

      expect(result).toStrictEqual(mResponse);
    });
  });
  describe("deleteUserById", () => {
    let knexStub = {
      del: sinon.stub().returnsThis(),
      from: sinon.stub().returnsThis(),
      where: sinon.stub(),
    };
    let { default: UserModel } = proxyquire.noCallThru()(
      "../../../model/users",
      {
        knex: () => knexStub,
      }
    );
    let userModel = new UserModel();
    afterEach(() => {
      sinon.restore();
    });

    it("should return 200 and true when user is deleted successfully", async () => {
      knexStub.where.resolves(1);

      const result = await userModel.deleteUserById("1");

      expect(knexStub.where.calledWith("id", "1")).toBeTruthy;
      expect(result).toStrictEqual({
        modelResponseCode: 200,
        queryResult: true,
      });
    });

    it("should return 400 and false when user deletion fails", async () => {
      knexStub.where.resolves(0);

      const result = await userModel.deleteUserById("1");

      expect(knexStub.where.calledWith("id", "1")).toBeTruthy;
      expect(result).toStrictEqual({
        modelResponseCode: 400,
        queryResult: false,
      });
    });

    it("should return 400 and false when there is an exception", async () => {
      knexStub.where.rejects(new Error("Database Error"));

      const result = await userModel.deleteUserById("1");

      expect(knexStub.where.calledWith("id", "1")).toBeTruthy;
      expect(result).toStrictEqual({
        modelResponseCode: 400,
        queryResult: false,
      });
    });
  });
  describe("getRoleId", () => {
    let knexStub = {
      select: sinon.stub().returnsThis(),
      from: sinon.stub().returnsThis(),
      where: sinon.stub(),
    };
    let { default: UserModel } = proxyquire.noCallThru()(
      "../../../model/users",
      {
        knex: () => knexStub,
      }
    );
    let userModel = new UserModel();
    afterEach(() => {
      sinon.restore();
    });

    it("should return roleId when userId is found", async () => {
      const role_id = "1";
      knexStub.where.resolves([{ role_id }]);

      const result = await userModel.getRoleId("1");

      expect(knexStub.select.calledWith("role_id")).toBeTruthy;
      expect(knexStub.from.calledWith("users_roles")).toBeTruthy;
      expect(knexStub.where.calledWith("user_id", "1")).toBeTruthy;
      expect(result).toStrictEqual(role_id);
    });

    it("should return null when userId is not found", async () => {
      knexStub.where.resolves([]);

      const result = await userModel.getRoleId("1");

      expect(knexStub.select.calledWith("role_id")).toBeTruthy;
      expect(knexStub.from.calledWith("users_roles")).toBeTruthy;
      expect(knexStub.where.calledWith("user_id", "1")).toBeTruthy;
      expect(result).toStrictEqual(null);
    });

    it("should return null when there is an exception", async () => {
      knexStub.where.rejects(new Error("Database Error"));

      const result = await userModel.getRoleId("1");

      expect(knexStub.select.calledWith("role_id")).toBeTruthy;
      expect(knexStub.from.calledWith("users_roles")).toBeTruthy;
      expect(knexStub.where.calledWith("user_id", "1")).toBeTruthy;
      expect(result).toStrictEqual(null);
    });
  });
  describe("getAssignedPermissionsForRole", () => {
    let knexStub = {
      select: sinon.stub().returnsThis(),
      from: sinon.stub().returnsThis(),
      where: sinon.stub(),
    };
    let { default: UserModel } = proxyquire.noCallThru()(
      "../../../model/users",
      {
        knex: () => knexStub,
      }
    );
    let userModel = new UserModel();

    afterEach(() => {
      sinon.restore();
    });

    it("should return permission when roleId is found", async () => {
      const mResponse = ["permission1", "permission2"];
      knexStub.where.resolves([
        { permissions: ["permission1", "permission2"] },
      ]);

      const result = await userModel.getAssignedPermissionsForRole("1");

      expect(knexStub.select.calledWith("role_id")).toBeTruthy;
      expect(knexStub.from.calledWith("users_roles")).toBeTruthy;
      expect(knexStub.where.calledWith("user_id", "1")).toBeTruthy;
      expect(result).toStrictEqual(mResponse);
    });

    it("should return null when roleId is not found", async () => {
      knexStub.where.resolves([]);

      const result = await userModel.getAssignedPermissionsForRole("1");

      expect(knexStub.select.calledWith("role_id")).toBeTruthy;
      expect(knexStub.from.calledWith("users_roles")).toBeTruthy;
      expect(knexStub.where.calledWith("user_id", "1")).toBeTruthy;
      expect(result).toStrictEqual(null);
    });

    it("should return null when there is an exception", async () => {
      knexStub.where.rejects(new Error("Database Error"));

      const result = await userModel.getAssignedPermissionsForRole("1");

      expect(knexStub.select.calledWith("role_id")).toBeTruthy;
      expect(knexStub.from.calledWith("users_roles")).toBeTruthy;
      expect(knexStub.where.calledWith("user_id", "1")).toBeTruthy;
      expect(result).toStrictEqual(null);
    });
  });
});
