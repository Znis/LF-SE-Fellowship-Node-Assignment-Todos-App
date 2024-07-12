import bcrypt  from 'bcrypt';
import { BadRequestError } from '../../../error/badRequestError';
import { expect } from 'expect';
import { createUser, getUserByEmail } from '../../../services/users';
import sinon from 'sinon';
import * as UserModel from "../../../model/users";
import Iuser from '../../../interfaces/user';

describe("User Service Test Suite", () => {
    describe("getUserByEmail", () => {
        let userModelGetUserByEmailStub: sinon.SinonStub;
        beforeEach(() => {
            userModelGetUserByEmailStub = sinon.stub(UserModel, "getUserByEmail");
        });
        afterEach(() => {
            userModelGetUserByEmailStub.restore();
        });
    
        it("Should throw error when user is not found", () => {
            userModelGetUserByEmailStub.resolves(undefined);
            expect(() => getUserByEmail("ab")).toThrow(
                new BadRequestError("User with email abc@abc.com not found")
            );
        });
    
    
    it("Should return user if user is found", () => {
        const user = {
            id: "1",
            name: "admin",
            email: "admin@admin.com",
            password: "admin",
        }
        userModelGetUserByEmailStub.resolves(user);
        const response = getUserByEmail("abc");
        expect(response).toStrictEqual(user);
    });
    });
    
    describe("createUser", () => {
        let bcryptHashStub: sinon.SinonStub;
        let userModelCreateUserStub: sinon.SinonStub;
    
        beforeEach(() => {
            bcryptHashStub = sinon.stub(bcrypt, "hash");
            userModelCreateUserStub = sinon.stub(UserModel, "createUser");
        });
        afterEach(() => {
            bcryptHashStub.restore();
            userModelCreateUserStub.restore();
        })
        it("Should create new user", async () => {
            const user = {
                id: "1",
                name: "admin",
                email: "admin@admin.com",
                password: "admin",
            } as Iuser
            await createUser(user);
            expect(bcryptHashStub.callCount).toBe(1);
            expect(bcryptHashStub.getCall(0).args).toStrictEqual([user.password, 10]);

            expect(userModelCreateUserStub.callCount).toBe(1);
            expect(userModelCreateUserStub.getCall(0).args).toStrictEqual([{...user, password: "hashedPassword"}]);

        });
    })
    
});







// describe.only("example", () => {
//     before(() => { //beforeEach, afterEach, after, it(each test case)
//         console.log("before")
//     })
// })