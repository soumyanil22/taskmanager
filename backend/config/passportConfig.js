const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const UserModel = require("../models/User");
const bcrypt = require("bcrypt");

passport.use(
    new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
        try {
            const user = await UserModel.findOne({ email });
            if (!user) {
                return done(null, false, { message: "User not found" });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return done(null, false, { message: "Incorrect password" });
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    })
);

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: 'https://taskmanager-r2ct.onrender.com/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if the user already exists
                let user = await UserModel.findOne({ googleId: profile.id });

                if (!user) {
                    // Create a new user if it doesn't exist
                    user = await UserModel.create({
                        googleId: profile.id,
                        firstname: profile.name.givenName,
                        lastname: profile.name.familyName,
                        email: profile.emails[0].value,
                        provider: 'google'
                    });
                }

                done(null, user);
            } catch (err) {
                done(err, null);
            }
        }
    )
);



passport.serializeUser((user, done) => {
    done(null, user._id);
});


passport.deserializeUser(async (id, done) => {
    try {
        const user = await UserModel.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
})


module.exports = passport;