'use strict';
const request = require('request');

function createUser(req, res) {
    let body = req.swagger.params.body["value"];
    if(Object.keys(body).length === 0){
        res.json({"error":"no parameters"});
        return;
    }
    request.post({url:'http://localhost:10010/api/v1/User', json:{username: body.username, password: body.password}}, function(err, httpResponse, body){
        if (!err && httpResponse.statusCode == 201){
            res.json(body);
            return;
        }
        res.json({"error":"Username already exists."});
    });
}
function logoutUser(req, res) {
    request.get({url:'http://localhost:10010/api/v1/User'}, async function(err, httpResponse, body){
        if (!err && httpResponse.statusCode == 200){
            const json = JSON.parse(body);
            const response = json.find((user) => user.sessionId == req.headers.session_key);

            const url = `http://localhost:10010/api/v1/User/${response._id}`;
            request.patch({url: url, json:{"sessionId": null}},function(err, httpResponse, body){
                if (!err && httpResponse.statusCode == 200){
                    res.json({"message": "Successful logout"});
                    return;
                }
                res.json({"message": "Unexpected error"});
                return;
            });
        }
    });
}

function loginUser(req, res) {
    request.get({url:'http://localhost:10010/api/v1/User'}, async function(err, httpResponse, body){
        if (!err && httpResponse.statusCode == 200){
            const apiRequestBody = req.swagger.params.user["value"];
            const json = JSON.parse(body);
            
            const response = json.find((user) => user.username === apiRequestBody.username && user.password === apiRequestBody.password);
            if(response === undefined){
                res.json({"error":"Invalid username/password"});
                return;
            }

            let randomNumber = Math.floor(Math.random() * 100);
            const url = `http://localhost:10010/api/v1/User/${response._id}`;
            console.log(url);
            request.patch({url: url, json:{"sessionId": randomNumber}},function(err, httpResponse, body){
                if (!err && httpResponse.statusCode == 200){
                    res.json({"message": "Successful login", "session_key": randomNumber});
                    return;
                }
                res.json({"error":"Unexpected error"});
                return;
            });
        }
    });
}

module.exports = {
    createUser: createUser,
    logoutUser: logoutUser,
    loginUser: loginUser,
};