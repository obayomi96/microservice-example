const express = require('express');
const bodyParser = require('body-parser');
const comments = require('./data/comments');
const replies = require('../replies/data/replies');

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

app.post('/comments/**', (req, res) => {
  const commentId = parseInt(req.params[0]);
  const selectedComment = comments.find(c => c.id === commentId);
  if (selectedComment) {
    const replied = selectedComment.replies.push(req.body.content);
    if (replied) {
      console.log(`You replied tp comment with id ${commentId}`);
      res.status(202).header({Location: `http://localhost:${port}/comments/${selectedComment.id}`}).send(selectedComment);
    }
  } else {
      console.log(`Comment not found.`);
      res.status(404).send();
  }
});

app.get('/comments/**', (req, res) => {
  const commentId = parseInt(req.params[0]);
  const replyContent = parseInt(req.params[1]);
  const selectedComment = comments.find(c => c.id === commentId);
  if (selectedComment) {
    const replied = selectedComment.replies.push(replyContent);
    if (replied) {
      console.log(`You replied tp comment with id ${commentId}`);
      res.status(202).header({Location: `http://localhost:${port}/comments/${selectedComment.id}`}).send(selectedComment);
    } return console.log('errooooorrr !!!')
  } else {
      console.log(`Comment not found.`);
      res.status(404).send();
  }
});

// app.use('*', (req, res) =>
//   res.status(404).json({
//     status: res.statusCode,
//     error: 'Resource not found on Comments API. Double check the url and try again',
//   })
// );

app.listen(port, () => {
  console.log(`Comment mircroservice running on port ${port}`);
});

module.exports = app;
