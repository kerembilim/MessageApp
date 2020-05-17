var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 4000;
const axios = require('axios');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
var cors = require('cors');
const MessageModel = require('./models/messageModel');
let messages = [];
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
mongoose.connect("mongodb://localhost/messageAppDB")
  .then(() => console.log("Veritabanı bağlantısı başarıyla sağlanmıştır..."))
  .catch(error => console.log("Veritabanı bağlantısı sağlanırken beklenmeyen bir hatayla karşılaşıldı...", error.message));



let messageSave = (msg) => {
  console.log(msg);
  let message = new MessageModel({
    content: msg.content,
    sender: msg.sender,
    target: msg.target,
    date: Date.now(),
    messageType: msg.messageType,
    filename: msg.filename
  });


  message.save((error, data) => {
    if (error) {
      console.log("Beklenmeyen bir hatayla karşılaşıldı..." + error);
    }
  });
}


app.use(cors());

app.use(bodyParser.json())

const tokenControl = async (req, res, next) => {
  var rr = await axios.post('http://localhost:5000/users/usercontrol', null, {
    headers: {
      'Content-Type': 'application/json',
      'authorization': req.headers.authorization,
    }
  }
  )

  if (rr.data.id !== 0 && rr.data.id > 0) {
    req.user = rr.data;
    next();
  }
  else {
    res.json({ hata: 'Kullanıcı verileri alınamadı.' });
  }
};

const getGroups = async (username) => {
  var rr = await axios.get('http://localhost:5000/users/getdepartmant/' + username, null, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  console.log(rr.data);
  return  rr.data;

}

app.get('/getmessages', async(req, res) => {
  let groups = {}; 
  groups = await getGroups(req.query.username);
  console.log('keremmm');
  MessageModel.find({ $or: [{ target: req.query.username }, { sender: req.query.username }, {target: groups.departmants[0].name } ] }).sort({ _id: 1 }).limit(500).exec(function (err, leads) {
    res.json(leads);
  });
})

io.on('connection', function (socket) {
  socket.on('chatmessage', (msg) => {
    messages.push(msg);
    messageSave(msg);
    io.emit(msg.target, msg);
  });
});

http.listen(port, function () {
  console.log('listening on *:' + port);
});
