const chai = require('chai');
const sinon = require('sinon');

const ProjectProxy = require('../proxies/ProjectProxy');

const { expect } = chai;

// A stand-in for the real ProjectService so these tests stay focused on the
// proxy's access-control behaviour and never touch the database.
const fakeService = () => ({
  getAllProjects: sinon.stub().resolves(['p1', 'p2']),
  deleteProject: sinon.stub().resolves({ id: '123' })
});

const adminUser = { role: 'admin' };
const freelancerUser = { role: 'user' };

describe('ProjectProxy access control', () => {

  it('should delegate getAllProjects to the real service for an admin', async () => {
    const service = fakeService();
    const proxy = new ProjectProxy(adminUser, service);

    const result = await proxy.getAllProjects();

    expect(service.getAllProjects.calledOnce).to.be.true;
    expect(result).to.deep.equal(['p1', 'p2']);
  });

  it('should delegate deleteProject to the real service for an admin', async () => {
    const service = fakeService();
    const proxy = new ProjectProxy(adminUser, service);

    const result = await proxy.deleteProject('123');

    expect(service.deleteProject.calledOnceWith('123')).to.be.true;
    expect(result).to.deep.equal({ id: '123' });
  });

  it('should block getAllProjects for a non-admin and not touch the service', async () => {
    const service = fakeService();
    const proxy = new ProjectProxy(freelancerUser, service);

    let thrown;
    try {
      await proxy.getAllProjects();
    } catch (error) {
      thrown = error;
    }

    expect(thrown).to.be.an('error');
    expect(thrown.statusCode).to.equal(403);
    expect(service.getAllProjects.called).to.be.false;
  });

  it('should block deleteProject for a non-admin and not touch the service', async () => {
    const service = fakeService();
    const proxy = new ProjectProxy(freelancerUser, service);

    let thrown;
    try {
      await proxy.deleteProject('123');
    } catch (error) {
      thrown = error;
    }

    expect(thrown).to.be.an('error');
    expect(thrown.statusCode).to.equal(403);
    expect(service.deleteProject.called).to.be.false;
  });

  it('should block access when there is no authenticated user', async () => {
    const service = fakeService();
    const proxy = new ProjectProxy(undefined, service);

    let thrown;
    try {
      await proxy.getAllProjects();
    } catch (error) {
      thrown = error;
    }

    expect(thrown).to.be.an('error');
    expect(thrown.statusCode).to.equal(403);
    expect(service.getAllProjects.called).to.be.false;
  });

});
