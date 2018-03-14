"use strict"

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./routes');
const mongoose = require('mongoose');
const verifyToken = require('./libs/verifyToken');
const msgModel = require('./models/msgs.model');

const events = require('events');
const eventEmitter = new events.EventEmitter();

mongoose.connect('mongodb://localhost/chatapp', function(){
  console.log('mongodb connected on default port');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/chat', routes);
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine','jade');
app.set('views', path.join(__dirname+'/views'));

app.get('/', function(req,res){
  res.send('done');
});

http.listen(3000, function(){
  console.log('server listening on port 3000');
});

// events
let users = [];
let connections = [];

io.sockets.on('connection', function(socket){

  // new user
  socket.on('new user', function(username){
    let flag = true;
    for(let i in connections){
      if(connections[i]['username'] === username){
        flag = false;
        return;
      }
    }
    if(flag){
      connections.push(socket);
    }
    //  console.log(socket);
    //socket.join('one2one');
    console.log('connected: %s sockets connected',connections.length);
    socket.username = username;
    users.push(socket.username);
    //console.log(socket);
    updateUsernames();
  });

  //join one2one room
  var room, sendto;
socket.on('join one2one', function(user){
   for(let x in connections){
     if(connections[x]['username'] === user){
       room = socket.id+'and'+connections[x]['id'];
       sendto = connections[x]['username'];
       socket.join(room);
       connections[x].join(room);
       return;
     }
   }
});

// typing notification
socket.on('key',function(touser,from, status){
  socket.broadcast.to(room).emit('typing', touser, from, status);
});

  //send Messages
  socket.on('send message', function(msg, fromuser){
    //console.log('2 times');
    eventEmitter.emit('create msgs coll');
    eventEmitter.emit('save to db', msg, fromuser, sendto);
    io.sockets.to(room).emit('new message', {msg: msg, user:fromuser});
  });

  function updateUsernames(){
    io.sockets.emit('get users', users);
  }

  //disconnect
  socket.on('disconnect', function(){
    //if(socket.username) return;
    users.splice(users.indexOf(socket.username),1);
    updateUsernames();
    connections.splice(connections.indexOf(socket),1);
    console.log('Disconnected: %s sockets connected',connections.length);
  });

  socket.on('get texts', function(from, to){
    msgModel.findOne({$or:[{'user1':from, 'user2':to}, {'user1':to, 'user2':from}]}, function(err, found){
      if(found !== null && found !== undefined){
        socket.emit('print msgs', found.msgs);
      }
    });
  });
});

  // database operations
 
  eventEmitter.on('save to db', function(msg, from, to){
          msgModel.findOne({$or:[{'user1':from, 'user2':to}, {'user1':to, 'user2':from}]}, function(err,msgobj){
            if(msgobj === null || msgobj === undefined){
              let newmsg = new msgModel({
                user1: from,
                user2:to,
                msgs:[from+': '+msg]
              });
              newmsg.save();
              return;
            }
            else{
              msgobj['msgs'].push(from+': '+msg);
              msgobj.save();
            }
          });
      
    }); 



eventEmitter.once('create msgs coll', function(){
  let newcol = new msgModel();
  newcol.save();
});