var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var CryptoJS = require("crypto-js");
const config = require('../config');

const { Pool } = require('pg')

let pool;

const connectionInitialize = () =>{
 pool = new Pool({
  user: config.dbUser,
  host: config.dbHost,
  database: config.dbName,
  password: config.dbPassword,
  port: config.dbPort,
  });
}

const connectionDisposeAndDisconnect = () => {
  pool.end();
}




const tokenControl = (req,res,next) =>{
  const bearerHeader = req.headers["authorization"];
  if(typeof bearerHeader != 'undefined'){
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    jwt.verify(bearerToken,config.jwtSecretKey,(err,data)=>{
      if(err){
        res.sendStatus(403).send({ error: 'Invalid Token.' });
      }
      else{
        const resDb =  pool.query('SELECT * FROM users WHERE username =' + req.body.username);
        pool.end();
        if( resDb != null && resDb.rows[0] != null ){
          var pwBytes  = CryptoJS.AES.decrypt(resDb.rows[0].password, config.cryptionKey );
          var password = pwBytes.toString(CryptoJS.enc.Utf8);
          if(password === resDb.rows[0].password){
            const responseData = {
              userId : resDb.rows[0].id,
              username : resDb.rows[0].username,
              token : data
            }
            req.userData = resDb.rows[0];
            next();
          }
          else{
            res.sendStatus(403).send({ error: 'Username or password is wrong.' });
          }
          
        }
        else{

        }
      }
        
    })
     
  }
  else{
    res.sendStatus(403);
  }
};
/* GET users listing. */
router.get('/', async(req, res, next) => {
  const resDb = await pool.query('SELECT NOW()');
  await pool.end();
  res.json(resDb.rows[0])
});


router.post('/login',  (req, res, next) =>{
  const user = req.body;
  const token = jwt.sign( { user }, config.jwtSecretKey);
  res.json({
    token
  });
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

router.get('/protected', tokenControl,(req, res, next) =>{
  var ees = req.userData;
  res.json({
    status:'this is protected',
    ees
  });
});




module.exports = router;
