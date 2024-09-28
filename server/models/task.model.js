const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', required: true
    },

    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ['todo', 'in-progress', 'done'],
        default: 'todo'
    },
    dueDate: { type: Date },

    completedAt: {
        type: Date
    },

}, { timestamps: true, versionKey: false });

const taskModel = mongoose.model('Task', taskSchema);
module.exports = taskModel;
