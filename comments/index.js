const express = require('express');
const bodyParser = require('body-parser');
const comments = require('./data/comments');

const port = process.argv.slice(2)[0];

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.get('/', (req, res) =>
  res.status(200).json({
    status: res.statusCode,
    message: 'Welcome to Comment Microservice API',
  })
);

app.get('/comments', (req, res) =>
  res.status(200).json({
    status: res.statusCode,
    message: 'Comments fetched!',
    data: comments,
  })
);

app.post('/comments', (req, res) => {
  const { content } = req.body;
  const newComment = {
    id: comments.length+1,
    content
  }
  comments.push(newComment);
  res.status(201).json({
    status: res.statusCode,
    message: 'Comment posted!',
    data: comments,
  })
});

app.use('*', (req, res) =>
  res.status(404).json({
    status: res.statusCode,
    error: 'Resource not found on Comments API. Double check the url and try again',
  })
);

app.listen(port, () => {
  console.log(`Comment mircroservice running on port ${port}`);
});

module.exports = app;
