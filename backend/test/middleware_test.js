process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

const chai = require('chai');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

const { expect } = chai;

afterEach(() => {
  sinon.restore();
});

const makeRes = () => ({
  status: sinon.stub().returnsThis(),
  json: sinon.spy(),
});

describe('protect Middleware Test', () => {

  it('should attach the user and call next on a valid Bearer token', async () => {
    const userId = new mongoose.Types.ObjectId().toString();
    const user = { _id: userId, name: 'Jane', role: 'user' };

    sinon.stub(jwt, 'verify').returns({ id: userId });
    // protect chains .select('-password') on the query.
    sinon.stub(User, 'findById').returns({ select: sinon.stub().resolves(user) });

    const req = { headers: { authorization: 'Bearer good.token.here' } };
    const res = makeRes();
    const next = sinon.spy();

    await protect(req, res, next);

    expect(req.user).to.deep.equal(user);
    expect(next.calledOnce).to.be.true;
    expect(res.status.called).to.be.false;
  });

  it('should return 401 when no token is provided', async () => {
    const req = { headers: {} };
    const res = makeRes();
    const next = sinon.spy();

    await protect(req, res, next);

    expect(res.status.calledWith(401)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'Not authorized, no token' })).to.be.true;
    expect(next.called).to.be.false;
  });

  it('should return 401 when the token fails verification', async () => {
    sinon.stub(jwt, 'verify').throws(new Error('bad token'));

    const req = { headers: { authorization: 'Bearer bad.token' } };
    const res = makeRes();
    const next = sinon.spy();

    await protect(req, res, next);

    expect(res.status.calledWith(401)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'Not authorized, token failed' })).to.be.true;
    expect(next.called).to.be.false;
  });

});

describe('admin Middleware Test', () => {

  it('should call next for an admin user', () => {
    const req = { user: { role: 'admin' } };
    const res = makeRes();
    const next = sinon.spy();

    admin(req, res, next);

    expect(next.calledOnce).to.be.true;
    expect(res.status.called).to.be.false;
  });

  it('should return 403 for a non-admin user', () => {
    const req = { user: { role: 'user' } };
    const res = makeRes();
    const next = sinon.spy();

    admin(req, res, next);

    expect(res.status.calledWith(403)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'Admin access only' })).to.be.true;
    expect(next.called).to.be.false;
  });

  it('should return 403 when there is no authenticated user', () => {
    const req = {};
    const res = makeRes();
    const next = sinon.spy();

    admin(req, res, next);

    expect(res.status.calledWith(403)).to.be.true;
    expect(next.called).to.be.false;
  });

});
