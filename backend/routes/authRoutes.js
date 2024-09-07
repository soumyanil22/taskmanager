const express = require('express');
const router = express.Router();
const { registerUser } = require('../services/userService');
const passport = require('passport');

router.post('/login', passport.authenticate('local', { session: true, keepSessionInfo: true, failureRedirect: '/login', failureMessage: true }), (req, res) => {
    res.redirect('/dashboard');
})

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const newUser = await registerUser(name, email, password);

        res.status(201).json({ message: 'user created successfully!', user: newUser });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

router.get('/login/google', passport.authenticate('google', { session: true, keepSessionInfo: true, scope: ['profile', 'email'] }));

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('/dashboard');
});

module.exports = router