const UserModel = require('../models/User');

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
    getUser
}