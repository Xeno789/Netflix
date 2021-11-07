const request = require('request');
const hostname = "db-api";
module.exports = {
    swaggerSecurityHandlers: {
        Session_key: function (req, authOrSecDef, scopesOrApiKey, callback) {
			console.log("scope or api key" + scopesOrApiKey);
            request.get({url:`http://${hostname}:3000/api/v1/User`}, async function(err, httpResponse, body){
                if (!err && httpResponse.statusCode == 200){
                    const json = JSON.parse(body);
                    const response = json.find((user) => user.sessionId == scopesOrApiKey);
                    if (response != undefined){
                        callback();
                    }
                    else {
                        callback(new Error('Api key missing or not registered4'));
                    }
                }
				else callback(new Error(err + httpResponse.statusCode));
            })
        },
        X_Admin_API_key: function(req, authOrSecDef, scopesOrApiKey, callback){
			console.log(scopesOrApiKey);
            if (scopesOrApiKey){
                if (scopesOrApiKey === "42") callback();
                else callback(new Error('Api key missing or not registeredd'));
            }
            else callback(new Error('Api key missing or not registereddd'));
        }
    }
};
    