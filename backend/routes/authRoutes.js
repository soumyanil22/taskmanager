const express = require('express');
const router = express.Router();
const { registerUser } = require('../services/userService');
const passport = require('passport');

router.post('/login', passport.authenticate('local', { session: true, keepSessionInfo: true, failureRedirect: '/login', failureMessage: true }), (req, res) => {
    res.status(200).json({ authenticated: true, user: req.user });
})

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

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    res.status(200).json({ authenticated: true, user: req.user });
});

router.get('/auth/check-session', (req, res) => {
    if (req.isAuthenticated()) {
        const user = {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email
        };
        res.status(200).json({ authenticated: true, user });
    } else {
        res.status(401).json({ authenticated: false, message: 'User not authenticated' });
    }
});

module.exports = router