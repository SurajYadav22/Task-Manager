const cron = require('node-cron');
const taskModel = require('../models/task.model');
const sendReminderEmail = require('./mailer');

const sendTaskReminders = async () => {
    try {
        const currentDate = new Date();

        // Find tasks due in the next hour
        const tasks = await taskModel.find({
            dueDate: { $gte: currentDate, $lte: new Date(currentDate.getTime() + 60 * 60 * 1000) },
            status: 'todo'
        }).populate('UserId', 'email');

        // Send reminder emails
        if (tasks.length > 0) {
            tasks.forEach(task => {
                const userEmail = task.UserId.email;
                sendReminderEmail(userEmail, task);
            });
        }
    } catch (error) {
        console.error('Error sending task reminders:', error);
    }
};

// Schedule the cron job to run every hour on the hour
cron.schedule('0 * * * *', sendTaskReminders);
module.exports = sendTaskReminders;