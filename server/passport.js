const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const userModel = require("./models/user.model");

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
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL:
        "https://task-manager-n6tv.onrender.com/users/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      // console.log(profile, "Google OAuth Strategy profile");

      try {
        // Check if the user already exists
        let existingUser = await userModel.findOne({
          email: profile.emails[0].value,
        });

        if (existingUser) {
          // console.log(existingUser, "existingUser")
          return done(null, existingUser);
        }

        // If the user does not exist, create a new user
        const newUser = new userModel({
          first_name: profile.name.givenName,
          last_name: profile.name.familyName,
          email: profile.emails[0].value,
          googleId: profile.id,
          avatar: profile.photos[0].value,
          password: "",
          role: "user",
        });

        // console.log(newUser, "User created")

        const savedUser = await newUser.save();
        done(null, savedUser);
      } catch (error) {
        done(error, false);
      }
    }
  )
);
