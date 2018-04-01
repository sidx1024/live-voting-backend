const {OAuth2Client} = require('google-auth-library');

function verifyIdToken(req, res) {
  const CLIENT_ID = "881189081299-vlt4opk8p9ptobgivq84r6fbr63mebgs.apps.googleusercontent.com";
  const client = new OAuth2Client(CLIENT_ID);

  verify().catch((err) => {
    res.status(401).json({
      status: "Failed",
      message: "Token cannot be verified."
    });
  });

  async function verify() {
    const { idToken } = req.body;

    if(!idToken) {
      res.json({
        status: "Failed",
        message: "Id token is missing"
      });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];

    const response = {
      status: "Success",
      message: "Token successfully verified."
    };

    res.json(response);
  }
}

module.exports = {verifyIdToken};
