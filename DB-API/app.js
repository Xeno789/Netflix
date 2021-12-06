const express = require('express')
const mongoose = require('mongoose')
const restify = require('express-restify-mongoose')
const app = express()
const router = express.Router()
const User = require('./models/user');
const Video = require('./models/video');
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
mongoose.connect('mongodb://mongodb:27017/database');

restify.serve(router, User);
restify.serve(router, Video);
app.use(router);

app.get('/healthCheck', (req, res) => {
  User.find().exec().then(async(response) =>{
    res.send().status(200);
  })
  .catch((err) => {
    res.send().status(400);
  })
})

app.listen(3001, () => {
  console.log('Express server listening on port 3001')
})
