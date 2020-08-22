const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const replies = require('./data/replies');

const port = process.argv.slice(2)[0];
const commentServicePort = 'http://localhost:8080'

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.get('/', (req, res) =>
  res.status(200).json({
    status: res.statusCode,
    message: 'Welcome to Replies Microservice API',
  })
);

app.get('/replies', (req, res) =>
  res.status(200).json({
    status: res.statusCode,
    message: 'Replies fetched!',
    data: replies,
  })
);

app.post('/reply-to', (req, res) => {
  const { commentId, content } = req.body;
  request.post({
    headers: {'content-type': 'application/json'},
    url: `${commentServicePort}/comments/${commentId}`,
    body: `{ 'commentId': ${commentId}, 'content': ${content}}`
  }, (err, commentRes, body) => {
    if(!err) {
      const replyId = replies.length+1;
      const reply = replies.find(r => r.id === replyId);
      reply.commentId = replyId;
      res.status(202).send(reply);
    } else {
      console.log('Error with Commentnservice');
      res.status(400).send({problem: `Comment Service responded with issue ${err}`});
    }
  })
  const newReply = {
    id: replies.length+1,
    content,
    commentId,
  }
  replies.push(newReply);
  res.status(201).json({
    status: res.statusCode,
    message: 'Comment posted!',
    data: replies
  })
});
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
