const UserModel = require('../models/User');

const loginUser = async (email, password) => {
    const user = await UserModel.findOne({ email, password });
    return user;
}

const registerUser = async (name, email, password) => {
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
        throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 8);
    const newUser = await UserModel.create({ name, email, password: hashedPassword });

    return newUser;
}

const getUser = async (id, email) => {
    if (!id || !email) {
        throw new Error('Please provide id or email');
    }

    const user = id
        ? await UserModel.findById(id)
        : await UserModel.findOne({ email });

    return user;
}

module.exports = {
    loginUser,
    registerUser,
    getUser
}