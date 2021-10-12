'use strict';

class User {
    constructor(id, username, password) {
        this.username = username;
        this.password = password;
        this.ID = id;
        this.SessionID = undefined;
        this.queue = [];
    }
  
    getUsername() {
        return this.DESCR;
    }
  
    getPassword() {
        return this.DURATION;
    }
  
    getId() {
        return this.ID;
    }
    addToQueue(video){
        this.queue.push(video);
    }
    getQueue(){
        return this.queue;
    }
}

class UserRepository {
    constructor(){
        this.users = [];
        this.activeSessionIds = [];
    }
    getUsers(){
        return this.users;
    }
    getUserBySessionId(sessionID){
        return this.users.filter(user => user.sessionID == sessionID)[0];
    }
    getActiveSessionIds(){
        return this.activeSessionIds;
    }
    addActiveSessionId(sessionId){
        this.activeSessionIds.push(sessionId);
    }
    deleteActiveSessionId(sessionId){
        let index = this.activeSessionIds.findIndex(id => id == sessionId);
        this.activeSessionIds.splice(index, 1);
    }
    add(user){
        this.users.push(user);
    }
    delete(id){
        for(i in this.users){
            if(users[i].id == id){
                this.users.splice(i);
            }
        }
    }
    update(user){
        for(i in this.users){
            if(users[i].id == user.id){
                this.users.splice(i);
                if(user.username != undefined){
                    users[i].username = user.username;
                }
                if(user.password != undefined){
                    users[i].password = user.password;
                }
            }
        }
    }
}
let userRepo = new UserRepository();
module.exports = {
    userRepo: userRepo,
    createUser: createUser,
    logoutUser: logoutUser,
    loginUser: loginUser,
};

function createUser(req, res) {
    let body = req.swagger.params.body["value"];
    let user = new User(body.id, body.username, body.password);
    userRepo.add(user);
    res.json(user);
}
function logoutUser(req, res) {
    let response;
    let user = userRepo.getUserBySessionId(parseInt(req.swagger.params.sessionId.value));
    if(user == undefined){
        response = ({"message":"Logout failed, Invalid session ID"})
    }
    else{
        userRepo.deleteActiveSessionId(user.sessionID);
        user.sessionID = undefined;
        response = {"message": "Successful logout"};
    }
    res.json(response);
}
function loginUser(req, res) {
    let foundMatch = false;
    let body = req.swagger.params.user["value"];
    for(let i in userRepo.users){
        let current = userRepo.users[i];
        if(current.username == body.username && current.password == body.password){
            current.sessionID = Math.floor(Math.random() * 100)
            userRepo.addActiveSessionId(current.sessionID);
            foundMatch = true;
            res.json({"message": "Successful login", "session_key": current.sessionID})
        }
    }
    if(!foundMatch){
        res.json({"message": "Invalid username/password"});
    }
}