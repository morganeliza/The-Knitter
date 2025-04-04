require('dotenv').config();

const { PORT = 3001 } = process.env;
const express = require('express');
const server = express();

const bodyParser = require('body-parser');
server.use(bodyParser.json());

const morgan = require('morgan');
server.use(morgan('dev'));
//for deployment only
// const path = require('path');
// app.get('/', (req, res)=> res.sendFile(path.join(__dirname, '../client/dist/index.html')));
// app.use('/assets', express.(path.join(__dirname, '../client/dist/assets'))); 

server.use((req, res, next) => {
  console.log("<____Body Logger START____>");
  console.log(req.body);
  console.log("<_____Body Logger END_____>");

  next();
});

const apiRouter = require('./api');
server.use('/api', apiRouter);

const { client } = require('./db');
client.connect();

server.listen(PORT, () => {
  console.log("The server is up on port", PORT);
});