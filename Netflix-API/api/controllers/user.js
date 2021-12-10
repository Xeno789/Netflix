`use strict`;
const request = require(`request`);
const hostname = "db-api";
function createUser(req, res) {
    const reqBody = req.swagger.params.body["value"];
    if(Object.keys(reqBody).length === 0){
        res.json({"error":"no parameters"});
        return;
    }
    request.post({url:`http://${hostname}:3001/api/v1/User`, json:{username: reqBody.username, password: reqBody.password}}, function(err, httpResponse, body){
		console.log(`err:${err}`);
        if (!err){
            res.json(body);
            request.post({url:`http://kong-api:8001/consumers/`, json:{username: body.username}}, function(err, httpResponse, body){
                if (!err){
                    console.log("Consumer created");
                    request.post({url:`http://kong-api:8001/consumers/${reqBody.username}/acls`, json:{group: "user", tags: ["user"]}}, function(err, httpResponse, body){
                        if (!err){
                            console.log("Consumer acl group set.");
                        }
                        else{
                            console.log(`Something went wrong setting the consumer's acl err:${err}`);
                        }
                    });
                }
                else{
                    console.log(`Something went wrong creating the consumer err:${err}`);
                }
            });
            return;
        }
        res.json({"error":"Username already exists."});
    });
}
function logoutUser(req, res) {
    request.delete({url:`http://kong-api:8001/consumers/${req.get('X-consumer-username')}/key-auth/${req.headers.apikey}`}, function(err, httpResponse, body){
        if (!err){
            res.json({"message": "Successful logout"});
            console.log("Consumer key deleted");
        }
        else{
            res.json({"error": err});
            console.log(`Something went wrong deleting the consumer key err:${err}`);
        }
    });
    return;
}

function loginUser(req, res) {
    request.get({url:`http://${hostname}:3001/api/v1/User`}, async function(err, httpResponse, body){
        if (!err){
            const apiRequestBody = req.swagger.params.user["value"];
            const json = JSON.parse(body);
            
            const response = json.find((user) => user.username === apiRequestBody.username && user.password === apiRequestBody.password);
            if(response === undefined){
                res.json({"error":"Invalid username/password"});
                return;
            }

            let randomNumber = Math.floor(Math.random() * 100);
            request.post({url:`http://kong-api:8001/consumers/${apiRequestBody.username}/key-auth/`, json:{key: randomNumber.toString()}}, function(err, httpResponse, body){
                if (!err){
                    res.json({"message": "Successful login", "session_key": randomNumber});
                    console.log("Consumer key-auth created");
                }
                else{
                    console.log(`Something went wrong creating the consumer key-auth err:${err}`);
                    res.json({"error":err});
                }
            });
        }
    });
}

function deleteUserByUsername(req, res){
    request.get({url:`http://${hostname}:3001/api/v1/User`}, async function(err, httpResponse, body){
        if (!err){
            const json = JSON.parse(body);
            const userResponse = json.find((user) => user.username == req.swagger.params.username.value);
            if(userResponse === undefined){
                res.json({"error": "User not found"});
                return;
            }
            request.delete({url:`http://${hostname}:3001/api/v1/User/${userResponse._id}`},async function(err, httpResponse, body){
                if (!err){
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