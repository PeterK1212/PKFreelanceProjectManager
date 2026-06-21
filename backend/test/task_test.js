const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

const Task = require('../models/Task');
const { getTasks, addTask, updateTask, deleteTask } = require('../controllers/taskController');

const { expect } = chai;

afterEach(() => {
  sinon.restore();
});

const makeRes = () => ({
  status: sinon.stub().returnsThis(),
  json: sinon.spy(),
});

describe('GetTasks Function Test', () => {

  it('should return tasks for the given user', async () => {
    const userId = new mongoose.Types.ObjectId();
    const tasks = [
      { _id: new mongoose.Types.ObjectId(), title: 'Task 1', userId },
      { _id: new mongoose.Types.ObjectId(), title: 'Task 2', userId },
    ];

    const findStub = sinon.stub(Task, 'find').resolves(tasks);

    const req = { user: { id: userId } };
    const res = makeRes();

    await getTasks(req, res);

    expect(findStub.calledOnceWith({ userId: userId })).to.be.true;
    expect(res.json.calledWith(tasks)).to.be.true;
    expect(res.status.called).to.be.false;
  });

  it('should return 500 on error', async () => {
    sinon.stub(Task, 'find').throws(new Error('DB Error'));

    const req = { user: { id: new mongoose.Types.ObjectId() } };
    const res = makeRes();

    await getTasks(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
  });

});

describe('AddTask Function Test', () => {

  it('should create a new task successfully', async () => {
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { title: 'Write tests', description: 'Cover the task controller', deadline: '2026-12-31' },
    };

    const createdTask = { _id: new mongoose.Types.ObjectId(), userId: req.user.id, ...req.body };
    const createStub = sinon.stub(Task, 'create').resolves(createdTask);

    const res = makeRes();

    await addTask(req, res);

    expect(createStub.calledOnceWith({
      userId: req.user.id,
      title: req.body.title,
      description: req.body.description,
      deadline: req.body.deadline,
    })).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(createdTask)).to.be.true;
  });

  it('should return 500 if an error occurs', async () => {
    sinon.stub(Task, 'create').throws(new Error('DB Error'));

    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { title: 'Write tests', description: 'desc', deadline: '2026-12-31' },
    };
    const res = makeRes();

    await addTask(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
  });

});

describe('UpdateTask Function Test', () => {

  it('should update task successfully', async () => {
    const taskId = new mongoose.Types.ObjectId();
    const existingTask = {
      _id: taskId,
      title: 'Old Title',
      description: 'Old Description',
      completed: false,
      deadline: new Date(),
      save: sinon.stub().resolvesThis(),
    };

    sinon.stub(Task, 'findById').resolves(existingTask);

    const req = {
      params: { id: taskId },
      body: { title: 'New Title', completed: true },
    };
    const res = makeRes();

    await updateTask(req, res);

    expect(existingTask.title).to.equal('New Title');
    expect(existingTask.completed).to.equal(true);
    expect(existingTask.save.calledOnce).to.be.true;
    expect(res.status.called).to.be.false;
    expect(res.json.calledOnce).to.be.true;
  });

  it('should keep completed as false when explicitly set to false', async () => {
    const existingTask = {
      title: 'Title',
      description: 'Desc',
      completed: true,
      deadline: new Date(),
      save: sinon.stub().resolvesThis(),
    };

    sinon.stub(Task, 'findById').resolves(existingTask);

    const req = { params: { id: new mongoose.Types.ObjectId() }, body: { completed: false } };
    const res = makeRes();

    await updateTask(req, res);

    // `completed ?? task.completed` must honour an explicit false, not fall back to true.
    expect(existingTask.completed).to.equal(false);
  });

  it('should return 404 if task is not found', async () => {
    sinon.stub(Task, 'findById').resolves(null);

    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = makeRes();

    await updateTask(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Task not found' })).to.be.true;
  });

  it('should return 500 on error', async () => {
    sinon.stub(Task, 'findById').throws(new Error('DB Error'));

    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = makeRes();

    await updateTask(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
  });

});

describe('DeleteTask Function Test', () => {

  it('should delete a task successfully', async () => {
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    const task = { remove: sinon.stub().resolves() };
    const findByIdStub = sinon.stub(Task, 'findById').resolves(task);

    const res = makeRes();

    await deleteTask(req, res);

    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(task.remove.calledOnce).to.be.true;
    expect(res.json.calledWith({ message: 'Task deleted' })).to.be.true;
  });

  it('should return 404 if task is not found', async () => {
    sinon.stub(Task, 'findById').resolves(null);

    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
    const res = makeRes();

    await deleteTask(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Task not found' })).to.be.true;
  });

  it('should return 500 if an error occurs', async () => {
    sinon.stub(Task, 'findById').throws(new Error('DB Error'));

    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
    const res = makeRes();

    await deleteTask(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
  });

});
