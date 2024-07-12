import expect from "expect";
import sinon from "sinon";
import Usermodel from "../../../model/users";




describe("User Model Test Suite", () => {


describe('getUserByEmail', () => {
  let knexInstanceStub: sinon.SinonStub;

  beforeEach(() => {
    knexInstanceStub = sinon.stub();
    knexInstanceStub.returns({
      select: sinon.stub().returnsThis(),
      from: sinon.stub().returnsThis(),
      where: sinon.stub().returnsThis(),
      then: sinon.stub().resolves([])
    });

  });

  afterEach(() => {
    sinon.restore();
  });

  it('should return user when found', async () => {
    const mockUser = { id: 1, email: 'test@example.com', name: 'Test User' };
    knexInstanceStub().then.resolves([mockUser]);

    const result = await Usermodel.getUserByEmail('test@example.com');

    expect(result).toBe(mockUser);

  });

  it('should return null when user not found', async () => {
    knexInstanceStub().then.resolves([]);

    const result = await Usermodel.getUserByEmail('nonexistent@example.com');

    expect(result).toBeNull;
  });

  it('should handle database errors', async () => {
    const error = new Error('Database error');
    knexInstanceStub().then.rejects(error);

    const result = await Usermodel.getUserByEmail('test@example.com');

    expect(result).toBeUndefined;

  });
});


})