const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { verifyIdToken, jwtMiddleware } = require('./api');
const { activateInterval } = require('./vote');

const app = express();
const https = require('https').Server(app);
const io = require('socket.io')(https);

const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.post('/api/token/verify', verifyIdToken);

app.get('/protected', jwtMiddleware, (req, res) => {
  res.send({ message: 'You accessed a protected endpoint successfully.' });
});

io.on('connection', (socket) => {
  console.log('[+] a user connected');
  console.log('[+] socket', socket);
  socket.on('disconnect', () => {
    console.log('[-] user disconnected');
  });
});

activateInterval(io);

https.listen(port);
