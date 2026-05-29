const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

const Project = require('../models/Project');

const {
  getAllProjects,
  deleteProject
} = require('../controllers/adminController');

const { expect } = chai;

afterEach(() => {
  sinon.restore();
});

describe('Admin GetAllProjects Test', () => {

  it('should return all projects successfully', async () => {

    const projects = [
      {
        _id: new mongoose.Types.ObjectId(),
        title: 'Project 1',
        clientName: 'ABC Company'
      },
      {
        _id: new mongoose.Types.ObjectId(),
        title: 'Project 2',
        clientName: 'XYZ Company'
      }
    ];

    const populateStub = sinon.stub().resolves(projects);

    const findStub = sinon.stub(Project, 'find').returns({
      populate: populateStub
    });

    const req = {};

    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    await getAllProjects(req, res);

    expect(findStub.calledOnce).to.be.true;

    expect(
      populateStub.calledOnceWith(
        'userId',
        'name email'
      )
    ).to.be.true;

    expect(
      res.json.calledWith(projects)
    ).to.be.true;

  });

  it('should return 500 on error', async () => {

    sinon
      .stub(Project, 'find')
      .throws(new Error('DB Error'));

    const req = {};

    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    await getAllProjects(req, res);

    expect(
      res.status.calledWith(500)
    ).to.be.true;

    expect(
      res.json.calledWithMatch({
        message: 'DB Error'
      })
    ).to.be.true;

  });

});

describe('Admin DeleteProject Test', () => {

  it('should delete project successfully', async () => {

    const req = {
      params: {
        id: new mongoose.Types.ObjectId().toString()
      }
    };

    const project = {
      deleteOne: sinon.stub().resolves()
    };

    const findByIdStub = sinon
      .stub(Project, 'findById')
      .resolves(project);

    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    await deleteProject(req, res);

    expect(
      findByIdStub.calledOnceWith(req.params.id)
    ).to.be.true;

    expect(
      project.deleteOne.calledOnce
    ).to.be.true;

    expect(
      res.json.calledWith({
        message: 'Project deleted'
      })
    ).to.be.true;

  });

  it('should return 404 if project not found', async () => {

    sinon
      .stub(Project, 'findById')
      .resolves(null);

    const req = {
      params: {
        id: new mongoose.Types.ObjectId().toString()
      }
    };

    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    await deleteProject(req, res);

    expect(
      res.status.calledWith(404)
    ).to.be.true;

    expect(
      res.json.calledWith({
        message: 'Project not found'
      })
    ).to.be.true;

  });

  it('should return 500 on error', async () => {

    sinon
      .stub(Project, 'findById')
      .throws(new Error('DB Error'));

    const req = {
      params: {
        id: new mongoose.Types.ObjectId().toString()
      }
    };

    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    await deleteProject(req, res);

    expect(
      res.status.calledWith(500)
    ).to.be.true;

    expect(
      res.json.calledWithMatch({
        message: 'DB Error'
      })
    ).to.be.true;

  });

});
