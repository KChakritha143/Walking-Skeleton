const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect } = require('../middleware/auth');
const { validate, createTaskSchema, updateTaskSchema } = require('../middleware/validate');

router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const tasks = await Task.find({ authorId: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    if (task.authorId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'User not authorized to access this task' });
    }
    res.json(task);
  } catch (error) {
    next(error);
  }
});

router.post('/', validate(createTaskSchema), async (req, res, next) => {
  try {
    const { title, description, priority, dueDate, subtasks } = req.body;
    
    const newTask = new Task({
      authorId: req.user.id,
      title,
      description,
      priority,
      dueDate,
      subtasks
    });

    const task = await newTask.save();
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', validate(updateTaskSchema), async (req, res, next) => {
  try {
    const { title, description, completed, priority, dueDate, subtasks } = req.body;
    let task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    if (task.authorId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'User not authorized to update this task' });
    }

    const updateFields = {};
    if (title !== undefined) updateFields.title = title;
    if (description !== undefined) updateFields.description = description;
    if (completed !== undefined) updateFields.completed = completed;
    if (priority !== undefined) updateFields.priority = priority;
    if (dueDate !== undefined) updateFields.dueDate = dueDate;
    if (subtasks !== undefined) updateFields.subtasks = subtasks;

    task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );
    res.json(task);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    if (task.authorId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'User not authorized to delete this task' });
    }
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task removed successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;