const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String
    },
    googleId: {
        type: String
    },
    provider: {
        type: String,
        default: 'local'
    }
}, { timestamps: true, versionKey: true });

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
