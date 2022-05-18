require('dotenv').config();

const mongoose = require('mongoose');

/**
 * -------------- DATABASE ----------------
 */

/**
 * Connect to MongoDB Server using the connection string in the `.env` file.  To implement this, place the following
 * string into the `.env` file
 * 
 * DB_STRING=mongodb://<user>:<password>@localhost:27017/database_name
 */ 
connectToDB();

async function connectToDB(){
    try{
        await mongoose.connect('mongodb://localhost:27017/passport_tutorial_db', { useNewUrlParser: true, useUnifiedTopology: true });
    }catch(err){
        console.log(err.message);
    }
}

const userSchema = new mongoose.Schema({
    username : String,
    salt : String,
    hash : String
});


const User = mongoose.model("User", userSchema);

module.exports = User;


