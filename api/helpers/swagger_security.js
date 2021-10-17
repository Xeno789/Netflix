let userRepo = require("../controllers/user").userRepo;
module.exports = {
    swaggerSecurityHandlers: {
        Session_key: function (req, authOrSecDef, scopesOrApiKey, callback) {
            if (scopesOrApiKey) {
                let activeSessionIds = userRepo.getActiveSessionIds();
                if (activeSessionIds.includes(parseInt(scopesOrApiKey))) callback();
                else callback(new Error('Api key missing or not registered'));
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
    