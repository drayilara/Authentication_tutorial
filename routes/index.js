const router = require('express').Router();
const passport = require('passport');
const genPassword = require('../lib/passwordUtils').genPassword;
const User = require('../config/database');
const isAuth = require('../config/authMiddleware').isAuth;
const isAdmin = require('../config/authMiddleware').isAdmin;





/**
 * -------------- POST ROUTES ----------------
 */

 // TODO
 router.post('/login', passport.authenticate("local", {failureRedirect : "/login-failure", successRedirect : "/protected-route"}));

 // TODO
 router.post('/register', (req, res, next) => {
     let passwordText = req.body.password;
     let username = req.body.username;

     let saltAndHash = genPassword(passwordText)
     let salt = saltAndHash.salt;
     let hash = saltAndHash.hash;

    // payload

    const user = new User({
        username : username,
        salt : salt,
        hash : hash
    })

    User.create(user, function(err){
        if(err) return {err}
        console.log("New user created");
    })
    res.redirect("/login");
 });


 /**
 * -------------- GET ROUTES ----------------
 */

router.get('/', (req, res, next) => {
    res.send('<h1>Home</h1><p>Please <a href="/register">register</a></p>');
});

// When you visit http://localhost:3000/login, you will see "Login Page"
router.get('/login', (req, res, next) => {
   
    const form = '<h1>Login Page</h1><form method="POST" action="/login">\
    Enter Username:<br><input type="text" name="username">\
    <br>Enter Password:<br><input type="password" name="password">\
    <br><br><input type="submit" value="Submit"></form>';

    res.send(form);

});

// When you visit http://localhost:3000/register, you will see "Register Page"
router.get('/register', (req, res, next) => {

    const form = '<h1>Register Page</h1><form method="post" action="register">\
                    Enter Username:<br><input type="text" name="username">\
                    <br>Enter Password:<br><input type="password" name="password">\
                    <br><br><input type="submit" value="Submit"></form>';

    res.send(form);
    
});

/**
 * Lookup how to authenticate users on routes with Local Strategy
 * Google Search: "How to use Express Passport Local Strategy"
 * 
 * Also, look up what behaviour express session has without a maxage set
 */
router.get('/protected-route', isAuth, (req, res, next) => {
    console.log(req.user);
    res.redirect("/admin-route");
});

router.get('/admin-route', isAdmin, (req, res, next) => {
    res.send("welcome admin");
});

// Visiting this route logs the user out
router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/protected-route');
});

router.get('/login-success', (req, res, next) => {
    res.send('<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>');
});

router.get('/login-failure', (req, res, next) => {
    res.send('You entered the wrong password.');
});

module.exports = router;