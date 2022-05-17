require('dotenv').config();
// passport was here
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
// var passport = require('passport');
const crypto = require('crypto');
const routes = require('./routes');
const connection = require('./config/database');

// Package documentation - https://www.npmjs.com/package/connect-mongo
const MongoStore = require('connect-mongo')

// Need to require the entire Passport config module so app.js knows about it
const passport = require('./config/passport');

/**
 * -------------- GENERAL SETUP ----------------
 */

// Create the Express application
var app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));


/**
 * -------------- SESSION SETUP ----------------
 */

// TODO


app.use(session({
    secret : process.env.SECRET,
    store : MongoStore.create({mongoUrl : "mongodb://localhost:27017/passport_tutorial_db", autoRemove : "native"}),
    resave : false,
    saveUninitialized : true,
    cookie : { maxAge : 1000 * 60 * 60 * 24}
}))


/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */

app.use(passport.initialize());





app.use(passport.session());


/**
 * -------------- ROUTES ----------------
 */

// Imports all of the routes from ./routes/index.js
app.use(routes);


/**
 * -------------- SERVER ----------------
 */

// Server listens on http://localhost:3000

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})