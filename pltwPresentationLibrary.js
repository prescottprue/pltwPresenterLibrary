/* Pyro for Firebase*/
  
  function Pltw () {
    //Check for existance of Firebase
    if(typeof Firebase != 'undefined') {
      this.mainRef = new Firebase("https://pltw-presenter.firebaseio.com/")
      this.messagesRef = this.mainRef.child("messages");
      this.usersRef = this.mainRef.child("users");
      return this;
    }
    else throw Error('Firebase library does not exist. Check that firebase.js is included in your index.html file.');
  }
// [TODO] Add role value modificaiton funtions (will be done using forge)
   Pltw.prototype = {
      anonymousLogin: function(successCb, errorCb) {
        console.log('AnonymousLogin');
        var currentThis = this;
        this.mainRef.authAnonymously(function(error, authData){
          if(!error) {
            console.log('Authed anonymously. This:', this);
            this.auth = authData;
            authData.createdAt = Date.now();
            //Added to user folder with a role value of 0
            var currentAnonymous = currentThis.usersRef.push(authData);
            currentAnonymous.child('role') = 0;
            console.log('anonymousLogin callingback with: ', currentAnonymous);
            successCb(currentAnonymous);
          }
          else {
            console.error('Error in anonymousLogin', error);
            errorCb(error);
          }
        });
      },
      userLogin:function(argLoginData, successCb, errorCb) {
        console.log('userLogin');
        var currentThis = this;
        this.mainRef.authWithPassword(argLoginData, function(error, authData) {
          if (error === null) {
            // user authenticated with Firebase
            console.log("User ID: " + authData.uid + ", Provider: " + authData.provider);
            successCb(authData);
            // Add account if it doesn't already exist
            // checkForUser(argLoginData, currentThis.usersRef, function(userAccount){
            //   successCb(userAccount);
            // });
          } else {
            console.error("Error authenticating user:", error);
            // [TODO] Return object if available
            errorCb(error);
          }
        });
      },
      userSignup:function(argSignupData, successCb, errorCb) {
        if(argSignupData && argSignupData.email && argSignupData.password) {
          var currentThis = this;
          var usersRef = this.usersRef;
          this.mainRef.createUser(argSignupData, function(error) {
            if (error === null) {
              console.log("User created successfully");
              // Push new user data to users folder
              checkForUser(argSignupData, function(userAccount) {
                currentThis.userLogin(argSignupData, function(authData){
                  successCb(authData);
                });
              }, function(){
                console.error('Error checking for user:');
              });
              
            } else {
              console.error("Error creating user:", error);
              errorCb(error);
            }
          });
        } else {
          throw Error('Invalid signupData');
        }
      },
      sendMessage: function(argMessage, callback) {
        console.log('Send message:', arguments);
        console.log('this::::', this);
        var messageObj = argMessage;
        messageObj.createdAt =  Date.now();
        var messageRef = this.messagesRef.push(messageObj, function(){
          console.log('this::::', this);
          console.log('this.auth:', this.auth);
          console.log('messageRef', messageRef);
          callback(messageRef);
        });
      },
      loadMessages: function(callback) {
        this.messagesRef.orderByChild('createdAt').on('value', function(messageListSnap){
          callback(messageListSnap.val());
        });
      },
      messageCount: function(callback) {
        this.messagesRef.on('value', function(messagesListSnap) {
          callback(messagesListSnap.numChildren());
        });
      },
      userCount: function(callback) {
        this.usersRef.on('value', function(usersListSnap) {
          callback(usersListSnap.numChildren());
        });
      }

  };
        // Single Checking function for all user types (should be in one folder)
      function checkForUser(argUserData, argUsersRef, callback) {
        console.log('CheckForUser:', argUserData);
        argUsersRef.orderByChild('email').equalTo(argUserData.email).limitToFirst(1).once("value", function(querySnapshot) {
          if(querySnapshot.val() != null) {
            // Update existing moderator
            console.log('Usersnap:', querySnapshot.val());
            querySnapshot.set({lastLogin: Date.now()}, function(){
              callback(querySnapshot.val());
            });
            
          } else {
            // New Moderator
            var userObj = {email: argUserData.email, createdAt: Date.now(), role:10}
            var newUserRef = argUsersRef.push(userObj);
            console.log('New user pushed successfully');
            newUserRef.setPriority(argUserData.email, function(){
              console.log('email priority set');
              newUserRef.once('value', function(querySnapshot){
                callback(querySnapshot.val());
              });
            });
          }
        });
      }