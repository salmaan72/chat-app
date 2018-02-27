"use strict"

const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let userSchema = new Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  confirmpassword: {
    type: String,
    required: true
  }
});

let userModel = mongoose.model('user_accounts', userSchema);

module.exports = userModel;
