const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const userModel = require('./models/user.model');  // Ensure you have user model

// Initialize session middleware
app.use(session({
    secret: process.env.SESSION_SECRET, // use your session secret
    resave: false,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

// Serialize user
passport.serializeUser(function (user, done) {
    done(null, user._id);
});

// Deserialize user
passport.deserializeUser(function (id, done) {
    userModel.findById(id, function (err, user) {
        done(err, user);
    });
});

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.Client_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'http://localhost:4004/users/auth/google/callback',
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if the user already exists
            let existingUser = await userModel.findOne({ email: profile.emails[0].value });

            if (existingUser) {
                return done(null, existingUser);
            }

            // If the user does not exist, create a new user
            const newUser = new userModel({
                first_name: profile.name.givenName,
                last_name: profile.name.familyName,
                email: profile.emails[0].value,
                password: '', // No password for Google login
                role: 'user', // Default role for Google users
            });

            const savedUser = await newUser.save();
            done(null, savedUser);
        } catch (error) {
            done(error, false);
        }
    }
));

// Google auth routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/users/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    // Redirect to the frontend or dashboard after successful login
    res.redirect(process.env.CLIENT_URL);
});

app.get('/auth/logout', (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.send('Logout Successful');
    });
});
