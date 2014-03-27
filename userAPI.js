var Sessions = require('./sessions').Sessions,
    BrAuthClient = require('node-rest-client').Client;

function UserAPI(db, applicationId, applicationCode, brAuthUrl) {
    "use strict";

    var sessions = new Sessions(db, applicationId, applicationCode);

    this.passwordReset = function(username, email, firstName, lastName, callback){
        var brAuthClient = new BrAuthClient();

        var args = {
            data: { username: username, email: email, firstName: firstName, lastName: lastName },
            headers:{"Content-Type": "application/json"}
        };

        brAuthClient.post(brAuthUrl + "user/password/reset", args, function(data,response) {

            if(response.statusCode != 200){
                var error = new Error(data.error);
                callback(error, null);
                return;
            }

            callback(null, {success:true});

        });
    }

    this.PasswordChangeWithAuthenticationCode = function(username, email, firstName, lastName,
        newPassword, authenticationCode, callback) {
        "use strict";

        var brAuthClient = new BrAuthClient();

        var args = {
            data: { username: username, email: email, firstName: firstName, lastName: lastName,
                newPassword:newPassword, authenticationCode:authenticationCode},
            headers:{"Content-Type": "application/json"}
        };

        brAuthClient.post(brAuthUrl + "/user/password/authentication/code", args, function(data,response) {

            if(response.statusCode != 200){
                var error = new Error(data.error);
                callback(error, null);
                return;
            }

            var authenticationCredentials = data.sessionToken.split("|");

            if(authenticationCredentials.length != 3){
                var error = new Error("Incorrect authentication token");
                callback(error, null);
                return;
            }

            sessions.startSession(authenticationCredentials[1], authenticationCredentials[0], authenticationCredentials[2], data.userRole, function(err, session_id) {
                "use strict";

                if (err) {
                    callback(err, null);
                    return;
                }

                callback(null,{success:true, userRole:data.userRole, sessionId:session_id});

            });

        });
    }

    this.PasswordUpdate = function(sessionId, oldPassword, newPassword, callback) {
        "use strict";

        var brAuthClient = new BrAuthClient();

        sessions.getSession(sessionId, function(err, session) {
            "use strict";

            if (!err && session.username && session.expiryDate) {

                var authenticationToken = sessionId + "|" + session.username + "|" + session.expiryDate + "|" +
                    session.expiryDate + "|" + applicationId

                var args = {
                    data: { password:newPassword, oldPassword:oldPassword},
                    headers:{"X-Auth-Token":authenticationToken,"Content-Type": "application/json"}
                };

                brAuthClient.post(brAuthUrl + "user/password/update", args, function(data,response) {

                    if(response.statusCode != 200){
                        var error = new Error(data.error);
                        callback(error, null);
                        return;
                    }

                    var authenticationCredentials = data.sessionToken.split("|");

                    if(authenticationCredentials.length != 3){
                        var error = new Error("Incorrect authentication token");
                        callback(error, null);
                        return;
                    }

                    sessions.startSession(authenticationCredentials[1], authenticationCredentials[0], authenticationCredentials[2], data.userRole, function(err, sessionId) {
                        "use strict";

                        if (err) {
                            callback(err, null);
                            return;
                        }

                        callback(null, {success:true, userRole:data.userRole, sessionId:sessionId});
                        return;
                    });

                });

            } else {
                var error = new Error("Session expired");
                callback(error, null);
                return;
            }

        });
    }

    this.Login = function(username, password, callback) {
        "use strict";

        var brAuthClient = new BrAuthClient();

        var args = {
            data: { username: username, password: password },
            headers:{"Content-Type": "application/json"}
        };

        brAuthClient.post(brAuthUrl + "login", args, function(data,response) {
            "use strict";
            if(response.statusCode != 200){
                var error = new Error(data.error);
                callback(error, null);
                return;
            }

            var authenticationCredentials = data.sessionToken.split("|");

            if(authenticationCredentials.length != 3){
                var error = new Error("Incorrect authentication token");
                callback(error, null);
                return;
            }

            sessions.startSession(authenticationCredentials[1], authenticationCredentials[0], authenticationCredentials[2], data.userRole, function(err, sessionId) {
                "use strict";

                if (err){
                    callback(err, null);
                    return;
                }

                callback(null, {success:true, userRole:data.userRole, sessionId:sessionId});
                return;
            });
        });
    }

    this.Logout = function(sessionId, callback) {
        "use strict";

        sessions.endSession(sessionId, function (err) {
            "use strict";
            if (err){
                callback(err, null);
                return;
            }
            callback(null, {success:true});
        });
    }

    this.Signup = function(email, username, password, firstName, lastName, callback) {
        "use strict";

        var brAuthClient = new BrAuthClient();

        var args = {
            data: { username: username, password: password, email: email, firstName: firstName, lastName: lastName },
            headers:{"Content-Type": "application/json"}
        };

        brAuthClient.post(brAuthUrl + "register", args, function(data,response) {

            if(response.statusCode != 200){
                var error = new Error(data.error);
                callback(error, null);
                return;
            }

            var authenticationCredentials = data.sessionToken.split("|");

            if(authenticationCredentials.length != 3){
                var error = new Error("Incorrect authentication token");
                callback(error, null);
                return;
            }

            sessions.startSession(authenticationCredentials[1], authenticationCredentials[0], authenticationCredentials[2], data.userRole, function(err, sessionId) {
                "use strict";

                if (err) {
                    callback(err, null);
                    return;
                }

                callback(null, {success:true, userRole:data.userRole, sessionId:sessionId});
                return;
            });
        });
    }

    this.GetLoggedInUser = function(sessionId, callback) {

        var brAuthClient = new BrAuthClient();

        sessions.getSession(sessionId, function(err, session) {
            "use strict";

            if (!err && session.username && session.expiryDate) {

                var authenticationToken = sessionId + "|" + session.username + "|" + session.expiryDate + "|" +
                    session.expiryDate + "|" + applicationId

                var args = {
                    headers:{"X-Auth-Token":authenticationToken}
                };

                brAuthClient.get(brAuthUrl + "user/authenticate", args, function(data,response) {

                    if(response.statusCode == 200 && data.success){
                        callback(null, {username:session.username, userRole:session.userRole, sessionId:sessionId});
                    } else {
                        var error = new Error("User not logged in");
                        callback(error, null);
                        return;
                    }
                });

            } else {
                var error = new Error("Session expired");
                callback(error, null);
                return;
            }

        });
    }

}

module.exports.UserAPI = UserAPI;