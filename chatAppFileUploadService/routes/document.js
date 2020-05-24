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

const createClient = () => {

    return new Client({
        host: config.dbHost,
        port: config.dbPort,
        database: config.dbName,
        user: config.dbUser,
        password: config.dbPassword,
    });
}




router.get('/getdocumentstitle', tokenControl, async (req, res, next) => {//usera atanan workgruba atanan departmana atanan belgeler şeklinde bölünmeli 

    try {
        const client = createClient();
        client.connect(err => {
            if (err) {
                console.error('connection error', err.stack)
            }
        });
        const resDb = await client.query('select document.title,document.id,document.createdDate,documentparenttitle.title AS parenttitle from document ' +
            'left join documentuser on documentuser.documentid = document.id ' +
            'left join documentparenttitle on documentparenttitle.id = document.parenttitleid' +
            ' where documentuser.userid = $1 order by parenttitle', [req.user.id]);

        await client.end()

        var response2 = [];
        var title = '';
        var arrayCounter = -1;
        for (var i = 0; i < resDb.rows.length; i++) {
            if (title !== resDb.rows[i].parenttitle) {
                title = resDb.rows[i].parenttitle;
                response2.push([resDb.rows[i]])
                arrayCounter++;
            }
            else {
                response2[arrayCounter].push(resDb.rows[i])
            }
        }
        console.log(response2[0][0])//ilki title'ı işaret ediyor ikinci dökümanı
        res.json(response2);
    } catch (err) {
        res.json(err)
    }

});



router.get('/getdocumentdetail/:id', tokenControl, async (req, res, next) => {//veriler null mı kontrolü eklenecek 
    const client = createClient();
    client.connect(err => {
        if (err) {
            console.error('connection error', err.stack)
        }
    });
    let response = {}
    let canRead = false;
    let canEdit = false;

    const resDb = await client.query('select * from document where document.id = $1 ', [req.params.id]);

    console.log(req.user);
    console.log(resDb.rows[0]);

    if (resDb.rows[0].filtertype === 'departmant') {
        for (var i = 0; i < req.user.departmant.length; i++) {
            const resDb2 = await client.query('select * from documentdepartmant where documentdepartmant.departmantid = $1 and documentdepartmant.documentid = $2 ', [req.user.departmant[i].departmantid, req.params.id]);
            if (resDb2.rows[0].authorization == 1) {//OKUMA
                canRead = true;
            }
            else if (resDb2.rows[0].authorization == 2) {//DÜZENLEME
                canEdit = true;
                canRead = true;
            }
        }

    }
    else if (resDb.rows[0].filtertype === 'role') {
        for (var i = 0; i < req.user.role.length; i++) {
            const resDb2 = await client.query('select * from documentrole where documentrole.roleid = $1 and documentrole.documentid = $2 ', [req.user.role[i].roleid, req.params.id]);
            if (resDb2.rows[0].authorization == 1) {//OKUMA
                canRead = true;
            }
            else if (resDb2.rows[0].authorization == 2) {//DÜZENLEME
                canEdit = true;
                canRead = true;
            }
        }
    }
    else if (resDb.rows[0].filtertype === 'workgroup') {
        for (var i = 0; i < req.user.workgroup.length; i++) {
            const resDb2 = await client.query('select * from documentworkgroup where documentworkgroup.workgroupid = $1 and documentworkgroup.documentid = $2', [req.user.workgroup[i].workgroupid, req.params.id]);
            if (resDb2.rows[0].authorization == 1) {//OKUMA
                canRead = true;
            }
            else if (resDb2.rows[0].authorization == 2) {//DÜZENLEME
                canEdit = true;
                canRead = true;
            }
        }
    }
    else {

        const resDb2 = await client.query('select * from documentuser where documentuser.userid = $1 and documentuser.documentid = $2 ', [req.user.id, req.params.id]);
        if (resDb2.rows[0].authorization == 1) {//OKUMA
            canRead = true;
        }
        else if (resDb2.rows[0].authorization == 2) {//DÜZENLEME
            canEdit = true;
            canRead = true;
        }
    }

    await client.end()

    if (canRead === false) {
        res.json({ status: 'Forbidden document' });
    }
    else if (canEdit == false) {
        response = resDb.rows[0];
        response.canedit = false;
        res.json(response);
    }
    else {
        response = resDb.rows[0];
        response.canedit = true;
        res.json(response);
    }




});

router.post('/documentcreate', tokenControl, async (req, res, next) => {

    try {
        const client = await createClient();
        await client.connect(err => {
            if (err) {
                console.error('connection error', err.stack)
            }
        });



        const resDb = await client.query("INSERT INTO document ( content, createddate,  createruserid, description, filtertype, parenttitleid, title) VALUES ( $1, $2, $3, $4, $5, $6, $7 );");

        await client.end()


        res.json({statu:'success'});
    } catch (err) {
        res.json(err)
    }

});





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
        cb(null, fileName)
    }
})

var messagefileupload = multer({ storage: messageFileStorage }).single('file')

/* GET users listing. */
router.get('/', tokenControl, async (req, res, next) => {
    res.json({ isim: 'kerem' });
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
        res.json({ url: "http://localhost:4010/fileupload/download/" + fileName });

    })
});


module.exports = router;
