const { Router: router } = require('express');
const { loginUser, registerUser } = require('../services/userService');
const { Passport } = require('passport');

router.post('/login', Passport.authenticate('local', { failureRedirect: '/login' }), (req, res) => {
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

router.get('/login/google', Passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('auth/google/callback', Passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('/dashboard');
});

module.exports = router