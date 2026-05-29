
const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const app = require('../server'); 
const connectDB = require('../config/db');
const mongoose = require('mongoose');
const sinon = require('sinon');
const Project = require('../models/Project');
const { updateProject,getProjects,addProject,deleteProject } = require('../controllers/projectController');
const { expect } = chai;

chai.use(chaiHttp);
let server;
let port;


describe('AddProject Function Test', () => {

  it('should create a new project successfully', async () => {
    // Mock request data
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { title: "Website Development", description: "Build a company website", clientName: "ABC Company", budget: 5000, status: "In Progress", deadline: "2026-12-31" }
    };

    // Mock project that would be created
    const createdProject = { _id: new mongoose.Types.ObjectId(), ...req.body, userId: req.user.id };

    // Stub Project.create to return the createdProject
    const createStub = sinon.stub(Project, 'create').resolves(createdProject);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await addProject(req, res);

    // Assertions
    expect(createStub.calledOnceWith({ userId: req.user.id, ...req.body })).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(createdProject)).to.be.true;

    // Restore stubbed methods
    createStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    // Stub Project.create to throw an error
    const createStub = sinon.stub(Project, 'create').throws(new Error('DB Error'));

    // Mock request data
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { title: "Website Development", description: "Build a company website", clientName: "ABC Company", budget: 5000, status: "In Progress", deadline: "2026-12-31" }
    };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await addProject(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    createStub.restore();
  });

});


describe('UpdateProject Function Test', () => {

  it('should update project successfully', async () => {
    // Mock project data
    const projectId = new mongoose.Types.ObjectId();
    const existingProject = {
      _id: projectId,
      title: "Old Project",
      description: "Old Description",
      clientName: "Old Client",
      budget: 1000,
      status: "Pending",
      deadline: new Date(),
      save: sinon.stub().resolvesThis(), // Mock save method
    };
    // Stub Project.findById to return mock project
    const findByIdStub = sinon.stub(Project, 'findById').resolves(existingProject);

    // Mock request & response
    const req = {
      params: { id: projectId },
      body: { title: "Updated Project", status: "Completed" }
    };
    const res = {
      json: sinon.spy(), 
      status: sinon.stub().returnsThis()
    };

    // Call function
    await updateProject(req, res);

    // Assertions
    expect(existingProject.title).to.equal("Updated Project");
    expect(existingProject.status).to.equal("Completed");
    expect(res.status.called).to.be.false; // No error status should be set
    expect(res.json.calledOnce).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });



  it('should return 404 if project is not found', async () => {
    const findByIdStub = sinon.stub(Project, 'findById').resolves(null);

    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await updateProject(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Project not found' })).to.be.true;

    findByIdStub.restore();
  });

  it('should return 500 on error', async () => {
    const findByIdStub = sinon.stub(Project, 'findById').throws(new Error('DB Error'));

    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await updateProject(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.called).to.be.true;

    findByIdStub.restore();
  });



});



describe('GetProjects Function Test', () => {

  it('should return projects for the given user', async () => {
    // Mock user ID
    const userId = new mongoose.Types.ObjectId();

    // Mock project data
    const projects = [
      { _id: new mongoose.Types.ObjectId(), title: "Project 1", userId },
      { _id: new mongoose.Types.ObjectId(), title: "Project 2", userId }
    ];

    // Stub Project.find to return mock project
    const findStub = sinon.stub(Project, 'find').resolves(projects);

    // Mock request & response
    const req = { user: { id: userId } };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    // Call function
    await getProjects(req, res);

    // Assertions
    expect(findStub.calledOnceWith({ userId })).to.be.true;
    expect(res.json.calledWith(projects)).to.be.true;
    expect(res.status.called).to.be.false; // No error status should be set

    // Restore stubbed methods
    findStub.restore();
  });

  it('should return 500 on error', async () => {
    // Stub Project.find to throw an error
    const findStub = sinon.stub(Project, 'find').throws(new Error('DB Error'));

    // Mock request & response
    const req = { user: { id: new mongoose.Types.ObjectId() } };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    // Call function
    await getProjects(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    findStub.restore();
  });

});



describe('DeleteProject Function Test', () => {

  it('should delete a project successfully', async () => {
    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock project found in the database
    const project = { deleteOne: sinon.stub().resolves() };

    // Stub Project.findById to return the mock project
    const findByIdStub = sinon.stub(Project, 'findById').resolves(project);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteProject(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(project.deleteOne.calledOnce).to.be.true;
    expect(res.json.calledWith({ message: 'Project deleted' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 404 if project is not found', async () => {
    // Stub Project.findById to return null
    const findByIdStub = sinon.stub(Project, 'findById').resolves(null);

    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteProject(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Project not found' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    // Stub Project.findById to throw an error
    const findByIdStub = sinon.stub(Project, 'findById').throws(new Error('DB Error'));

    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteProject(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

});
