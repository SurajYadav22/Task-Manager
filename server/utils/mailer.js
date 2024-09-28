const nodemailer = require('nodemailer');

const sendReminderEmail = (email, task) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Task Reminder',
        text: `Reminder for your task: "${task.title}". It's due on ${new Date(task.dueDate).toLocaleString()}.`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error('Error sending reminder email:', err);
        } else {
            console.log('Reminder email sent: ' + info.response);
        }
    });
};

module.exports = sendReminderEmail;