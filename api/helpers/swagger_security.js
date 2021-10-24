const request = require('request');

module.exports = {
    swaggerSecurityHandlers: {
        Session_key: function (req, authOrSecDef, scopesOrApiKey, callback) {
            request.get({url:'http://localhost:10010/api/v1/User'}, async function(err, httpResponse, body){
                if (!err && httpResponse.statusCode == 200){
                    const json = JSON.parse(body);
                    const response = json.find((user) => user.sessionId == scopesOrApiKey);
                    if (response != undefined){
                        callback();
                    }
                    else {
                        callback(new Error('Api key missing or not registered'));
                    }
                }
            })
        },
        X_Admin_API_key: function(req, authOrSecDef, scopesOrApiKey, callback){
            if (scopesOrApiKey){
                if (scopesOrApiKey === "42") callback();
                else callback(new Error('Api key missing or not registered'));
            }
            else callback(new Error('Api key missing or not registered'));
        }
    }
};
    