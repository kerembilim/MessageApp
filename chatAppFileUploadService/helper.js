
const axios = require('axios');


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

  module.exports = tokenControl;
  