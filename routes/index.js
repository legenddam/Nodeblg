var express = require('express');
var router = express.Router();

var mongodb = require('mongodb');
const url = 'localhost:27017/nodeblog'; // Connection URL
var db = require('monk')('localhost/nodeblog');
/* GET home page. */
router.get('/', function(req, res, next) {
  var db = req.db;
  var posts = db.get('posts');
  posts.find({},{}, function(err, posts){
    if(err){
      console.log("MongoDB ERR");
      return;
    }

    res.render('index', { posts: posts});
  });
});

module.exports = router;
