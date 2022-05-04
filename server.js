/* eslint-disable no-unused-vars */
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const api = require('./controllers');

const app = express();

const port = process.env.PORT || 5000;

// CORS
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use('/api', api);

// Catch not found url
app.use((req, res, next) => {
  const error = new Error('Could not find this route');
  error.code = 404;
  throw error;
});

// Catch unknown errors
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
