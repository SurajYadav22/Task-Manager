const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../index');
const taskModel = require('../models/task.model');
const userModel = require('../models/user.model');


let mongoServer;
let token;
let userId;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });


    const user = new userModel({
        first_name: 'Anil',
        last_name: 'Yadav',
        email: 'beeruy551@gmail.com',
        password: await bcrypt.hash('Anil@123', 5)
    });
    await user.save();
    userId = user._id;


    token = jwt.sign({ _id: user._id, role: 'user' }, process.env.JWT_SecretKEY, { expiresIn: '1d' });
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Task Routes', () => {
    // Add a task
    it('Should add a new task', async () => {
        const res = await request(app)
            .post('/tasks/add-task')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'New Task',
                description: 'Task description',
                dueDate: '2024-12-31'
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'Task added successfully');
    });

    // Add task with missing fields
    it('Should not add a task with missing title', async () => {
        const res = await request(app)
            .post('/tasks/add-task')
            .set('Authorization', `Bearer ${token}`)
            .send({
                description: 'Task without a title'
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('errors');
    });

    // Update a task status
    it('Should update a task status', async () => {
        const task = new taskModel({
            UserId: userId,
            title: 'Task to update',
            description: 'Task description',
            status: 'todo'
        });
        await task.save();

        const res = await request(app)
            .put(`/tasks/update-task/${task._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                status: 'done'
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Task updated successfully');
    });

    // Delete a task
    it('Should delete a task', async () => {
        const task = new taskModel({
            UserId: userId,
            title: 'Task to delete',
            description: 'Task description'
        });
        await task.save();

        const res = await request(app)
            .delete(`/tasks/delete-task/${task._id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Task Deleted succesfully');
    });

    // View a task
    it('Should view a specific task', async () => {
        const task = new taskModel({
            UserId: userId,
            title: 'Task to view',
            description: 'Task description'
        });
        await task.save();

        const res = await request(app)
            .get(`/tasks/view-task/${task._id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('task');
    });

    // View all tasks
    it('Should view all tasks of the user', async () => {
        const res = await request(app)
            .get('/tasks/view-tasks')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
    });
});
