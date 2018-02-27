"use strict";

const responseGenerator = {};

responseGenerator.respGen = function(error,msg,status,data){
  let response = {
    error: error,
    message: msg,
    status: status,
    data: data
  }
  return response;
}

module.exports = responseGenerator;
