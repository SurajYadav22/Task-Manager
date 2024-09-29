require("dotenv").config();
const express = require("express");
const passport = require("passport"); // Add Passport for OAuth
const session = require("express-session");
const app = express();
const PORT = process.env.PORT || 3000;
const connection = require("./config/db");
const userRouter = require("./routes/user.route");
const cors = require("cors");
const taskRouter = require("./routes/task.route");
const sendTaskReminders = require("./utils/reminder");

// Enable session handling
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
require("./passport"); // Import Passport config

app.use(express.json());
const corsOptions = {
  origin: "*", // Replace with your frontend's origin
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Allowed HTTP methods
  credentials: true, // Allow cookies and authentication headers
};
app.use(cors(corsOptions));

app.get("/", (req, res) => {
  return res.status(200).send("Server is running fine");
});

// User and task routes
app.use("/users", userRouter);
app.use("/tasks", taskRouter);

app.listen(PORT, async () => {
  try {
    await connection;
    console.log(
      `Server is running at ${PORT} & Database connected successfully`
    );
  } catch (err) {
    console.log("Error during connecting to the DB");
    console.log(err);
  }
});
