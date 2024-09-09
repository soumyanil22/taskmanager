const express = require("express");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const ensureAuthenticated = require("./middlewares/Authentication");
const connection = require("./config/db");
require("dotenv").config();

// Passport config
require('./config/passportConfig');

const app = express();
app.use(cors({ origin: ["http://localhost:5173,", "https://sparkling-douhua-a6483b.netlify.app"], credentials: true }));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false, cookie: {
        httpOnly: true, // Prevents client-side JS from accessing the cookie
        sameSite: 'none',
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 // Session expires after 24 hours
    }
}));
app.use(passport.initialize());
app.use(passport.session());

const authRoutes = require("./routes/authRoutes");
const todoRoutes = require("./routes/todoRoutes");

app.use("/todos", ensureAuthenticated, todoRoutes);
app.use("/auth", authRoutes);

app.listen(process.env.PORT || 5000, async () => {
    try {
        await connection();
        console.log(`Server is running on port ${process.env.PORT} 🚀`);
    } catch (error) {
        console.log(error);
    }
})