const express = require('express');
const bodyParser = require('body-parser');

const port = process.argv.slice(2)[0];

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.get('/', (req, res) =>
  res.status(200).json({
    status: res.statusCode,
    message: 'Welcome to Replies Microservice API',
  })
);

app.use('*', (req, res) =>
  res.status(404).json({
    status: res.statusCode,
    error: 'Resource not found on Replies API. Double check the url and try again',
  })
);

app.listen(port, () => {
  console.log(`Reply mircroservice running on port ${port}`);
});

module.exports = app;
