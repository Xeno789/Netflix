const User = require("../models/user");

module.exports = {
    swaggerSecurityHandlers: {
        Session_key: function (req, authOrSecDef, scopesOrApiKey, callback) {
            if (scopesOrApiKey) {
                User.find({sessionId:scopesOrApiKey})
                .exec()
                .then(users => {
                    if(users.length === 0){
                        callback(new Error('Api key missing or not registered'));
                    }
                    else{
                        callback();   
                    }
                })
                .catch(err => {
                    console.log(err);
                })
            }
            else callback(new Error('Api key missing or not registered'));
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
    