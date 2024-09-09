// a middleware that checks if the user is authenticated

const ensureAuthenticated = (req, res, next) => {
    console.log("SESSION =>", req.session);
    console.log("AUTH =>", req.isAuthenticated());
    if (req.isAuthenticated()) {
        return next();
    }

    res.status(401).json({ message: 'Unauthorized' });
};

module.exports = ensureAuthenticated;
