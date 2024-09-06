// a middleware that checks if the user is authenticated using the jwt token

const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');

module.exports = async (req, res, next) => {
    try {
        // Check if the Authorization header exists
        const authHeader = req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).send({ error: 'Authorization token missing or malformed' });
        }

        // Extract the token from the header
        const token = authHeader.split(' ')[1];

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user by ID
        const user = await UserModel.findOne({ _id: decoded._id });
        if (!user) {
            return res.status(401).send({ error: 'Authentication failed, user not found' });
        }

        req.user = user;
        req.token = token;

        next();
    } catch (error) {
        res.status(401).send({ error: 'Something went wrong! Please try again later' });
    }
};
