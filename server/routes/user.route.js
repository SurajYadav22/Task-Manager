const express = require('express');
const userRouter = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const auth = require('../middlewares/auth.middleware');
const blacklistModel = require('../models/blacklist.model');
const userModel = require('../models/user.model');
const { body, validationResult } = require('express-validator');

// Google login route
userRouter.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));


// Google OAuth callback route
userRouter.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    const user = req.user;
    const role = user.role;
    // console.log(user, "user in session",);
    // Generate JWT token
    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SecretKEY, { expiresIn: '1day' });
    res.redirect(`${process.env.CLIENT_URL}/auth/google/success?token=${token}&role=${role}`);
});


userRouter.post('/register', [
    body('first_name').trim().notEmpty().withMessage('First name is required'),
    body('last_name').trim().notEmpty().withMessage('Last name is required'),
    body('email')
        .isEmail()
        .withMessage('Must be a valid email address')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    body('role').optional().trim(),
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array().map(err => err.msg) });
    }

    const { first_name, last_name, email, password, role } = req.body;

    try {
        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 5);
        const user = new userModel({
            first_name,
            last_name,
            email,
            password: hashedPassword,
            role
        });

        await user.save();
        return res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).json({
            message: 'Error occurred during User Creation',
            error: error.message
        });
    }
});


userRouter.post('/login', [
    body('email').isEmail().withMessage('Must be a valid email address'),
    body('password').notEmpty().withMessage('Password is required'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array().map(err => err.msg) });
    }
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user || !user.password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        bcrypt.compare(password, user.password, function (err, result) {
            if (err) {
                return res.status(500).json({ message: 'Error during password comparison' });
            }
            if (result) {
                const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SecretKEY, { expiresIn: '1d' });
                return res.status(200).json({
                    message: "User logged in successfully",
                    user,
                    token,
                    role: user.role,
                });
            } else {
                return res.status(401).json({ message: 'Incorrect password' });
            }
        });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({
            message: 'Error occurred during login',
            error: error.message,
        });
    }
});


userRouter.get('/logout', auth, async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const BlackListed_Token = new blacklistModel({
        token
    })
    await BlackListed_Token.save();
    res.send('Logout Successfull');
});

userRouter.get('/me', auth, async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id);
        console.log(user, "user on login success");
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user data' });
    }
});

module.exports = userRouter;