const Task = require('../models/Tasks');
const asyncWrapper = require('../middleware/async');
const { createCustomError } = require('../errors/customError');

//app.post('/api/v1/tasks)  -  create a new tasks
const getAllTasks = asyncWrapper(async (req, res) => {
  const tasks = await Task.find({});
  res.status(200).json({ tasks });
});

const createNewTask = asyncWrapper(async (req, res) => {
  const task = await Task.create(req.body);
  res.status(201).json({ task });
});

//app.get('/api/v1/tasks/:id)  -  get single task
const getTask = asyncWrapper(async (req, res, next) => {
  const { id: taskId } = req.params;
  const task = await Task.findOne({ _id: taskId });
  if (!task) {
    return next(createCustomError(`No task with id : ${taskId}`, 404));
  }
  res.status(200).json({ task });
});

//app.patch('/api/v1/tasks/:id)  -  update task
const updateTask = asyncWrapper(async (req, res) => {
  const { id: taskId } = req.params;
  const task = await Task.findOneAndUpdate({ _id: taskId }, req.body, {
    new: true,
    runValidators: true
  });
  if (!task) {
    return next(createCustomError(`No task with id : ${taskId}`, 404));
  }
  res.status(200).json({ task });
});

//app.delete('/api/v1/tasks/:id)  -  delete task
const deleteTask = asyncWrapper(async (req, res) => {
  const { id: taskId } = req.params;
  const task = await Task.findOneAndDelete({ _id: taskId });
  if (!task) {
    return res.status(404).json({ msg: `No task with id : ${taskId}` });
  }
  res.status(200).json({ task });
});

module.exports = {
  getAllTasks,
  createNewTask,
  updateTask,
  deleteTask,
  getTask
};
