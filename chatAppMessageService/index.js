var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 4000;
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
var cors = require('cors');
const MessageModel = require('./models/messageModel');
let messages =[];
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
mongoose.connect("mongodb://localhost/messageAppDB")
    .then(() => console.log("Veritabanı bağlantısı başarıyla sağlanmıştır..."))
    .catch(error => console.log("Veritabanı bağlantısı sağlanırken beklenmeyen bir hatayla karşılaşıldı...", error.message));

    

  let messageSave = (msg) =>{
    console.log(msg);
    let message = new MessageModel({
      content: msg.content,
      sender: msg.sender,
      target: msg.target,
      date: Date.now(),
      messageType: msg.messageType
   });
 
 
   message.save((error, data) => {
       if (error) {
           console.log("Beklenmeyen bir hatayla karşılaşıldı..."+ error);
       }
   });
  }
 

app.use(cors());

app.use(bodyParser.json())

app.get('/getmessages',(req,res)=>{
  MessageModel.find({$or: [ { target:req.query.username }, { sender:req.query.username }]}).sort({_id:1}).limit(500).exec(function(err, leads){
    res.send(leads);
    });
})

io.on('connection', function(socket){
  socket.on('chatmessage', (msg) => {
    messages.push(msg);
    messageSave(msg);
    io.emit(msg.target, msg);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
