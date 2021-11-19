`use strict`;
const request = require(`request`);
const hostname = "db-api";
function createUser(req, res) {
    let body = req.swagger.params.body["value"];
	console.log(`body:${body}`);
    if(Object.keys(body).length === 0){
        res.json({"error":"no parameters"});
        return;
    }
    request.post({url:`http://${hostname}:3001/api/v1/User`, json:{username: body.username, password: body.password}}, function(err, httpResponse, body){
		console.log(`err:${err}`);
        if (!err && httpResponse.statusCode == 201){
            res.json(body);
            request.post({url:`http://kong-api:81/consumers/`, json:{username: body.username}}, function(err, httpResponse, body){
                if (!err && httpResponse.statusCode == 201){
                    console.log("Consumer created");
                }
                else{
                    console.log("Something went wrong creating the consumer");
                }
            });
            return;
        }
        res.json({"error":"Username already exists."});
    });
}
function logoutUser(req, res) {
    request.get({url:`http://${hostname}:3001/api/v1/User`}, async function(err, httpResponse, body){
        if (!err && httpResponse.statusCode == 200){
            const json = JSON.parse(body);
            const response = json.find((user) => user.sessionId == req.headers.session_key);

            const url = `http://${hostname}:3001/api/v1/User/${response._id}`;
            request.patch({url: url, json:{"sessionId": null}},function(err, httpResponse, body){
                if (!err && httpResponse.statusCode == 200){
                    res.json({"message": "Successful logout"});
                    request.delete({url:`http://kong-api:81/consumers/${response.username}/key-auth/${response.username}`}, function(err, httpResponse, body){
                        if (!err && httpResponse.statusCode == 201){
                            console.log("Consumer key deleted");
                        }
                        else{
                            console.log("Something went wrong deleting the consumer key");
                        }
                    });
                    return;
                }
                res.json({"message": "Unexpected error"});
                return;
            });
        }
    });
}

function loginUser(req, res) {
    request.get({url:`http://${hostname}:3001/api/v1/User`}, async function(err, httpResponse, body){
        if (!err && httpResponse.statusCode == 200){
            const apiRequestBody = req.swagger.params.user["value"];
            const json = JSON.parse(body);
            
            const response = json.find((user) => user.username === apiRequestBody.username && user.password === apiRequestBody.password);
            if(response === undefined){
                res.json({"error":"Invalid username/password"});
                return;
            }

            let randomNumber = Math.floor(Math.random() * 100);
            const url = `http://${hostname}:3001/api/v1/User/${response._id}`;
            request.patch({url: url, json:{"sessionId": randomNumber}},function(err, httpResponse, body){
                if (!err && httpResponse.statusCode == 200){
                    res.json({"message": "Successful login", "session_key": randomNumber});
                    request.post({url:`http://kong-api:81/consumers/${body.username}/key-auth/`, headers:{key: randomNumber}}, function(err, httpResponse, body){
                        if (!err && httpResponse.statusCode == 201){
                            console.log("Consumer key-auth created");
                        }
                        else{
                            console.log("Something went wrong creating the consumer key-auth");
                        }
                    });
                    return;
                }
                res.json({"error":"Unexpected error"});
                return;
            });
        }
    });
}

function deleteUserByUsername(req, res){
    request.get({url:`http://${hostname}:3001/api/v1/User`}, async function(err, httpResponse, body){
        if (!err && httpResponse.statusCode == 200){
            const json = JSON.parse(body);
            const userResponse = json.find((user) => user.username == req.swagger.params.username.value);
            if(userResponse === undefined){
                res.json({"error": "User not found"});
                return;
            }
            request.delete({url:`http://${hostname}:3001/api/v1/User/${userResponse._id}`},async function(err, httpResponse, body){
                if (!err && httpResponse.statusCode == 204){
                    res.json({"message": "User deleted"});
                    return;
                }
            });
        }
        else{
            res.json({"error": "Unexpected error"});
            return;
        }
    })
}

module.exports = {
    createUser: createUser,
    logoutUser: logoutUser,
    loginUser: loginUser,
    deleteUserByUsername: deleteUserByUsername
};