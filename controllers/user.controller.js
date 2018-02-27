"use strict"

const userModel = require('./../models/signup.model');
const responseGenerator = require('./../libs/responseGenerator');
const jwt = require('jsonwebtoken');
const config = require('./../libs/config');
const verifyToken = require('./../libs/verifyToken');
const splitCookies = require('./../libs/splitCookies');

let userController = {};

userController.login = function(req, res){
  userModel.findOne({ $and:[{'username':req.body.username}, {'password':req.body.password}] }, function(err,foundUser){
    if(err){
      let response = responseGenerator.respGen(true, 'error: '+err, 500, null);
      res.json(response);
    }
    else if(foundUser === null || foundUser === undefined){
      let response = responseGenerator.respGen(true, 'wrong username/password', 500, null);
      res.json(response);
    }
    else{
      jwt.sign({user: foundUser.username},config.secret,function(err,token){
        if(err){
          res.send(err);
        }
        let data = {
          name: foundUser.firstname+' '+foundUser.lastname
        }
        res.cookie('token',token,{ httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        res.redirect('/chat/profile');
      });
    }
  });
}

userController.signup = function(req,res){

  let newUser = new userModel({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    username: req.body.username,
    password: req.body.password,
    confirmpassword: req.body.confirm
  });
  newUser.save().then(function(data){
    res.render('signup_success');
  });
}

userController.logout = function(req,res){
  let token = splitCookies.cookieSplit(req.headers.cookie).token;
  verifyToken.verifyUserToken(token,res,function(authData){
    res.clearCookie('token',{path:'/'});
    res.clearCookie('io',{path:'/'});
    let response = responseGenerator.respGen(false,'successfully logged out',200,null);
    res.send(response);
  });
}

module.exports = userController;
