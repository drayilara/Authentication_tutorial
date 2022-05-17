const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const connection = require('./database');
const User = connection.models.User;


const customFields = {
    userNameField : "username",
    passwordField : "password"
}

const verifyCallback =  new LocalStrategy(function(username, password, done){
    User.findOne({username : username}, function(err, user){
        if(err) {return done(err)}

        if(!user) {return done(null, false)}

        if(!user.verifyPassword(password, user.hash, user.salt)) {return done(null, false)}

        return done(null, true);
    })
});


passport.use(verifyCallback, customFields);

module.exports = passport;