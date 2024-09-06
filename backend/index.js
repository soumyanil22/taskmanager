const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connection = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());
const mongoose = require('mongoose');

app.get("/", async(req, res) => {
    try {
        const todos = mongoose.model('todos').find();
        res.send(todos);
    } catch (error) {
        console.log(error);
    }
});


app.listen(process.env.PORT || 5000, async () => {
    try {
        await connection();
        console.log(`Server is running on port ${process.env.PORT} 🚀`);
    } catch (error) {
        console.log(error);
    }
})