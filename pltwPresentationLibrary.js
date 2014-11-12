/* Pyro for Firebase*/
  
  function Pltw () {
    //Check for existance of Firebase
    if(typeof Firebase != 'undefined') {
      this.mainRef = new Firebase("https://pltw-presenter.firebaseio.com/")
      this.chatRef = mainRef.child("chat");
      this.usersRef = mainRef.child("users");
      return this;
    }
    else throw Error('Firebase library does not exist. Check that firebase.js is included in your index.html file.');
  }
// [TODO] Add role value modificaiton funtions (will be done using forge)
   Pltw.prototype = {
      anonymousLogin: function(successCb, errorCb) {
        console.log('AnonymousLogin');
        this.mainRef.authAnonymously(function(error, authData){
          if(!error) {
            this.auth = authData;
            authData.createdAt = Date.now();
            //Added to user folder with a role value of 0

            var currentAnonymous = this.usersRef.push(authData);
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
        console.log('AdminLogin');
        this.mainRef.authWithPassword(argLoginData, function(error, authData) {
          if (error === null) {
            // user authenticated with Firebase
            console.log("User ID: " + authData.uid + ", Provider: " + authData.provider);
            successCb(authData);
          } else {
            console.error("Error authenticating user:", error);
            // [TODO] Return object if available
            errorCb(error);
          }
        });
      },
      userSignup:function(argSignupData, successCb, errorCb) {
        if(argSignupData && argSignupData.email && argSignupData.password) {
          this.mainRef.createUser(argSignupData, function(error) {
            if (error === null) {
              console.log("User created successfully");
              var currentAccount = this.usersRef.push(argSignupData);
              //Set User Role
              currentAccount.child('role').set(10);
              this.userLogin(argSignupData, function(authData){
                successCb(authData);
              });
            } else {
              console.error("Error creating user:", error);
              errorCb(error);
            }
          });
        } else {
          throw Error('Invalid signupData');
        }
      }
      // Single Checking function for all user types (should be in one folder)
      // function checkForUser(argUserData, argModeratorsRef, callback) {
      //   var userRef = argModeratorsRef.orderByChild(argUserData.email).on("value", function(userSnapshot) {
      //     if(userSnapshot.val() != null) {
      //       // Update existing moderator
      //       userRef.child('lastLogin').set(Date.now());
      //       callback(userSnapshot.val());
      //     } else {
      //       // New Moderator
      //       var newModRef = argModeratorsRef.push(argUserData);
      //       newModRef.setPriority(argUserData.email, function(){
      //         newModRef.once('value', function(modSnap){
      //           callback(modSnap.val());
      //         });
      //       });
      //     }
      //   });
      // }
  // }

  };