const express = require('express');
const router = express.Router();
const { registerUser } = require('../services/userService');
const passport = require('passport');
const ensureAuthenticated = require('../middlewares/Authentication');

router.post('/login', passport.authenticate('local', { session: true, keepSessionInfo: true, failureRedirect: '/login', failureMessage: true }), (req, res) => {
    res.status(200).json({ authenticated: true, user: req.user });
})

router.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed' });
        }
        req.session.destroy(); // Destroy the session
        res.clearCookie('connect.sid'); // Clear the session cookie
        res.status(200).json({ message: 'Logged out successfully' });
    });
});

router.post('/register', async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;
        const newUser = await registerUser(firstname, lastname, email, password);

        res.status(201).json({ message: 'user created successfully!', user: newUser });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

router.get('/login/google', passport.authenticate('google', { session: true, keepSessionInfo: true, scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    res.send(`<script>
       window.opener.postMessage({ authenticated: true, user: ${JSON.stringify(req.user)} }, 'https://sparkling-douhua-a6483b.netlify.app/');
        window.close();
      </script>`);
});

router.get('/check-session', ensureAuthenticated, (req, res) => {
    const user = {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email
    };
    res.status(200).json({ authenticated: true, user });
});

module.exports = router