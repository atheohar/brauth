# Brauth

Brauth is a node js module that connects as a client to the Bold Rocket 
centralised authentication system. The module provides an api to register
a user to the authentication system, authenticate a user and manage their
profile across differenet applications. 

Brauth provides around 15 api calls that are split based on their functionality
into [ApplicationAPI], [UserAPI] and [UserProfileAPI]. All these
functions assume you follow the node.js convention of providing a single
callback as the last argument of your function with an error as the first
argument and the data in the second.


## Prerequisites

In order to use the brauth module you will need to pass in a mongodb object
in order to store the sessions in the database, an application id and application
code that need to be requested beforehand so that the Bold Rocket authentication
system recognises the application using its service and finally the Bold rocket 
authentication system url. An example of initializing the module is shown below:

__Arguments__

* db (required) - mongodb instance
* applicationId (required) - application unique identifier
* applicationCode (required) - shared secret with authentication service
* brAuthUrl (required) - authentication service url 

```javascript

var BrAuthAPI = require('brauth').BrAuthAPI;

// function that utilises the module
function client(){
  // db is a mongodb instance
  // appplicationId and applicationCode need to be requested
  // brAuthUrl is the Bold Rocket authentication service url
  var brAuthAPI = new BrAuthAPI(db, applicationId, applicationCode, brAuthUrl);
}
```

## Download

The source is available for download from
[GitHub](https://github.com/atheohar/brauth).
Alternatively, you can install using Node Package Manager (npm):

    npm install brauth

## Documentation

### User API

The user api is accessible by calling brAuthAPI.UserAPI

* [Signup](#Signup)
* [Login](#Login)
* [Logout](#Logout)
* [GetLoggedInUser](#GetLoggedInUser)
* [PasswordUpdate](#PasswordUpdate)
* [PasswordReset](#PasswordReset)
* [PasswordChangeWithAuthenticationCode](#PasswordChangeWithAuthenticationCode)

### User Profile API

The user profile api is accessible by calling brAuthAPI.UserProfileAPI

* [GetUserProfile](#GetUserProfile)
* [UserProfileUpdate](#UserProfileUpdate)
* [GetUserProfileImage](#GetUserProfileImage)
* [UserProfileImageUpdate](#UserProfileImageUpdate)

### Application API

The application api is accessible by calling brAuthAPI.applicationAPI. You will
need to have administrator permission to be able to call these.

* [GetApplications](#GetApplications)
* [ApplicationCreate](#ApplicationCreate)
* [ApplicationUpdate](#ApplicationUpdate)
* [ApplicationDelete](#ApplicationDelete)

## User API

<a name="Signup" />
### UserAPI.Signup(email, username, password, firstName, lastName, callback)

Registers a user to the authentication service.

__Arguments__

* email (required) - The email address for user. The email needs to be unique in the system.
* username (required) - The username for the user. The username needs to be unique in the system.
* password (required) - The password for the user. Needs to contain an uppercase character, 
a number, a special character and it needs to be between 6 and 20 characters.
* firstName (required) - The first name for the user.
* lastName (required) - The last name for the user.
* callback(err, data) - A callback which is called after the user has been registered or an error 
has occurred. The returned data contains the session identifier [sessionId] which is stored in the 
database, the user role [userRole(ADMIN/USER)] and if the call was sucessful [success(true/false)] 

__Example__

```js
  brAuthAPI.UserAPI.Signup(email, username, password, firstName, lastName, function(err,data){
    // handle error
    if(err){
      return next(err);
    }

    // store the session id as a cookie
    res.cookie('session', data.sessionId);

    // return data to the browser
    return res.send({success:data.success, userRole:data.userRole});

  });
```

---------------------------------------

<a name="Login" />
### UserAPI.Login(username, password, callback)

Log in user to the authentication service.

__Arguments__

* username (required) - The username for the user.
* password (required) - The password for the user.
* callback(err, data) - A callback which is called after the user has been logged in or an error 
has occurred. The returned data contains the session identifier [sessionId] which is stored in the 
database, the user role [userRole(ADMIN/USER)] and if the call was sucessful [success(true/false)] 

__Example__

```js
  brAuthAPI.UserAPI.Login(username, password, function(err,data){
    // handle error
    if(err){
      return next(err);
    }

    // store the session id as a cookie
    res.cookie('session', data.sessionId);

    // return data to the browser
    return res.send({success:data.success, userRole:data.userRole});
  });
```

---------------------------------------

<a name="Logout" />
### UserAPI.Logout(sessionId, callback)

Log out user from authentication service.

__Arguments__

* sessionId (required) - The session id that login or register returns.
* callback(err, data) - A callback which is called after the user has been logged out or an error 
has occurred. The returned data contains a success field depending on if the call was sucessful 
[success(true/false)] 

__Example__

```js
  brAuthAPI.UserAPI.Logout(sessionId, function(err,data){
    // handle error
    if(err){
      return next(err);
    }

    // return data to the browser
    return res.send({success:data.success});
  });
```

---------------------------------------

<a name="GetLoggedInUser" />
### UserAPI.GetLoggedInUser(sessionId, callback)

Verifies that the user is logged in and returns the user's username and role.

__Arguments__

* sessionId (required) - The session id that login or register returns.
* callback(err, data) - A callback which is called after the user has been verified or an error 
has occurred. The returned data contains the [username] and user role [userRole]. 

__Example__

```js
  brAuthAPI.UserAPI.GetLoggedInUser(sessionId, function(err,data){
    // handle error
    if(err){
      return next(err);
    }

    var username = data.username;
    var userRole = data.userRole;

    // return data to the browser
    return res.send({username:data.username, userRole:data.userRole});

  });
```

---------------------------------------

<a name="PasswordUpdate" />
### UserAPI.PasswordUpdate(sessionId, oldPassword, newPassword, callback)

Updated the password of a logged in user and updates the sesssion.

__Arguments__

* sessionId (required) - The session id that login or register returns.
* oldPassword (required) - The old user password.
* newPassword (required) - The new password. Needs to contain an uppercase character, 
a number, a special character and it needs to be between 6 and 20 characters.
* callback(err, data) - A callback which is called after the user password has been updated or an error 
has occurred. The returned data contains the session identifier [sessionId] which is stored in the 
database, the user role [userRole(ADMIN/USER)] and if the call was sucessful [success(true/false)] 

__Example__

```js
  brAuthAPI.UserAPI.PasswordUpdate(sessionId, oldPassword, newPassword, function(err,data){
    // handle error
    if(err){
      return next(err);
    }

    // store the session id as a cookie
    res.cookie('session', data.sessionId);

    // return data to the browser
    return res.send({success:data.success, userRole:data.userRole});

  });
```

---------------------------------------

<a name="PasswordReset" />
### UserAPI.PasswordReset(username, email, firstName, lastName, callback)

Request a password reset. This will send a mail to the user providing an authentication code.

__Arguments__

* email (required) - The email address for user.
* username (required) - The username for the user.
* firstName (required) - The first name for the user.
* lastName (required) - The last name for the user.
* callback(err, data) - A callback which is called after the password reset request was successfull 
or an error has occurred. The returned data contains a success field depending on if the call was 
sucessful [success(true/false)] 

__Example__

```js
  brAuthAPI.UserAPI.PasswordReset(username, email, firstName, lastName, function(err,data){
    // handle error
    if(err){
      return next(err);
    }

    // return data to the browser
    return res.send({success:data.success});

  });
```

---------------------------------------

<a name="PasswordChangeWithAuthenticationCode" />
### UserAPI.PasswordChangeWithAuthenticationCode(username, email, firstName, lastName,
            newPassword, authenticationCode, callback)

Request a password reset. This will send a mail to the user providing an authentication code.

__Arguments__

* authenticationCode (required) - Authentication code produced and send to the user from the PasswordReset call
* email (required) - The email address for user.
* username (required) - The username for the user.
* firstName (required) - The first name for the user.
* lastName (required) - The last name for the user.
* newPassword (required) - The new password. Needs to contain an uppercase character, 
a number, a special character and it needs to be between 6 and 20 characters.
* callback(err, data) - A callback which is called after the user password has been updated or an error 
has occurred. The returned data contains the session identifier [sessionId] which is stored in the 
database, the user role [userRole(ADMIN/USER)] and if the call was sucessful [success(true/false)] 

__Example__

```js
  brAuthAPI.UserAPI.PasswordChangeWithAuthenticationCode(username, email, firstName, lastName,
            newPassword, authenticationCode,function(err,data){
    // handle error
    if(err){
      return next(err);
    }

    // store the session id as a cookie
    res.cookie('session', data.sessionId);

    // return data to the browser
    return res.send({success:data.success, userRole:data.userRole});

  });
```

---------------------------------------

## User Profile API

<a name="GetUserProfile" />
### UserProfileAPI.GetUserProfile(sessionId, callback)

Get the use profile.

__Arguments__

* sessionId (required) - The session id that login or register returns.
* callback(err, data) - A callback which is called after the user profile is retrieved or an error 
has occurred. The returned data contains the user profile.
An example of all the fields:
```js
{
  "firstName":"Antonis",
  "lastName":"Theocharides",
  "phoneNumber":"123456789",
  "dateOfBirth":"1983-01-01",
  "placeOfBirth":"Cyprus",
  "maritalStatus":"SINGLE",
  "gender":"MALE",
  "address":{
    "addressLine1":"103 some road",
    "addressLine2":"",
    "county":"London",
    "town":"London",
    "postCode":"abc 123"
  }
}

```

__Example__

```js
  brAuthAPI.UserProfileAPI.GetUserProfile(sessionId, function(err,data){
    // handle error
    if(err){
      return next(err);
    }

    // return data to the browser
    var firstName = data.firstName;
    var lastName = data.lastName;
    return res.send({firstName:firstName, lastName:lastName});

  });
```

---------------------------------------

<a name="UserProfileUpdate" />
### UserProfileAPI.UserProfileUpdate(sessionId, firstName, lastName, phoneNumber, dateOfBirth,
            placeOfBirth, maritalStatus, gender, addressLine1, addressLine2,
            county, town, postCode, callback)

Update the use profile. All empty fields are ignored.

__Arguments__

* sessionId (required) - The session id that login or register returns.
* firstName (required) - The first name for the user. Empty if it will not be updated.
* lastName (required) - The last name for the user.Empty if it will not be updated.
* phoneNumber (required) - The phone number of the user. Empty if it will not be updated.
* dateOfBirth (required) - The date of birth of the user. Accepted format is yyyy-mm-dd. Empty if it will not be updated.
* placeOfBirth (required) - The place of birth of the user. Empty if it will not be updated.
* maritalStatus (required) - The marital status of the user. Empty if it will not be updated.
* gender (required) - The gender of the user (MALE/FEMAIL). Empty if it will not be updated.
* addressLine1 (required) - The first address line of the user address. Empty if it will not be updated.
* addressLine2 (required) - The second address line of the user address. Empty if it will not be updated.
* county (required) - The county of the user address. Empty if it will not be updated.
* town (required) - The town of the user address. Empty if it will not be updated.
* postCode (required) - The post code of the user address. Empty if it will not be updated.
* callback(err, data) - A callback which is called after the user profile is retrieved or an error 
has occurred. The returned data contains the user profile.
An example of all the fields:
```js
{
  "firstName":"Antonis",
  "lastName":"Theocharides",
  "phoneNumber":"123456789",
  "dateOfBirth":"1983-01-01",
  "placeOfBirth":"Cyprus",
  "maritalStatus":"SINGLE",
  "gender":"MALE",
  "address":{
    "addressLine1":"103 some road",
    "addressLine2":"",
    "county":"London",
    "town":"London",
    "postCode":"abc 123"
  }
}

```

__Example__

```js
  brAuthAPI.UserProfileAPI.UserProfileUpdate(sessionId, firstName, lastName, phoneNumber, dateOfBirth,
            placeOfBirth, maritalStatus, gender, addressLine1, addressLine2,
            county, town, postCode, function(err,data){
    // handle error
    if(err){
      return next(err);
    }

    // return data to the browser
    var firstName = data.firstName;
    var lastName = data.lastName;
    return res.send({firstName:firstName, lastName:lastName});

  });
```

---------------------------------------

<a name="GetUserProfileImage" />
### UserProfileAPI.GetUserProfileImage(sessionId, callback)

Get the user profile image url.

__Arguments__

* sessionId (required) - The session id that login or register returns.
* callback(err, data) - A callback which is called after the user profile image url is retrieved or an error 
has occurred. The returned data contains the user profile image url.

__Example__

```js
  brAuthAPI.UserProfileAPI.GetUserProfileImage(sessionId, function(err,data){
    // handle error
    if(err){
      return next(err);
    }

    // return data to the browser
    var imageUrl = data.url;
    return res.send({imageUrl:imageUrl});

  });
```

---------------------------------------

<a name="GetUserProfileImage" />
### UserProfileAPI.UserProfileImageUpdate(sessionId, filePath, callback)

Get the user profile image url.

__Arguments__

* sessionId (required) - The session id that login or register returns.
* filePath (required) - The local file path of the image to be uploaded
* callback(err, data) - A callback which is called after the user profile image url is retrieved or an error 
has occurred. The returned data contains the user profile image url.

__Example__

```js
  brAuthAPI.UserProfileAPI.UserProfileImageUpdate(sessionId, req.files.myFile.path, function(err,data){
    // handle error
    if(err){
      return next(err);
    }

    // return data to the browser
    var imageUrl = data.url;
    return res.send({imageUrl:imageUrl});

  });
```

---------------------------------------

## Application API

The application api calls need administrator permissions to work

<a name="GetApplications" />
### ApplicationAPI.GetApplications(sessionId, callback)

Get a list of the applications registered in the authentication service.

__Arguments__

* sessionId (required) - The session id that login or register returns.
* callback(err, data) - A callback which is called after the list of applications is retrieved or an error 
has occurred. The returned data contains a list of applicationId and applicationCode tuples.
e.g
[
  { 
    "applicationId":"applicationName",
    "applicationCode":"12345667"
  }
]

__Example__

```js
  brAuthAPI.ApplicationAPI.GetApplications(sessionId, function(err,data){
    // handle error
    if(err){
      return next(err);
    }

    // return first application data to the browser
    var applicationId = data[0].applicationId;
    var applicationCode = data[0].applicationCode;
    return res.send({applicationId:applicationId, applicationCode:applicationCode});

  });
```

---------------------------------------

<a name="ApplicationCreate" />
### ApplicationAPI.ApplicationCreate(sessionId, applicationId, callback)

Registered a new application in the authentication service.

__Arguments__

* sessionId (required) - The session id that login or register returns.
* applicationId (required) - The application name. Must be unique in the authentication service.
* callback(err, data) - A callback which is called after the applications is created or an error 
has occurred. The returned data contains applicationId and applicationCode.

__Example__

```js
  brAuthAPI.ApplicationAPI.ApplicationCreate(sessionId, applicationId, function(err,data){
    // handle error
    if(err){
      return next(err);
    }

    // return first application data to the browser
    var applicationId = data.applicationId;
    var applicationCode = data.applicationCode;
    return res.send({applicationId:applicationId, applicationCode:applicationCode});

  });
```

---------------------------------------

<a name="ApplicationUpdate" />
### ApplicationAPI.ApplicationUpdate(sessionId, applicationId, applicationCode, callback)

Update the application code of a specific application.

__Arguments__

* sessionId (required) - The session id that login or register returns.
* applicationId (required) - The application name.
* applicationCode (required) - The new application code that the application will use.
* callback(err, data) - A callback which is called after the applications is updated or an error 
has occurred. The returned data contains applicationId and applicationCode.

__Example__

```js
  brAuthAPI.ApplicationAPI.ApplicationUpdate(sessionId, applicationId, applicationCode, function(err,data){
    // handle error
    if(err){
      return next(err);
    }

    // return first application data to the browser
    var applicationId = data.applicationId;
    var applicationCode = data.applicationCode;
    return res.send({applicationId:applicationId, applicationCode:applicationCode});

  });
```

---------------------------------------

<a name="ApplicationDelete" />
### ApplicationAPI.ApplicationDelete(sessionId, applicationId, callback)

Delete an application in the authentication service.

__Arguments__

* sessionId (required) - The session id that login or register returns.
* applicationId (required) - The application name.
* callback(err, data) - A callback which is called after the applications is deleted or an error 
has occurred. The returned data contains a success field depending on if the call was sucessful 
[success(true/false)] 

__Example__

```js
  brAuthAPI.ApplicationAPI.ApplicationDelete(sessionId, applicationId, function(err,data){
    // handle error
    if(err){
      return next(err);
    }

    // return first application data to the browser
    return res.send({success:data.success});

  });
```

---------------------------------------


