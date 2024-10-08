const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
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
}, { timestamps: true });

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
