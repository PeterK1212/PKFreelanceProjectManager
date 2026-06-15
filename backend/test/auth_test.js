process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/User');
const { registerUser } = require('../controllers/authController');

const { expect } = chai;

afterEach(() => {
  sinon.restore();
});

const makeRes = () => ({
  status: sinon.stub().returnsThis(),
  json: sinon.spy(),
});

describe('registerUser Factory Integration Test', () => {

  it('should create an admin via the factory when role is "admin"', async () => {
    const req = {
      body: { name: 'Admin', email: 'admin@example.com', password: 'secret', role: 'admin' },
    };

    sinon.stub(User, 'findOne').resolves(null);
    const createStub = sinon.stub(User, 'create').resolves({
      id: new mongoose.Types.ObjectId().toString(),
      name: 'Admin',
      email: 'admin@example.com',
      role: 'admin',
    });

    const res = makeRes();
    await registerUser(req, res);

    // Factory output must reach User.create with the admin role.
    expect(createStub.calledOnce).to.be.true;
    expect(createStub.firstCall.args[0]).to.include({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'secret',
      role: 'admin',
    });
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.firstCall.args[0]).to.include({ role: 'admin' });
    expect(res.json.firstCall.args[0]).to.have.property('token');
  });

  it('should default to role "user" when no role is supplied', async () => {
    const req = {
      body: { name: 'Free', email: 'free@example.com', password: 'secret' },
    };

    sinon.stub(User, 'findOne').resolves(null);
    const createStub = sinon.stub(User, 'create').resolves({
      id: new mongoose.Types.ObjectId().toString(),
      name: 'Free',
      email: 'free@example.com',
      role: 'user',
    });

    const res = makeRes();
    await registerUser(req, res);

    expect(createStub.calledOnce).to.be.true;
    expect(createStub.firstCall.args[0].role).to.equal('user');
    expect(res.status.calledWith(201)).to.be.true;
  });

  it('should return 400 and not create when the email already exists', async () => {
    const req = {
      body: { name: 'Dup', email: 'dup@example.com', password: 'secret' },
    };

    sinon.stub(User, 'findOne').resolves({ id: 'existing' });
    const createStub = sinon.stub(User, 'create');

    const res = makeRes();
    await registerUser(req, res);

    expect(res.status.calledWith(400)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'User already exists' })).to.be.true;
    expect(createStub.notCalled).to.be.true;
  });

  it('should return 500 on a lookup error', async () => {
    const req = {
      body: { name: 'Err', email: 'err@example.com', password: 'secret' },
    };

    sinon.stub(User, 'findOne').throws(new Error('DB Error'));

    const res = makeRes();
    await registerUser(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
  });

});
