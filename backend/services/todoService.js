const todoModel = require('../models/Todo');
const userModel = require('../models/User');



const createTodo = async (title, description, status, user) => {
    try {
        const newTodo = new todoModel({
            title,
            description,
            status,
            user
        });
        await newTodo.save();
        return newTodo;
    } catch (error) {
        throw new Error(error);
    }
}

const getTodo = async (id) => {
    try {
        const todo = await todoModel.findById(id);
        return todo;
    } catch (error) {
        throw new Error(error);
    }
}

const getTodos = async (id) => {
    try {
        const todos = await todoModel.find({ user: id });
        return todos;
    } catch (error) {
        throw new Error(error);
    }
}

const deleteTodo = async (id) => {
    try {
        const deletedTodo = await todoModel.deleteOne({ _id: id });
        return deletedTodo;
    } catch (error) {
        throw new Error(error);
    }
}

const updateTodo = async (id, title, description, status) => {
    try {
        const updatedTodo = await todoModel.updateOne({ _id: id }, { $set: { title, description, status } });
        return updatedTodo;
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = {
    createTodo,
    getTodo,
    getTodos,
    deleteTodo,
    updateTodo
}