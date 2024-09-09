// a middleware that checks if the user is authenticated

const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('https://sparkling-douhua-a6483b.netlify.app/login');
};

module.exports = ensureAuthenticated;
