import bcrypt from "bcrypt";
import { expect } from "expect";
import sinon from "sinon";
import Iuser from "../../../interfaces/user";
import UserServices from "../../../services/users";

describe("User Service Test Suite", () => {
  const userServices = new UserServices();

  let user: Iuser = {
    id: "1",
    name: "dummy",
    email: "dummy@dummy.com",
    password: "dummy",
  };
  describe("getUserByEmail", () => {
    let userModelGetUserByEmailStub: sinon.SinonStub;
    beforeEach(() => {
      userModelGetUserByEmailStub = sinon.stub(
        userServices.userModel,
        "getUserByEmail"
      );
    });
    afterEach(() => {
      userModelGetUserByEmailStub.restore();
    });

    it("Should return user when found", () => {
      userModelGetUserByEmailStub.resolves({
        id: "1",
        name: "dummy",
        email: "dummy@dummy.com",
        password: "hashedPassword",
      });
      expect(userServices.getUserByEmail("dummy@dummy.com")).resolves.toBe({
        id: "1",
        name: "dummy",
        email: "dummy@dummy.com",
        password: "hashedPassword",
      });
    });

    it("should return null if no user is found", async () => {
      const email = "nonexistent@example.com";

      userModelGetUserByEmailStub.resolves(null);

      const result = await userServices.getUserByEmail(email);

      expect(result).toBeNull;
    });
  });

  describe("createUser", () => {
    let bcryptHashStub: sinon.SinonStub;
    let userModelCreateUserStub: sinon.SinonStub;
    let getUserByEmailStub: sinon.SinonStub;
    let assignRoleStub: sinon.SinonStub;

    beforeEach(() => {
      bcryptHashStub = sinon.stub(bcrypt, "hash");
      userModelCreateUserStub = sinon.stub(
        userServices.userModel,
        "createUser"
      );

      getUserByEmailStub = sinon
        .stub(userServices, "getUserByEmail")
        .resolves({ ...user, password: "hashedPassword" });
    });

    afterEach(() => {
      bcryptHashStub.restore();
      userModelCreateUserStub.restore();
      getUserByEmailStub.restore();
      assignRoleStub.restore();
    });

    it("Should create new user", async () => {
      bcryptHashStub.resolves("hashedPassword");
      userModelCreateUserStub.resolves({
        modelResponseCode: 200,
        queryResult: { ...user, password: "hashedPassword" },
      });
      assignRoleStub = sinon.stub(userServices, "assignRole").resolves();
      // expect(bcryptHashStub.calledWith(user.password, sinon.match.any)).toBe(
      //   true
      // );
      // expect(userModelCreateUserStub.callCount).toBe(1);
      // expect(getUserByEmailStub.calledOnceWith(user.email)).toBe(true);

      const result = await userServices.createUser(user);
      expect(result).toStrictEqual({ ...user, password: "hashedPassword" });
    });
    it("should throw an error if createUser response code is not 200", async () => {
      const queryResult = { modelResponseCode: 400, queryResult: null };
      bcryptHashStub.resolves("hashedPassword");
      userModelCreateUserStub.resolves(queryResult);

      try {
        await userServices.createUser(user);
        throw new Error("Expected method to throw.");
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe("Could not create User");
      }
    });
  });
  describe("editUser", () => {
    let userModelEditUserStub;
    let bcryptHashStub;

    beforeEach(() => {
      bcryptHashStub = sinon.stub(bcrypt, "hash");
      userModelEditUserStub = sinon.stub(
        userServices.userModel,
        "editUserById"
      );
    });

    afterEach(() => {
      sinon.restore();
    });

    it("should edit a user and return the query result", async () => {
      const id = "1";
      const hashedPassword = "hashedpassword";
      const modelResult = {
        modelResponseCode: 200,
        queryResult: { ...user, password: hashedPassword },
      };
      bcryptHashStub.resolves(hashedPassword);
      userModelEditUserStub.resolves(modelResult);

      const result = await userServices.editUser(id, user);

      expect(result).toStrictEqual(modelResult.queryResult);
    });

    it("should throw an error if model response code is not 200", async () => {
      const id = "1";
      const hashedPassword = "hashedpassword";
      const modelResult = { modelResponseCode: 400, queryResult: null };

      bcryptHashStub.resolves(hashedPassword);
      userModelEditUserStub.resolves(modelResult);

      try {
        await userServices.editUser(id, user);
        throw new Error("Expected method to throw.");
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe("Could not edit User");
      }
    });
  });
  describe("deleteUser", () => {
    let userModelDeleteUserStub;

    beforeEach(() => {
      userModelDeleteUserStub = sinon.stub(
        userServices.userModel,
        "deleteUserById"
      );
    });

    afterEach(() => {
      sinon.restore();
    });

    it("should delete a user and return the query result", async () => {
      const id = "1";
      const modelResult = { modelResponseCode: 200, queryResult: true };
      userModelDeleteUserStub.resolves(modelResult);

      const result = await userServices.deleteUser(id);

      expect(result).toStrictEqual(modelResult.queryResult);
    });

    it("should throw an error if model response code is not 200", async () => {
      const id = "1";
      const modelResult = { modelResponseCode: 400, queryResult: false };
      userModelDeleteUserStub.resolves(modelResult);

      try {
        await userServices.deleteUser(id);
        throw new Error("Expected method to throw.");
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe("Could not delete User");
      }
    });
  });
  describe("assignRole", () => {
    let userModelAssignRoleStub;

    beforeEach(() => {
      userModelAssignRoleStub = sinon.stub(
        userServices.userModel,
        "assignRole"
      );
    });

    afterEach(() => {
      sinon.restore();
    });

    it("should assign role to a user and return the query result", async () => {
      const id = "1";
      const roleId = "1";
      const modelResult = {
        modelResponseCode: 200,
        queryResult: { user_id: id, role_id: roleId },
      };
      userModelAssignRoleStub.resolves(modelResult);

      const result = await userServices.assignRole(id, roleId);

      expect(result).toStrictEqual(modelResult.queryResult);
    });

    it("should throw an error if model response code is not 200", async () => {
      const id = "1";
      const roleId = "1";
      const modelResult = { modelResponseCode: 400, queryResult: null };
      userModelAssignRoleStub.resolves(modelResult);

      try {
        await userServices.assignRole(id, roleId);
        throw new Error("Expected method to throw.");
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe("Could not assign Role");
      }
    });
  });
  describe("getRoleId", () => {
    let userModelGetRoleIdStub;

    beforeEach(() => {
      userModelGetRoleIdStub = sinon.stub(userServices.userModel, "getRoleId");
    });

    afterEach(() => {
      sinon.restore();
    });

    it("should assign role to a user and return the query result", async () => {
      const id = "1";
      const roleId = "1";
      userModelGetRoleIdStub.resolves(roleId);

      const result = await userServices.getRoleId(id);

      expect(result).toStrictEqual(roleId);
    });
  });
  describe("getAssignedPermissionsForRole", () => {
    let userModelGetAssignedPermissionsForRoleStub;

    beforeEach(() => {
      userModelGetAssignedPermissionsForRoleStub = sinon.stub(
        userServices.userModel,
        "getAssignedPermissionsForRole"
      );
    });

    afterEach(() => {
      sinon.restore();
    });

    it("should get assigned permissions for the role and return the query result", async () => {
      const roleId = "1";
      const permissions = ["permission1", "permission2"];
      userModelGetAssignedPermissionsForRoleStub.resolves(permissions);

      const result = await userServices.getAssignedPermissionsForRole(roleId);

      expect(result).toStrictEqual(permissions);
    });
  });
  describe("getAssignedPermission", () => {
    let userServiceGetRoleIdStub;
    let userServiceGetAssignedPermissionsForRoleStub;

    beforeEach(() => {
      userServiceGetRoleIdStub = sinon.stub(userServices, "getRoleId");
      userServiceGetAssignedPermissionsForRoleStub = sinon.stub(
        userServices,
        "getAssignedPermissionsForRole"
      );
    });

    afterEach(() => {
      sinon.restore();
    });

    it("should get assigned permissions for the user and return the query result", async () => {
      const id = "1";
      const permissions = ["permission1", "permission2"];
      const roleId = "1";
      userServiceGetRoleIdStub.resolves(roleId);
      userServiceGetAssignedPermissionsForRoleStub.resolves(permissions);

      const result = await userServices.getAssignedPermission(id);

      expect(result).toStrictEqual(permissions);
    });
    it("should return empty array if roleId is null", async () => {
      const id = "1";
      const roleId = null;
      userServiceGetRoleIdStub.resolves(roleId);

      const result = await userServices.getAssignedPermission(id);

      expect(result).toStrictEqual([]);
    });
    it("should return empty array if permission is null", async () => {
      const id = "1";
      const roleId = "1";
      const permissions = null;
      userServiceGetRoleIdStub.resolves(roleId);
      userServiceGetAssignedPermissionsForRoleStub.resolves(permissions);

      const result = await userServices.getAssignedPermission(id);

      expect(result).toStrictEqual([]);
    });
  });
});
