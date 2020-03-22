var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

const tokenControl = (req,res,next) =>{
  const bearerHeader = req.headers["authorization"];
  if(typeof bearerHeader != 'undefined'){
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    jwt.verify(bearerToken,'my_secret_key',(err,data)=>{
      if(err){
        res.sendStatus(403);
      }
      else
        req.userData = data;
        next();
    })
     
  }
  else{
    res.sendStatus(403);
  }
};
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/login',  (req, res, next) =>{// db işlemleri
  const user = req.body;
  const token = jwt.sign( { user }, 'my_secret_key');//secret verilecek
  res.json({
    token
  });
});

router.get('/protected', tokenControl,(req, res, next) =>{
  var ees = req.userData;
  res.json({
    status:'this is protected',
    ees
  });
});




module.exports = router;
