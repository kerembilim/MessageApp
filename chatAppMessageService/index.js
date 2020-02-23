var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 4000;
const bodyParser = require('body-parser');
var cors = require('cors');
let messages =[];
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)

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

app.post('/getContacts', function(req, res){
  const contacts = [
    {
      userName:'Siri',
      statu:'online',
      image:'https://images.unsplash.com/photo-1525450280520-7d542a86e065?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80'
    },
    {
      userName:'Alexa',
      statu:'online',
      image:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'
    },
    {
      userName:'Vision',
      statu:'online',
      image:'https://i.pinimg.com/originals/12/75/4a/12754ac600a5806ac7e401e776382952.jpg'
    }
  ];
    
  
  let response = [];
  if(req.body.userName === contacts[0].userName ){
    response.push(contacts[1],contacts[2]);
  }
  else if(req.body.userName === contacts[1].userName){
    response.push(contacts[0],contacts[2]);
  }
    
  res.json(response);
});



io.on('connection', function(socket){

  socket.on('chatmessage', (msg) => {
    messages.push(msg);
    console.log(messages);
    io.emit(msg.target, msg);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
