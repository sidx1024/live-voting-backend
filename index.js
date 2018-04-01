const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const bodyParser = require('body-parser');
const cors = require('cors');
const {verifyIdToken} = require('./api');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cors());

app.post('/api/token/verify', verifyIdToken);

app.listen(port);
