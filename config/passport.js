const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./database');
const validatePassword = require("../lib/passwordUtils").validatePassword;



/*
Here we use passport local strategy to search our users collection,and authenticate the user.
*/


// create custom fields to match field in db
const customFields = {
    userNameField : "username",
    passwordField : "password"
}

// This is the function that actually does the db user verfication
const verifyCallback = function(username, password, done){
    User.findOne({username : username}, function(err, user){

        if(err) {return done(err)}

        if(!user) {return done(null, false)}

        if(!validatePassword(password, user.hash, user.salt))  {return done(null, false)}

        return done(null, user);
    })
};

// Mount the verification on a local constructor
const strategy = new LocalStrategy(customFields, verifyCallback);

// Passport now uses this whole logic to authentocate users.
passport.use(strategy);

/*
Serialize/deserialise
When passport authenticates with verifyCallback.It passes the authenticated user object to a session middleware called --->serializeUser
This takes a part of the user(usually Id),and uses it to generate a session for the user.This session also creates a cookie for the user.
To view protected routes ----> session middleware calls the deserialise function which gets the user id from the session.
It searches the db for this id,and if found,it means the user exists,and the user is authorised
*/

passport.serializeUser(function(user, done){
    done(null, user._id);
});

passport.deserializeUser( async function(userId, done){
    try{
        await User.findById(userId, function(err, user){
            if(err) return {err};
            done(null, user);
        })
    }catch(err){
        return {err}
    }
    
})




// Export the configured passport,and mount it on app @ app.js
module.exports = passport;