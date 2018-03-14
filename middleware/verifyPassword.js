"use strict"

let confirmpass_verify = {};

// function to confirm whether entered and re-entered passwords are matched
confirmpass_verify.confirmpass = function(req,res,next){
  if(req.body.password === req.body.confirm){
    next();
  }
  else{
    res.send('passwords doesn\'t match');
  }
}

module.exports = confirmpass_verify;