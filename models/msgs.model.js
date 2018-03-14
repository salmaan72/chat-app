"use strict"

const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let msgSchema = new Schema({
    user1: String,
    user2: String,
    msgs: [String]
});

let msgModel = mongoose.model('msgs', msgSchema);

module.exports = msgModel;