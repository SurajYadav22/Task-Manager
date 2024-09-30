const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../index');
const userModel = require('../models/user.model');


let mongoServer;
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('User Routes', () => {

    it('Should register a new user', async () => {
        const res = await request(app)
            .post('/users/register')
            .send({
                first_name: 'Anil',
                last_name: 'Yadav',
                email: 'beeruy551@gmail.com',
                password: 'Anil@123'
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'User registered successfully');
    });


    it('Should not register a user with invalid email', async () => {
        const res = await request(app)
            .post('/users/register')
            .send({
                first_name: 'Anil',
                last_name: 'Yadav',
                email: 'invalid-email',
                password: 'Anil@123'
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('errors');
    });

    // Login User
    it('Should log in a user', async () => {
        const user = new userModel({
            first_name: 'Anil',
            last_name: 'Yadav',
            email: 'beeruy551@gmail.com',
            password: await bcrypt.hash('Anil@123', 5)
        });
        await user.save();

        const res = await request(app)
            .post('/users/login')
            .send({
                email: 'beeruy551@gmail.com',
                password: 'Anil@123'
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });

    // Login with invalid credentials
    it('Should not log in with incorrect credentials', async () => {
        const res = await request(app)
            .post('/users/login')
            .send({
                email: 'wrong.email@example.com',
                password: 'wrongpassword'
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'Invalid credentials');
    });

    // Logout User
    it('Should log out the user', async () => {
        const res = await request(app)
            .get('/users/logout')
            .set('Authorization', 'Bearer VALID_JWT_TOKEN');  // replace with actual valid token

        expect(res.statusCode).toEqual(200);
        expect(res.text).toEqual('Logout Successfull');
    });
});
