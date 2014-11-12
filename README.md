#pltwPresenterLibrary

## Usage

Create new instance:  `var lib = new Pltw()`

###Login Functionality: 

Anonymous: `lib.anonymousLogin(successCb, errorCb)`

Admin: `lib.adminSignup(argSignupData, successCb, errorCb)`
`lib.adminLogin(argLoginData, successCb, errorCb)`

Moderator: `lib.moderatorLogin(argLoginData, successCb, errorCb)`