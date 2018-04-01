const express = require('express');

const app = express();
const port = process.env.PORT || 8080;
const bodyParser = require('body-parser');
const cors = require('cors');
const { verifyIdToken, jwtMiddleware } = require('./api');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.post('/api/token/verify', verifyIdToken);

app.get('/protected', jwtMiddleware, (req, res) => {
  res.send({ message: 'You accessed a protected endpoint successfully.' });
});

app.listen(port);
