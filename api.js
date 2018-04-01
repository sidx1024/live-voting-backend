const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { SIGN_SECRET } = process.env;

function createToken(payload, callback) {
  jwt.sign(payload, SIGN_SECRET, (err, token) => {
    if (err) {
      console.error('[createToken]', err);
      return;
    }
    callback(token);
  });
}

function verifyIdToken(req, res) {
  const GOOGLE_CLIENT_ID = '881189081299-vlt4opk8p9ptobgivq84r6fbr63mebgs.apps.googleusercontent.com';
  const client = new OAuth2Client(GOOGLE_CLIENT_ID);

  async function verify() {
    const { idToken } = req.body;

    if (!idToken) {
      return res.json({
        status: 'Failed',
        message: 'Id token is missing'
      });
    }

    const ticket = await client.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const {
      email, name, picture, sub
    } = payload;
    const data = { email, name, picture };

    const response = {
      status: 'Success',
      message: 'Token successfully verified.',
      data
    };

    return createToken({ ...data, ...sub }, (token) => {
      res.json({ ...response, token });
    });
  }

  verify().catch((err) => {
    res.status(401).json({
      status: 'Failed',
      message: 'Token cannot be verified.',
      error: err.toString()
    });
  });
}

function jwtMiddleware(req, res, next) {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(403).json({ error: 'No credentials sent!' });
  }
  const token = authorization.split(' ')[1];
  return jwt.verify(token, SIGN_SECRET, (err) => {
    if (err) {
      return res.status(403).json({ error: 'Error verifying credentials.' });
    }
    return next();
  });
}

module.exports = { verifyIdToken, jwtMiddleware };
