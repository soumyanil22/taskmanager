const { createTodo, getTodo, getTodos, deleteTodo, updateTodo } = require('../services/todoService');
const router = require('express').Router();

router.get('/all', async (req, res) => {
    try {
        const userId = req.user._id;
        const todos = await getTodos(_id);
        res.status(200).json(todos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

router.post('/create', async (req, res) => {
    try {
        const { title, description, status, user } = req.body;
        const newTodo = await createTodo(title, description, status, user);
        res.status(201).json(newTodo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

router.patch('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status } = req.body;
        const updatedTodo = await updateTodo(id, title, description, status);
        res.status(200).json(updatedTodo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await getTodo(id);
        res.status(200).json(todo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTodo = await deleteTodo(id);
        res.status(200).json(deletedTodo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

module.exports = router