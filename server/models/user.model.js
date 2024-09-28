const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String },
    email: { type: String, require: true, unix: true },
    password: { type: String, require: true },
    role: {
        type: String,
        enum: ['admin', 'user'],
        required: true,
        default: 'user'
    },
    googleId: { type: String },
    avatar: { type: String },
    created_at: { type: Date, default: Date.now },
}, { versionKey: false, timestamps: true });

const userModel = mongoose.model("User", userSchema);

module.exports = userModel
