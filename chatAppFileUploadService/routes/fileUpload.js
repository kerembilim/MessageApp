var express = require('express');
var router = express.Router();
var multer = require('multer');
var jwt = require('jsonwebtoken');
var CryptoJS = require("crypto-js");
const config = require('../config');
const axios = require('axios');

const path = require('path');


var fileName = null;

const { Pool, Client } = require('pg')

let pool;


const createClient = () => {

  return new Client({
    host: config.dbHost,
    port: config.dbPort,
    database: config.dbName,
    user: config.dbUser,
    password: config.dbPassword,
  });

}

var messageFileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'messageFile')
  },
  filename: function (req, file, cb) {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var Month = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var hh = today.getHours();
    var mm = today.getMinutes();
    var ss = today.getSeconds();
    var ms = today.getMilliseconds();
    today = dd + '.' + Month + '.' + yyyy + '|' + hh + ':' + mm + ':' + ss + ':' + ms;
    fileName = req.user.username + '|' + today + '-' + file.originalname.replace(/\s/g, '');
    cb(null,fileName )
  }
})

var messagefileupload = multer({ storage: messageFileStorage }).single('file')
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
};
/* GET users listing. */
router.get('/', tokenControl, async (req, res, next) => {
  res.json({ isim: 'kerem' });
});

router.get('/download', function (req, res) {
  const file = '1587851977424-Sunum1.pptx';
  var fileLocation = path.join('./messageFile', file);
  console.log(fileLocation);
  res.download(fileLocation, file);
});



router.get('/download/:name', function (req, res) {
  const file = req.params.name;
  var fileLocation = path.join('./messageFile', file);
  res.sendFile(path.join(__dirname, "../messageFile/" + req.params.name));
});


router.post('/messagefileupload', tokenControl, function (req, res) {

  messagefileupload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err)
    } else if (err) {
      return res.status(500).json(err)
    }
    return res.status(200).send(req.file)

  })

});

router.post('/imageupload', tokenControl, function (req, res) {

  messagefileupload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err)
    } else if (err) {
      return res.status(500).json(err)
    }
    res.json({url: "http://localhost:4010/fileupload/download/" + fileName}) ;

  })

});


module.exports = router;
