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
let connections = [],
    users = [];

  io.on('connection', function(socket){
    console.log('logged in');
  });

io.on('disconnect', function(socket){
  console.log('logged out');
  redirect('/chat/logout');

});
