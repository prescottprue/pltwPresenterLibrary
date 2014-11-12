/* Pyro for Firebase*/
	
  function PltwPresentation (argPyroData) {
    //Check for existance of Firebase
    console.log('NewPyro:', argPyroData);
    if(Firebase) {
      this.mainRef = new Firebase("https://pltw-presenter.firebaseio.com/")
      this.chatRef = mainRef.child("chat");
      this.usersRef = mainRef.child("users");
      this.adminsRef = mainRef. child("admins");
      this.moderatorsRef = mainRef. child("moderators");

      return this;
    }
    else throw Error('Firebase library does not exist. Check that firebase.js is included in your index.html file.');
  }
   PltwPresentation.prototype = {
      anonymousLogin: function(success, error) {
        console.log('AnonymousLogin');
        this.mainRef.authAnonymously(function(error, authData){
          if(!error) {
            this.auth = authData;
            //Data stored in firebase folder
            this.usersRef.push({createdAt:Date.now()});
          }
          else {
            console.error('Error authing');
          }
        });
      },
      adminSignupAndLogin:function(argSignupData, callback) {
        if(argSignupData && argSignupData.email && argSignupData.password) {
          this.mainRef.createUser(argSignupData, function(error) {
            if (error === null) {
              console.log("User created successfully");
              this.adminsRef.push(argSignupData);
              // [TODO] Set priority for querying
              this.adminLogin(argSignupData, function(authData){
                callback(authData);
              });
            } else {
              console.error("Error creating user:", error);
              callback(error);
            }
          });
        } else {
          throw Error('Invalid signupData');
        }
      },
      adminLogin:function(argLoginData, callback) {
        console.log('AdminLogin');
        this.mainRef.authWithPassword(argLoginData, function(error, authData) {
          if (error === null) {
            // user authenticated with Firebase
            console.log("User ID: " + authData.uid + ", Provider: " + authData.provider);
            callback(authData);
          } else {
            console.log("Error authenticating user:", error);
            // [TODO] Return object if available
            callback(error);
          }
        });
      },
      moderatorLogin: function(argLoginData, callback) {
        console.log('AdminLogin');
        this.mainRef.authWithPassword(argLoginData, function(error, authData) {
          if (error === null) {
            // user authenticated with Firebase
            console.log("User ID: " + authData.uid + ", Provider: " + authData.provider);
            callback(authData);
          } else {
            console.log("Error authenticating user:", error);
            // [TODO] Return object if available
            callback(error);
          }
        });
      }


  };