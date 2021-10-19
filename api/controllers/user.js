'use strict';
const mongoose = require('mongoose');
const User = require('../models/user');


function createUser(req, res) {
    let body = req.swagger.params.body["value"];
    const user = new User({
        _id : mongoose.Types.ObjectId(),
        username: body.username,
        password: body.password,
        sessionId: null,
        queue: []
        });
    user.save().then(result => {
        res.json(user);
    })
    .catch(err => {
        res.json({"error": "username already in use"});
    })
}
function logoutUser(req, res) {
    User.find({sessionId:req.headers.session_key})
    .exec()
    .then(async(users) => {
        if(users.length === 0){
            res.json({"message": "Logout failed, Invalid session ID"});
        }
        await User.updateOne({sessionId: users[0].sessionId},{sessionId : null});
        res.json({"message": "Successful logout"});
    })
    .catch(err => {
        res.json({"error": err});
    })
}
function loginUser(req, res) {
    let body = req.swagger.params.user["value"];
    User.find({username: body.username, password: body.password})
    .exec()
    .then(async(users) => {
        if(users.length === 0){
            res.json({"message": "Invalid username/password"});
        }
        let randomNumber = Math.floor(Math.random() * 100);
        await User.updateOne({username: users[0].username},{sessionId : randomNumber});
        res.json({"message": "Successful login", "session_key": randomNumber});
    })
    .catch(err => {
        res.json({"error": err});
    });
}

module.exports = {
    createUser: createUser,
    logoutUser: logoutUser,
    loginUser: loginUser,
};