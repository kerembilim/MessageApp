const mongoose = require("mongoose");

var MessageModel = new mongoose.Schema({
    content: String,
    sender: String,
    target: String,
    date: Date
});

module.exports = mongoose.model('messages', MessageModel)
    
