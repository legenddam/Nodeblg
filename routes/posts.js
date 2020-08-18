var express = require('express');
var router = express.Router();

var multer = require('multer');
const { post } = require('../app');
var upload = multer({ dest: './public/images' })

  
/* GET Posts*/
router.get('/add', function(req, res, next) {
    var db = req.db;
    var categories = db.get('categories');
    
    categories.find({}, {}, function(err, categories){
        if(err){
            console.log("Category Database Error");
            return;
        }else{
            res.render('addposts', {title : "Add Posts", categories : categories});
         }
    });
});

router.get('/show/:id', function(req, res, next) {
    var db = req.db;
    var posts = db.get('posts');
   
    posts.findOne({_id : req.params.id}, function(err, post){
        if(err){
            console.log("Posts Database Error");
            return;
        }else{
            res.render('showReadmore', {post : post});
         }
    });
});

router.post('/add', upload.single('mainimage'),function(req, res, next) {
    var title = req.body.title;
    var category = req.body.category;
    var body = req.body.body;
    var author = req.body.author;
    var date = new Date();

    var db = req.db;

    if(req.file)
    {
        var mainimage = req.file.filename;
    }
    else{
        var mainimage = 'noImage.jpg';
    }
    //Form validation
    req.checkBody('title', 'Title field is required').notEmpty();
    req.checkBody('body', 'Body Field is required').notEmpty();

    var errors = req.validationErrors();
    if(errors){
        var categories = db.get('categories');
        categories.find({}, {}, function(err, categories){
            if(err){
                console.log("Category Database Error");
                return;
            }
            else{
                res.render('addposts', {"errors": errors, "categories" : categories});
            }
        });
    }
    else{
        var posts = db.get('posts');
        posts.insert({title : title, body : body, author : author, 
            date : date, category : category, mainimage : mainimage}, function(err, post){
                if(err){
                    res.send(err);
                }
                else{
                    req.flash("success", "The Post Added");
                    res.location('/');
                    res.redirect('/');
                }
            });
    }
});

router.post('/addcomment', function(req, res, next) {

    var postid = req.body.postid;
    var name = req.body.name;
    var email = req.body.email;
    var body = req.body.body;
    var comment_date = new Date();

    var db = req.db;


    //Form validation
    req.checkBody('name', 'The Name field is required').notEmpty();
    req.checkBody('email', 'The Email Filed is requried').notEmpty();
    req.checkBody('email', 'The Email Filed Format is incorret').isEmail();
    req.checkBody('body', 'Body Field is required').notEmpty();

    var errors = req.validationErrors();
    if(errors){
        var posts = db.get('posts');
        posts.findOne({_id : postid}, function(err, post){
            if(err){
                console.log("Posts Database Error");
                return;
            }
            else{
                res.render('showReadmore', {"errors": errors, "post" : post});
            }
        });
    }
    else{
        var comment = {
            "name" : name,
            "email" : email,
            "body" : body,
            "commentdate" : comment_date
        };

        var posts = db.get('posts');

        posts.update({_id : postid}, {$push : {"comments" : comment}},function(err, post){
            if(err){
                    res.send(err);
                }
                else{
                    req.flash("success", "The Comments Added");
                    res.location('/posts/show/'+postid);
                    res.redirect('/posts/show/'+postid);
                }
            });
    }
});

module.exports = router;
