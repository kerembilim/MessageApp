var express = require('express');
var router = express.Router();
var multer = require('multer');
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

var messageFileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
  cb(null, 'messageFile')
},
filename: function (req, file, cb) {
  cb(null, Date.now() + '-' +file.originalname )
}
})

var messagefileupload = multer({ storage: messageFileStorage }).single('file')




const tokenControl = async(req,res,next) =>{//ayarlanacak
  next();
};
/* GET users listing. */
router.get('/', tokenControl,async(req, res, next) => {
  res.json({isim:'kerem'});

});

router.post('/messagefileupload',function(req, res) {
     
  messagefileupload(req, res, function (err) {
         if (err instanceof multer.MulterError) {
             return res.status(500).json(err)
         } else if (err) {
             return res.status(500).json(err)
         }
    return res.status(200).send(req.file)

  })

});


module.exports = router;
