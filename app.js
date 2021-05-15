//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require("mongoose-encryption");


mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true});

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


userSchema.plugin( encrypt, {secret: process.env.SECRET, encryptedFields: ["password"] } );

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res){
    res.render("home");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save(function(err){
        if(!err){
            res.render("secrets");
        }else{
            console.log(err);
        };
    });
});

app.post("/login", function(req, res){
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email: username}, function(err, foundUser){
        if(!err){
            if(foundUser){
                if(foundUser.password === password){
                    res.render("secrets");
                }else{
                    res.send("Incorrect password!")
                }
            }else{
                res.send("Username does not exist!");
            }
        }else {
            console.log(err);
        } 
    });
});

// app.get("/secrets", function(req, res){
//     res.render("secrets");
// });

app.get("/submit", function(req, res){
    res.render("submit");
});

app.listen(3000, function() {
    console.log("Server started on port 3000");
  });