const { Router: router } = require('express');
const { loginUser, registerUser } = require('../services/userService');

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await loginUser(email, password);

        res.status(201).json({ message: 'user logged successfully!', user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
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