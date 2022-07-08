/** @format */

const cors = require('cors');
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
module.exports = app;

app.use(morgan('dev'));

//app.use(express.json());

app.use(express.json({limit: '1mb', extended: true}));
app.use(express.urlencoded({limit: '23mb', extended: true}));


app.use(bodyParser.json({limit: '22mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '21mb', extended: true}))





app.use('/auth', require('./auth'));
app.use('/api', require('./api'));

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '..', 'public/index.html'))
);

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use((req, res, next) => {
  if (path.extname(req.path).length) {
    const err = new Error('Not found');
    err.status = 404;
    next(err);
  } else {
    next();
  }
});

app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public/index.html'));
});

app.use((err, req, res, next) => {
  console.error(err);
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || 'Internal server error.');
});
