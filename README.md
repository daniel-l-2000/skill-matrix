# Skill Matrix

This tool allows you to manage the skills of selected users. You can easily add, update or remove skills of your user and view any other user's skills and profile.

<br>

### Built with React and Firebase

Using Firebase Authentication, Storage and Firestore as a full backend

<br>

### Build & run instructions:

- Clone the repo
- Run `npm install` to install all packages
- Run `npm start` to build and run the app
- Visit http://localhost:3000 on your machine if it didn't open up automatically
- Press F12 or Ctrl+Shift+I to inspect the app!

<br>

### Sample credentials:

- d.landgraf2000@icloud.com with 123456
- john.doe@example.com with Test123

<br>

### Firebase Security Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
  	function isAuthenticated() {
    	return request.auth != null;
    }

    function isOwner(userId) {
    	return request.auth.uid == userId;
    }

    function validateKeys(allowedKeys) {
      return request.resource.data.keys().hasOnly(allowedKeys)
      		&& request.resource.data.size() == allowedKeys.size();
    }

    function validateUserName() {
    	return request.resource.data.name is string
        	&& request.resource.data.name.size() >= 2
        	&& request.resource.data.name.size() <= 20;
    }

    function validateLevel() {
    	return request.resource.data.level in [1, 2, 3];
    }

    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isOwner(userId)
      								&& validateKeys(['name'])
                    	&& validateUserName();
      allow update: if isOwner(userId)
      								&& validateKeys(['name'])
                    	&& validateUserName();
    }
    match /skillDefinitions/{skillDefinitionId} {
    	allow read: if isAuthenticated();
    }
    match /skills/{skillId} {
    	allow read: if isAuthenticated();
      allow create: if isOwner(request.resource.data.userId)
                      && validateKeys(['userId', 'skillDefinitionId', 'level'])
                      && request.resource.data.userId == request.auth.uid
                      && exists(/databases/$(database)/documents/skillDefinitions/$(request.resource.data.skillDefinitionId))
                      && validateLevel();
      allow update: if isOwner(resource.data.userId)
      								&& validateKeys(['userId', 'skillDefinitionId', 'level'])
                      && request.resource.data.userId == resource.data.userId
                      && request.resource.data.skillDefinitionId == resource.data.skillDefinitionId
                      && validateLevel();
      allow delete: if isOwner(resource.data.userId);
    }
  }
}
```
