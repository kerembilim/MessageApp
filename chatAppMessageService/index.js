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
    let message = new MessageModel({
      // _id: 3,
      messageContent: msg.content,
      sender: msg.sender,
      target: msg.target,
      date: Date.now()
   });
 
 
   message.save((error, data) => {
       if (error) {
           console.log("Beklenmeyen bir hatayla karşılaşıldı..."+ error);
       }
   });
  }
 

app.use(cors());

app.use(bodyParser.json())

app.post('/login', function(req, res){
  const loginData = {
    userName:'Siri',
    password:'123'
  };
  const loginData2 = {
    userName:'Alexa',
    password:'123'
  };
  let response = {};
  if(req.body.userName === loginData.userName && req.body.password === loginData.password)
  {
    response.result = 'basarili';
    response.token = '1*1*1*1*1';
    response.userName = 'Siri';
  }
  else if(req.body.userName == loginData2.userName && req.body.password === loginData2.password)
  {
    response.result = 'basarili';
    response.token = '2*2*2*2*2';
    response.userName = 'Alexa';
  }
  else 
    response.result = 'basarisiz';
  res.json(response);
});

app.post('/loginControl', function(req, res){
  const loginData = {
    userName:'Siri',
    password:'123',
    token:'1*1*1*1*1' 
  };
  const loginData2 = {
    userName:'Alexa',
    password:'123',
    token:'2*2*2*2*2'
  };
  
  let response = {};
  if(req.body.token === loginData.token ){
    response.result = 'basarili';
    response.userName = loginData.userName;
  }
  else if(req.body.token === loginData2.token){
    response.result = 'basarili';
    response.userName = loginData2.userName;
  }
    

  res.json(response);
});

app.get('/getOldMessages',(req,res)=>{
  res.json(messages);
})

app.get('/getmessages',(req,res)=>{
  MessageModel.find({}).sort({_id:-1}).limit(2).exec(function(err, leads){
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
