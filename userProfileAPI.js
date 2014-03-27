var Sessions = require('./sessions').Sessions,
    BrAuthClient = require('node-rest-client').Client,
    FormData = require('form-data'),
    request = require('request'),
    fs = require('fs');

function UserProfileAPI(db, applicationId, applicationCode, brAuthUrl) {
    "use strict";

    var sessions = new Sessions(db);

    this.GetUserProfile = function(sessionId, callback) {
        "use strict";

        var brAuthClient = new BrAuthClient();

        sessions.getSession(sessionId, function(err, session) {
            "use strict";

            if (!err && session.username && session.expiryDate) {

                var authenticationToken = sessionId + "|" + session.username + "|" + session.expiryDate + "|" +
                    session.expiryDate + "|" + applicationId

                var args = {
                    headers:{"X-Auth-Token":authenticationToken,"Content-Type": "application/json"}
                };

                brAuthClient.get(brAuthUrl + "user/profile", args, function(data,response) {

                    if(response.statusCode != 200){
                        var error = new Error(data.error);
                        callback(error,null);
                        return;
                    }

                    callback(error,data);

                });

            } else {
                var error = new Error("Session expired");
                callback(error,null);
                return;
            }

        });
    }

    this.UserProfileUpdate = function(sessionId, firstName, lastName, phoneNumber, dateOfBirth,
                                            placeOfBirth, maritalStatus, gender, addressLine1, addressLine2,
                                            county, town, postCode, callback) {
        "use strict";

        var brAuthClient = new BrAuthClient();

        var data = {};

        if(firstName != ""){
            data['firstName'] = firstName;
        }
        if(lastName != ""){
            data['lastName'] = lastName;
        }
        if(phoneNumber != ""){
            data['phoneNumber'] = phoneNumber;
        }
        if(dateOfBirth != ""){
            data['dateOfBirth'] = dateOfBirth;
        }
        if(placeOfBirth != ""){
            data['placeOfBirth'] = placeOfBirth;
        }
        if(maritalStatus != ""){
            data['maritalStatus'] = maritalStatus;
        }

        if(gender != ""){
            data['gender'] = gender;
        }

        if(addressLine1 != "" || addressLine2 != "" || county != "" ||
            town != "" || postCode != ""){
            data['address'] = {};
        }

        if(addressLine1 != ""){
            data.address['addressLine1'] = addressLine1;
        }
        if(addressLine2 != ""){
            data.address['addressLine2'] = addressLine2;
        }
        if(county != ""){
            data.address['county'] = county;
        }
        if(town != ""){
            data.address['town'] = town;
        }
        if(postCode != ""){
            data.address['postCode'] = postCode;
        }

        sessions.getSession(sessionId, function(err, session) {
            "use strict";

            if (!err && session.username && session.expiryDate) {

                var authenticationToken = sessionId + "|" + session.username + "|" + session.expiryDate + "|" +
                    session.expiryDate + "|" + applicationId

                var args = {
                    data:data,
                    headers:{"X-Auth-Token":authenticationToken,"Content-Type": "application/json"}
                };

                brAuthClient.post(brAuthUrl + "user/profile/update", args, function(data,response) {

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

    this.GetUserProfileImage = function(sessionId, callback) {
        "use strict";

        var brAuthClient = new BrAuthClient();

        sessions.getSession(sessionId, function(err, session) {
            "use strict";

            if (!err && session.username && session.expiryDate) {

                var args = {
                    headers:{"Content-Type": "application/json"}
                };

                var url = brAuthUrl + "user/profile/image/" + session.username;
                callback(null, {url:url});

            } else {
                var error = new Error("Session expired");
                callback(err, null);
            }

        });
    }

    this.UserProfileImageUpdate = function(sessionId, filePath, callback) {
        "use strict";

        sessions.getSession(sessionId, function(err, session) {
            "use strict";

            if (!err && session.username && session.expiryDate) {

                var authenticationToken = sessionId + "|" + session.username + "|" + session.expiryDate + "|" +
                    session.expiryDate + "|" + applicationId

                var form = new FormData();

                fs.exists(filePath, function(exists) {
                    if (exists) {
                        form.append('file', fs.createReadStream(filePath));

                        form.getLength(function(err,length){
                            var r = request.post(brAuthUrl + "user/profile/image/update", {
                                headers: {
                                    "X-Auth-Token":authenticationToken,"Content-Type": "application/json" ,
                                    'content-length': length
                                }
                            }, function(err, response, body){
                                if(response.statusCode != 200 || err){
                                    callback(err,null);
                                    return;
                                }

                                var url = brAuthUrl + "user/profile/image/" + session.username;
                                callback(null,{url:url});
                                return;
                            });
                            r._form = form;
                        });
                    } else {
                        var error = new Error("File not found");
                        callback(error,null);
                        return;
                    }
                });

            } else {
                var error = new Error("Session expired");
                callback(error,null);
                return;
            }

        });
    }
}

module.exports.UserProfileAPI = UserProfileAPI;
