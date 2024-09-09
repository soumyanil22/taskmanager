import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    todo: [],
    inProgress: [],
    done: []
};


export const todoSlice = createSlice({
    name: "todo",
    initialState,
    reducers: {
        setTodos: (state, action) => {
            const { type, todos } = action.payload;
            if (type && state[type]) {
                state[type] = todos;
            } else {
                console.error('Invalid type or todos missing');
            }
        },
        updateTodo: (state, action) => {
            const { id, title, description } = action.payload;
            // Update the task in the appropriate array
            [state.todo, state.inProgress, state.done].forEach((list) => {
                const task = list.find((task) => task._id === id);
                if (task) {
                    task.title = title;
                    task.description = description;
                }
            });
        },
    },
});

export const { setTodos, updateTodo } = todoSlice.actions;
export default todoSlice.reducer;