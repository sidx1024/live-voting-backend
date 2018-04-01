const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const { verifyIdToken, jwtMiddleware } = require('./api');
const { activateInterval } = require('./vote');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const port = process.env.PORT || 80;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/token/verify', verifyIdToken);

app.get('/protected', jwtMiddleware, (req, res) => {
  res.send({ message: 'You accessed a protected endpoint successfully.' });
});
let users = 0;
io.on('connection', (socket) => {
  users += 1;
  console.log('[+] a user connected', users);
  socket.on('disconnect', () => {
    users -= 1;
    console.log('[-] user disconnected', users);
  });
});

activateInterval(io);

http.listen(port);
