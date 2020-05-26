var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var CryptoJS = require("crypto-js");
const config = require('../config');

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



const tokenControl = async (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  console.log('sss');
  console.log(req.headers);
  if (typeof bearerHeader != 'undefined') {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    jwt.verify(bearerToken, config.jwtSecretKey, async (err, data) => {
      console.log(data)
      if (err) {
        res.sendStatus(403).send({ error: 'Invalid Token.' });
      }
      else {
        const client = createClient();
        client.connect(err => {
          if (err) {
            console.error('connection error', err.stack)
          }
        });

        const resDb = await client.query('select * from users where username = $1 and password = $2', [data.user.username, data.user.password]);
        await client.end()

        if (resDb.rows == null || resDb.rows.length <= 0) {
          res.json({ Error: 'User not found' });
        }
        else {
          console.log(data);
          next();
        }
      }

    })

  }
  else {
    res.sendStatus(403);
  }
};
/* GET users listing. */
router.get('/protected', tokenControl, async (req, res, next) => {
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


router.post('/loginControl', async (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader != 'undefined') {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    jwt.verify(bearerToken, config.jwtSecretKey, async (err, data) => {

      if (err) {
        res.json({ error: 'token is wrong' });
      }
      else {
        const client = createClient();
        client.connect(err => {
          if (err) {
            console.error('connection error', err.stack)
          }
        });
        const resDb = await client.query('select * from users where username = $1 and password = $2', [data.user.username, data.user.password]);
        await client.end()

        if (resDb.rows == null || resDb.rows.length <= 0) {
          res.json({ Error: 'User not found' });
        }
        else {
          res.json({
            username: resDb.rows[0].username,
            result: 'basarili'
          })
        }
      }

    })

  }
  else {
    res.sendStatus(403);
  }
});

router.get('/getdepartmant/:username', async (req, res, next) => {
  const client = createClient();
  client.connect(err => {
    if (err) {
      console.error('connection error', err.stack)
    }
  });
  var response = {};
  let workgroups = [];
  let departmants = [];
  let resDb2 = await client.query("SELECT workgroup.name from workgroup left join workgroupuser on workgroup.id = workgroupuser.workgroupid left join users on workgroupuser.userid = users.id where users.username = $1", [req.params.username]);
  workgroups.push(...resDb2.rows);
  let resDb3 = await client.query("SELECT departmant.name,departmant.photo from departmant left join departmantuser on departmant.id = departmantuser.departmantid left join users on departmantuser.userid = users.id where users.username = $1", [req.params.username]);
  departmants.push(...resDb3.rows);
  response.workgroups = workgroups;
  response.departmants = departmants;
  await client.end()
  res.json(response);

});

router.get('/getContacts/:username', tokenControl, async (req, res) => {
  const client = createClient();
  try {
    client.connect(err => {
      if (err) {
        console.error('connection error', err.stack)
      }
    });

    let resDb = await client.query("SELECT username,'online' statu,photourl image FROM USERS WHERE username <> $1", [req.params.username]);
    let persons = [];
    let response = {};
    let workgroups = [];
    let departmants = [];
    if (resDb.rows == null || resDb.rows.length <= 0) {
      res.json({ Error: 'User not found' });
    }
    else {
      persons.push(...resDb.rows);
      let resDb2 = await client.query("SELECT workgroup.name from workgroup left join workgroupuser on workgroup.id = workgroupuser.workgroupid left join users on workgroupuser.userid = users.id where users.username = $1", [req.params.username]);
      workgroups.push(...resDb2.rows);
      let resDb3 = await client.query("SELECT departmant.name,departmant.photo from departmant left join departmantuser on departmant.id = departmantuser.departmantid left join users on departmantuser.userid = users.id where users.username = $1", [req.params.username]);
      departmants.push(...resDb3.rows);
      response.persons = persons;
      response.workgroups = workgroups;
      response.departmants = departmants;
      res.json(response);
    }
  }
  catch (err) {
    res.json(err);

  }
  finally {
    await client.end()
  }

});

router.get('/getdocumentfiltertypedata/:filtertype', tokenControl, async (req, res, next) => {
  const client = createClient();
      client.connect(err => {
          if (err) {
              console.error('connection error', err.stack)
          }
      });
      let resDb = null;
      if(req.params.filtertype === 'user'){
          resDb =  await client.query('select id,username from users');
      }
      else if(req.params.filtertype === 'department'){
        resDb =  await client.query('select id,name from departmant');
      }
      else{
        resDb =  await client.query('select id,name from workgroup');
      }
      await client.end()
      res.json(resDb.rows)
})


router.post('/login', async (req, res, next) => {
  const client = createClient();
  try {
    const user = req.body;

    client.connect(err => {
      if (err) {
        console.error('connection error', err.stack)
      }
    });
    const resDb = await client.query('select * from users where username = $1 and password = $2', [user.username, user.password]);
    if (resDb.rows == null || resDb.rows.length <= 0) {
      res.json({ Error: 'User not found' });
    }
    else {
      const token = jwt.sign({ user }, config.jwtSecretKey);
      var response = {
        username: resDb.rows[0].username,
        token,
        result: 'basarili'
      }
      res.json(response);
    }
  }
  catch (err) {
    res.json(err);

  }
  finally {
    await client.end()
  }
});

router.post('/usercontrol', async (req, res, next) => {
  const bearerHeader = req.headers["authorization"];

  console.log(req.headers);
  if (typeof bearerHeader != 'undefined') {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;

    jwt.verify(bearerToken, config.jwtSecretKey, async (err, data) => {
      if (err) {
        res.sendStatus(403).send({ error: 'Invalid Token.' });
      }
      else {
        const client = createClient();
        await client.connect(err => {
          if (err) {
            console.error('connection error', err.stack)
          }
        });
        let resDb = await client.query('select * from users where username = $1 and password = $2', [data.user.username, data.user.password]);


        if (resDb.rows == null || resDb.rows.length <= 0) {
          res.json({ Error: 'User not found' });
        }
        else {

          let response = resDb.rows[0];
          let id = resDb.rows[0].id;
          resDb = await client.query('select workgroupid from workgroupuser where userid = $1', [id]);
          response.workgroup = resDb.rows;



          resDb = await client.query('select roleid from roleuser where userid = $1', [id]);
          response.role = resDb.rows;




          resDb = await client.query('select departmantid from departmantuser where userid = $1', [id]);
          response.departmant = resDb.rows;


          await client.end()

          res.json(response);
        }



      }

    })

  }
  else {
    res.sendStatus(403);
  }

});

router.post('/register', async (req, res, next) => {
  const user = req.body;
  connectionInitialize();
  let sqlText = "SELECT count(*) FROM users WHERE username = '" + user.username + "'";
  console.log(sqlText);
  const userCount = await pool.query(sqlText);
  console.log(userCount.rows[0]);
  if (userCount != null && userCount.rows[0].count === '0') {
    sqlText = "INSERT INTO USERS (username,password) values('" + user.username + "','" + CryptoJS.AES.encrypt(user.password, config.cryptionKey).toString() + "')";
    const resDb = await pool.query(sqlText);
    connectionDisposeAndDisconnect();
    res.json({ Statu: 'User Saved' });
  }
  else {
    res.json({
      Error: 'User already exist'
    })
  }
});

router.get('/', (req, res, next) => {
  res.json({status:'working'  });
});




module.exports = router;
