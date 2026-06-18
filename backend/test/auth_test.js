process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

const chai = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const User = require('../models/User');
const { registerUser, loginUser, getProfile, updateUserProfile } = require('../controllers/authController');

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

describe('loginUser Function Test', () => {

  it('should return a token when credentials are valid', async () => {
    const user = {
      id: new mongoose.Types.ObjectId().toString(),
      name: 'Jane',
      email: 'jane@example.com',
      role: 'user',
      password: 'hashed',
    };

    sinon.stub(User, 'findOne').resolves(user);
    sinon.stub(bcrypt, 'compare').resolves(true);

    const req = { body: { email: 'jane@example.com', password: 'secret' } };
    const res = makeRes();

    await loginUser(req, res);

    expect(res.status.called).to.be.false;
    expect(res.json.firstCall.args[0]).to.include({ email: 'jane@example.com', role: 'user' });
    expect(res.json.firstCall.args[0]).to.have.property('token');
  });

  it('should return 401 when the password does not match', async () => {
    const user = { id: '1', email: 'jane@example.com', password: 'hashed' };

    sinon.stub(User, 'findOne').resolves(user);
    sinon.stub(bcrypt, 'compare').resolves(false);

    const req = { body: { email: 'jane@example.com', password: 'wrong' } };
    const res = makeRes();

    await loginUser(req, res);

    expect(res.status.calledWith(401)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'Invalid email or password' })).to.be.true;
  });

  it('should return 401 when the user does not exist', async () => {
    sinon.stub(User, 'findOne').resolves(null);
    const compareStub = sinon.stub(bcrypt, 'compare');

    const req = { body: { email: 'nobody@example.com', password: 'secret' } };
    const res = makeRes();

    await loginUser(req, res);

    expect(res.status.calledWith(401)).to.be.true;
    expect(compareStub.called).to.be.false;
  });

  it('should return 500 on a lookup error', async () => {
    sinon.stub(User, 'findOne').throws(new Error('DB Error'));

    const req = { body: { email: 'err@example.com', password: 'secret' } };
    const res = makeRes();

    await loginUser(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
  });

});

describe('getProfile Function Test', () => {

  it('should return the user profile', async () => {
    const user = {
      name: 'Jane',
      email: 'jane@example.com',
      company: 'Acme',
      address: '1 Road',
      role: 'user',
    };

    sinon.stub(User, 'findById').resolves(user);

    const req = { user: { id: new mongoose.Types.ObjectId().toString() } };
    const res = makeRes();

    await getProfile(req, res);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWithMatch({ name: 'Jane', email: 'jane@example.com', role: 'user' })).to.be.true;
  });

  it('should return 404 when the user is not found', async () => {
    sinon.stub(User, 'findById').resolves(null);

    const req = { user: { id: new mongoose.Types.ObjectId().toString() } };
    const res = makeRes();

    await getProfile(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'User not found' })).to.be.true;
  });

  it('should return 500 on error', async () => {
    sinon.stub(User, 'findById').throws(new Error('DB Error'));

    const req = { user: { id: new mongoose.Types.ObjectId().toString() } };
    const res = makeRes();

    await getProfile(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ error: 'DB Error' })).to.be.true;
  });

});

describe('updateUserProfile Function Test', () => {

  it('should update the supplied fields and keep the rest', async () => {
    const user = {
      id: new mongoose.Types.ObjectId().toString(),
      name: 'Old Name',
      email: 'old@example.com',
      company: 'Old Co',
      address: 'Old Address',
      save: sinon.stub().resolvesThis(),
    };

    sinon.stub(User, 'findById').resolves(user);

    const req = {
      user: { id: user.id },
      body: { name: 'New Name', company: 'New Co' },
    };
    const res = makeRes();

    await updateUserProfile(req, res);

    expect(user.name).to.equal('New Name');
    expect(user.company).to.equal('New Co');
    expect(user.email).to.equal('old@example.com');
    expect(user.address).to.equal('Old Address');
    expect(user.save.calledOnce).to.be.true;
    expect(res.json.firstCall.args[0]).to.have.property('token');
  });

  it('should return 404 when the user is not found', async () => {
    sinon.stub(User, 'findById').resolves(null);

    const req = { user: { id: new mongoose.Types.ObjectId().toString() }, body: {} };
    const res = makeRes();

    await updateUserProfile(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'User not found' })).to.be.true;
  });

  it('should return 500 on error', async () => {
    sinon.stub(User, 'findById').throws(new Error('DB Error'));

    const req = { user: { id: new mongoose.Types.ObjectId().toString() }, body: {} };
    const res = makeRes();

    await updateUserProfile(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
  });

});
