/**
 * Created by antonis on 27/03/2014.
 */

var ApplicationAPI = require('./applicationAPI').ApplicationAPI;
var UserAPI = require('./userAPI').UserAPI;
var UserProfileAPI = require('./userProfileAPI').UserProfileAPI;

function BrAuthAPI(db, applicationId, applicationCode, brAuthUrl) {
    "use strict";

    this.ApplicationAPI = new ApplicationAPI(db, applicationId, applicationCode, brAuthUrl);
    this.UserAPI = new UserAPI(db, applicationId, applicationCode, brAuthUrl);
    this.UserProfileAPI = new UserProfileAPI(db, applicationId, applicationCode, brAuthUrl);
}

exports.BrAuthAPI = BrAuthAPI;
