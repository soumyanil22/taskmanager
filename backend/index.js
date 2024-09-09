const express = require("express");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const RedisStore = require('connect-redis').default;
const { createClient } = require('redis');
const ensureAuthenticated = require("./middlewares/Authentication");
const connection = require("./config/db");
require("dotenv").config();

// Passport config
require('./config/passportConfig');

const redisClient = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: 'redis-15090.c15.us-east-1-2.ec2.redns.redis-cloud.com',
        port: 15090
    }
});

redisClient.connect().catch(console.error)

const app = express();
app.use(cors({
    origin: ["http://localhost:5173,", "https://sparkling-douhua-a6483b.netlify.app"],
    credentials: true
}));
app.use(express.json());
app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: 'None',
        secure: process.env.PRODUCTION === true,
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
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