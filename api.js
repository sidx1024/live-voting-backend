const {OAuth2Client} = require('google-auth-library');
const jwt = require('jsonwebtoken');
require('dotenv').config();

function verifyIdToken(req, res) {
  const CLIENT_ID = "881189081299-vlt4opk8p9ptobgivq84r6fbr63mebgs.apps.googleusercontent.com";
  const client = new OAuth2Client(CLIENT_ID);
  verify().catch((err) => {
    res.status(401).json({
      status: "Failed",
      message: "Token cannot be verified.",
      error: err.toString()
    });
  });

  async function verify() {
    const { idToken } = req.body;
    if(!idToken) {
      return res.json({
        status: "Failed",
        message: "Id token is missing",
      });
    }

    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: CLIENT_ID
    });

    const payload = ticket.getPayload();
    const userid = payload['sub'];

    const response = {
      status: "Success",
      message: "Token successfully verified.",
      userid: userid,
      payload: payload
    };
    
    createToken({a: 255, b: 64}, function (token) {
      res.json(Object.assign(response, {token}));
    });
  }
}

function createToken(payload, callback) {
  const SIGN_SECRET = process.env.SIGN_SECRET;
  jwt.sign(payload, SIGN_SECRET, function (err, token) {
    if(err) {
      console.error('[createToken]', err);
      return;
    }
    callback(token);
  });
}

module.exports = {verifyIdToken};
