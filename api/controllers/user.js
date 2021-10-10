'use strict';
class User {
    constructor(id, username, password) {
        this.username = username;
        this.password = password;
        this.ID = id;
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
}

class UserRepository {
    constructor(){
        this.users = [];
    }
    getAll(){
        return this.users;
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
  createUser: createUser,
  logoutUser: logoutUser,
  loginUser: loginUser
};

function createUser(req, res) {
  var body = req.swagger.params.body["value"] || 'stranger';
  var user = new User(body.id,body.username,body.password);
  userRepo.add(user);
  res.json(user);
}

function logoutUser(req, res) {
    res.json({"message": "kutya"});
}

function loginUser(req, res) {
    
    res.json({"message": "kutya"});
}