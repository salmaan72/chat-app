# chat-app
A simple chat application developed using socket.io
## Installation
1. clone the repository
2. navigate into the cloned repo directory and install the dependencies by issuing the command `npm install`
3. start the server: `nodemon app.js` or `node app.js`
4. entry route: `localhost:3000/chat/login`

## Points to remember
1. If the server is restarted while the app is in use, logout all the currently logged in sessions and login again.
2. Features persistent storage but old chats of a particular conversation are only be accessible when the other person in the conversation is currently online. (because only then the username is displayed under the online users tab)

###### Note: If anyone interested in frontend development, fork the repo.
