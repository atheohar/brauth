var crypto = require('crypto');

/* The SessionsDAO must be constructed with a connected database object */
function Sessions(db, applicationId, applicationCode, brAuthUrl) {
    "use strict";

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof Sessions)) {
        console.log('Warning: SessionsDAO constructor called without "new" operator');
        return new Sessions(db);
    }

    var sessions = db.collection("sessions");

    this.startSession = function(username, authenticationCode, expiryDate, userRole, callback) {
        "use strict";

        var session_id = crypto.createHash('md5').update(authenticationCode + ":" +
            expiryDate + ":" + applicationCode).digest('hex');

        // Create session document
        var session = {'username': username, '_id': session_id, expiryDate: expiryDate, userRole:userRole}

        // Insert session document
        sessions.insert(session, function (err, result) {
            "use strict";
            callback(err, session_id);
        });
    }

    this.endSession = function(session_id, callback) {
        "use strict";
        // Remove session document
        sessions.remove({ '_id' : session_id }, function (err, numRemoved) {
            "use strict";
            callback(err);
        });
    }
    this.getSession = function(session_id, callback) {
        "use strict";

        if (!session_id) {
            callback(Error("Session not set"), null);
            return;
        }

        sessions.findOne({ '_id' : session_id }, function(err, session) {
            "use strict";

            if (err) return callback(err, null);

            if (!session) {
                callback(new Error("Session: " + session + " does not exist"), null);
                return;
            }

            callback(null, session);
        });
    }
}

module.exports.Sessions = Sessions;
