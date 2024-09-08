const UserModel = require('../models/User');
const bcrypt = require('bcrypt');

const registerUser = async (firstname, lastname, email, password) => {
    try {
        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            throw new Error('User already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 8);
        const newUser = new UserModel({ firstname, lastname, email, password: hashedPassword });
        await newUser.save();

        return newUser;
    } catch (error) {
        throw new Error(error);
    }
}

const getUser = async (id, email) => {
    if (!id || !email) {
        throw new Error('Please provide id or email');
    }

    try {
        const user = id
            ? await UserModel.findById(id)
            : await UserModel.findOne({ email });

        return user;
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = {
    registerUser,
    getUser
}