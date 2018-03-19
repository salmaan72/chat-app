"use strict"

const express = require('express');
const routes = express();
const userController = require('./controllers/user.controller');
const router = express.Router();
const verifyToken = require('./libs/verifyToken');
const splitCookies = require('./libs/splitCookies');
const verifyPassword = require('./middleware/verifyPassword');

routes.route('/login').get(function(req, res){
  if(req.headers.cookie !== undefined){
    let cookieObj = splitCookies.cookieSplit(req.headers.cookie);
    if(cookieObj.token === undefined){
      res.render('login')
    }
    else{
      res.render('logout');
    }
  }
  else{
    res.render('login');
  }

}).post(userController.login);

routes.route('/signup').get(function(req,res){
  res.render('signup');
}).post(verifyPassword.confirmpass, userController.signup);

routes.get('/profile', function(req,res){
  let token = splitCookies.cookieSplit(req.headers.cookie).token;
  verifyToken.verifyUserToken(token,res,function(authData){
    res.render('home_profile',{name: authData.user});
  });
});

routes.post('/logout', userController.logout);

module.exports = routes;
