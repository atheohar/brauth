var Sessions = require('./sessions').Sessions,
    BrAuthClient = require('node-rest-client').Client;

function ApplicationAPI(db, currentApplicationId, applicationCode, brAuthUrl) {
    "use strict"

    var sessions = new Sessions(db, currentApplicationId, applicationCode, brAuthUrl);

    this.GetApplications = function(sessionId, callback) {
        "use strict";

        var brAuthClient = new BrAuthClient();

        sessions.getSession(sessionId, function(err, session) {
            "use strict";

            if (!err && session.username && session.expiryDate) {

                var authenticationToken = sessionId + "|" + session.username + "|" + session.expiryDate + "|" +
                    session.expiryDate + "|" + currentApplicationId

                var args = {
                    headers:{"X-Auth-Token":authenticationToken,"Content-Type": "application/json"}
                };

                brAuthClient.get(brAuthUrl + "applications", args, function(data,response) {

                    if(response.statusCode != 200){
                        var error = new Error(data.error);
                        callback(error,null);
                        return;
                    }

                    callback(null,data);
                    return;

                });

            } else {
                var error = new Error("Session expired");
                callback(error,null);
                return;
            }

        });
    }

    this.ApplicationCreate = function(sessionId, applicationId, callback) {
        "use strict";

        var brAuthClient = new BrAuthClient();

        sessions.getSession(sessionId, function(err, session) {
            "use strict";

            if (!err && session.username && session.expiryDate) {

                var authenticationToken = sessionId + "|" + session.username + "|" + session.expiryDate + "|" +
                    session.expiryDate + "|" + currentApplicationId

                var args = {
                    data:{applicationId:applicationId},
                    headers:{"X-Auth-Token":authenticationToken,"Content-Type": "application/json"}
                };

                brAuthClient.post(brAuthUrl + "application/create", args, function(data,response) {

                    if(response.statusCode != 200){
                        var error = new Error(data.error);
                        callback(error,null);
                        return;
                    }

                    callback(null,data);
                    return;

                });

            } else {
                var error = new Error("Session expired");
                callback(error,null);
                return;
            }

        });
    }

    this.ApplicationUpdate = function(sessionId, applicationId, applicationCode, callback) {
        "use strict";

        var brAuthClient = new BrAuthClient();

        if(applicationId == currentApplicationId){
            var error = new Error("Cannot update this application's id");
            callback(error,null);
            return;
        }

        sessions.getSession(sessionId, function(err, session) {
            "use strict";

            if (!err && session.username && session.expiryDate) {

                var authenticationToken = sessionId + "|" + session.username + "|" + session.expiryDate + "|" +
                    session.expiryDate + "|" + currentApplicationId

                var args = {
                    data:{applicationCode:applicationCode},
                    headers:{"X-Auth-Token":authenticationToken,"Content-Type": "application/json"}
                };

                brAuthClient.post(brAuthUrl + "application/" + applicationId + "/update", args, function(data,response) {

                    if(response.statusCode != 200){
                        var error = new Error(data.error);
                        callback(error,null);
                        return;
                    }
                    callback(null,data);
                    return;

                });

            } else {
                var error = new Error("Session expired");
                callback(error,null);
                return;
            }

        });
    }

    this.ApplicationDelete = function(sessionId, applicationId, callback) {
        "use strict";

        var brAuthClient = new BrAuthClient();

        if(applicationId == currentApplicationId){
            var error = new Error("Cannot delete this application's id");
            callback(error,null);
            return;
        }

        sessions.getSession(sessionId, function(err, session) {
            "use strict";

            if (!err && session.username && session.expiryDate) {

                var authenticationToken = sessionId + "|" + session.username + "|" + session.expiryDate + "|" +
                    session.expiryDate + "|" + currentApplicationId

                var args = {
                    headers:{"X-Auth-Token":authenticationToken,"Content-Type": "application/json"}
                };

                brAuthClient.post(brAuthUrl + "application/" + applicationId + "/delete", args, function(data,response) {

                    if(response.statusCode != 200){
                        var error = new Error(data.error);
                        callback(error,null);
                        return;
                    }

                    callback(null,data);
                    return;

                });

            } else {
                var error = new Error("Session expired");
                callback(error,null);
                return;
            }

        });
    }

}

module.exports.ApplicationAPI = ApplicationAPI;