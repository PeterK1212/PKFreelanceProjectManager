const chai = require('chai');

const UserFactory = require('../factories/UserFactory');
const BaseUser = require('../models/users/BaseUser');
const AdminUser = require('../models/users/AdminUser');
const FreelancerUser = require('../models/users/FreelancerUser');

const { expect } = chai;

const sampleData = { name: 'Jane', email: 'jane@example.com', password: 'secret' };

describe('UserFactory.create Test', () => {

  it('should create an AdminUser with role "admin"', () => {
    const user = UserFactory.create('admin', sampleData);

    expect(user).to.be.instanceOf(AdminUser);
    expect(user).to.be.instanceOf(BaseUser);
    expect(user.role).to.equal('admin');
  });

  it('should create a FreelancerUser with role "user" for type "user"', () => {
    const user = UserFactory.create('user', sampleData);

    expect(user).to.be.instanceOf(FreelancerUser);
    expect(user).to.be.instanceOf(BaseUser);
    expect(user.role).to.equal('user');
  });

  it('should treat "freelancer" as an alias for the user type', () => {
    const user = UserFactory.create('freelancer', sampleData);

    expect(user).to.be.instanceOf(FreelancerUser);
    expect(user.role).to.equal('user');
  });

  it('should default to a FreelancerUser when no type is given', () => {
    const user = UserFactory.create(undefined, sampleData);

    expect(user).to.be.instanceOf(FreelancerUser);
    expect(user.role).to.equal('user');
  });

  it('should default to a FreelancerUser for an unknown type', () => {
    const user = UserFactory.create('superuser', sampleData);

    expect(user).to.be.instanceOf(FreelancerUser);
    expect(user.role).to.equal('user');
  });

  it('should be case-insensitive when matching the type', () => {
    const user = UserFactory.create('ADMIN', sampleData);

    expect(user.role).to.equal('admin');
  });

});

describe('User buildPayload Test', () => {

  it('should return exactly the four expected keys with the original values', () => {
    const payload = UserFactory.create('admin', sampleData).buildPayload();

    expect(payload).to.deep.equal({
      name: 'Jane',
      email: 'jane@example.com',
      password: 'secret',
      role: 'admin',
    });
    expect(Object.keys(payload)).to.have.members(['name', 'email', 'password', 'role']);
  });

  it('should produce role "user" in the payload for a freelancer', () => {
    const payload = UserFactory.create('freelancer', sampleData).buildPayload();

    expect(payload.role).to.equal('user');
  });

});
