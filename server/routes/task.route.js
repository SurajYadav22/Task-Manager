const express = require('express');
const auth = require('../middlewares/auth.middleware');
const taskModel = require('../models/task.model');
const { body, validationResult } = require('express-validator');
const taskRouter = express.Router();


taskRouter.post('/add-task',
    auth,
    [
        body('title').notEmpty().withMessage('Task title is required.'),
        body('description').notEmpty().withMessage('Task description is required.'),
        body('dueDate').optional().isISO8601().withMessage('Due date must be a valid date.'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array().map(err => err.msg) });
        }

        const { title, description, dueDate } = req.body;

        try {
            const task = new taskModel({
                UserId: req.user._id,
                title,
                description,
                dueDate,
            });
            await task.save();
            res.status(201).json({ message: "Task added successfully" });
        } catch (error) {
            console.error('Error adding task:', error);
            res.status(500).json({ message: 'Error adding the task', error: error.message });
        }
    }
);


taskRouter.put('/update-task/:id', auth, async (req, res) => {
    const { status } = req.body;
    try {
        const task = await taskModel.findOne({ _id: req.params.id, UserId: req.user._id });
        if (!task) {
            return res.status(404).json({
                message: 'Task not found'
            });
        }
        task.status = status;

        if (status === 'done') {
            task.completedAt = new Date();
        } else {
            task.completedAt = null;
        }
        await task.save();
        res.status(200).json({
            message: 'Task updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating the task',
            error
        });
    }
});




taskRouter.put('/edit-task/:id', auth, [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().notEmpty().withMessage('Description cannot be empty'),
    body('status').optional().isIn(['todo', 'in-progress', 'done']).withMessage('Invalid status value'),
    body('dueDate').optional().isISO8601().withMessage('Invalid due date format'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array().map(err => err.msg) });
    }

    const { title, description, status, dueDate } = req.body;

    try {
        const task = await taskModel.findOne({ _id: req.params.id, UserId: req.user._id });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (title) task.title = title;
        if (description) task.description = description;
        if (status) {
            task.status = status;
            if (status === 'done') {
                task.completedAt = new Date();
            } else {
                task.completedAt = null;
            }
        }
        if (dueDate) task.dueDate = new Date(dueDate);

        await task.save();
        res.status(200).json({ message: 'Task updated successfully', task });
    } catch (error) {
        res.status(500).json({ message: 'Error updating the task', error: error.message });
    }
});




taskRouter.delete('/delete-task/:id', auth, async (req, res) => {
    try {
        const task = await taskModel.findOneAndDelete({ _id: req.params.id, UserId: req.user._id });
        if (!task) {
            return res.status(401).json({
                message: 'Task not found...Please login again'
            })
        }
        res.status(200).json({
            message: 'Task Deleted succesfully'
        })
    } catch (error) {
        res.status(405).json({
            message: 'Error deleting the task',
            error
        })
    }
});


taskRouter.get('/view-task/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const task = await taskModel.find({ _id: id, UserId: req.user._id })
        res.status(200).json({
            task
        });
    } catch (error) {
        res.status(500).json({ message: 'Error occurred while fetching tasks', error });
    }
});

taskRouter.get('/view-tasks', auth, async (req, res) => {
    try {
        const tasks = await taskModel.find({ UserId: req.user._id });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error occurred while fetching tasks', error });
    }
});


module.exports = taskRouter;