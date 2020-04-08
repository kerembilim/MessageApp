var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var CryptoJS = require("crypto-js");
const config = require('../config');

const { Pool,Client } = require('pg')

let pool;


const createClient = () =>{
 
    return new Client({
      host: config.dbHost,
      port: config.dbPort,
      database: config.dbName,
      user: config.dbUser,
      password: config.dbPassword,
    });

}




const tokenControl = async(req,res,next) =>{
  const bearerHeader = req.headers["authorization"];
  if(typeof bearerHeader != 'undefined'){
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    jwt.verify(bearerToken,config.jwtSecretKey,async (err,data)=>{
      if(err){
        res.sendStatus(403).send({ error: 'Invalid Token.' });
      }
      else{
        const client = createClient();
        client.connect(err => {
          if (err) {
            console.error('connection error', err.stack)
          }
        });
        const resDb = await client.query('select * from users where username = $1 and password = $2', [data.user.username,data.user.password]);
        await client.end()

        if(resDb.rows == null || resDb.rows.length <=0 ){
          res.json({Error:'User not found'});
        }
        else{
          next();
        }
      }
        
    })
     
  }
  else{
    res.sendStatus(403);
  }
};
/* GET users listing. */
router.get('/', tokenControl,async(req, res, next) => {
  const client = createClient();
  client.connect(err => {
    if (err) {
      console.error('connection error', err.stack)
    }
  });
  const resDb = await client.query('select * from users where id = $1', [7])
  await client.end()
  res.json(resDb.rows[0]);

});


router.post('/loginControl',async(req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if(typeof bearerHeader != 'undefined'){
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    jwt.verify(bearerToken,config.jwtSecretKey,async (err,data)=>{
      if(err){
        res.sendStatus(403).send({ error: 'Invalid Token.' });
      }
      else{
        const client = createClient();
        client.connect(err => {
          if (err) {
            console.error('connection error', err.stack)
          }
        });
        const resDb = await client.query('select * from users where username = $1 and password = $2', [data.user.username,data.user.password]);
        await client.end()

        if(resDb.rows == null || resDb.rows.length <=0 ){
          res.json({Error:'User not found'});
        }
        else{
          res.json({
            username:resDb.rows[0].username,
            result:'basarili'
          })
        }
      }
        
    })
     
  }
  else{
    res.sendStatus(403);
  }
});



router.post('/getContacts',tokenControl,(req, res) =>{
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
  else{
    response.push(contacts[0],contacts[1],contacts[2]);
  }
    
  res.json(response);
});


router.post('/login',  async(req, res, next) =>{
  const client = createClient();
  try{
    const user = req.body;
    
    client.connect(err => {
      if (err) {
        console.error('connection error', err.stack) 
      }
    });
    const resDb = await client.query('select * from users where username = $1 and password = $2', [user.username,user.password]);
    if(resDb.rows == null || resDb.rows.length <=0 ){
      res.json({Error:'User not found'});
    }
    else{
      const token = jwt.sign( { user }, config.jwtSecretKey);
      var response={
        username:resDb.rows[0].username,
        token,
        result:'basarili'
      }
      res.json(response);
    }
  }
  catch(err){
    res.json(err);

  }
  finally{
    await client.end()
  }
});

router.post('/register',async(req, res, next) =>{
  const user = req.body;
  connectionInitialize();
  let sqlText = "SELECT count(*) FROM users WHERE username = '" + user.username + "'";
  console.log(sqlText);
  const userCount = await pool.query(sqlText);
  console.log( userCount.rows[0]);
  if(userCount != null && userCount.rows[0].count === '0'){
    sqlText = "INSERT INTO USERS (username,password) values('"+user.username+"','"+CryptoJS.AES.encrypt(user.password, config.cryptionKey).toString()+"')";
    const resDb = await pool.query(sqlText);
    connectionDisposeAndDisconnect();
    res.json({Statu:'User Saved'});
  }
  else{
    res.json({
      Error:'User already exist'
    })
  }
});

router.get('/protected',(req, res, next) =>{
  var ees = req.userData;
  res.json({
    status:'this is protected',
    ees
  });
});




module.exports = router;
