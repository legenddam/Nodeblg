var express = require('express');
var router = express.Router();

var multer = require('multer');
var upload = multer({ dest: './uploads/' })

  
/* GET Posts*/
router.get('/add', function(req, res, next) {
    var db = req.db;
    var categories = db.get('categories');
    
    categories.find({}, {}, function(err, categories){
        if(err){
            consolog.log("Category Database Error");
            return;
        }else{
            res.render('addposts', {title : "Add Posts", categories : categories});
         }
    });
});

router.post('/add', upload.single('mainimage'),function(req, res, next) {
    var title = req.body.title;
    var category = req.body.category;
    var body = req.body.body;
    var author = req.body.author;
    var date = new Date();

    console.log(date);

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
        res.render('addposts', {"errors": errors});
    }
    else{
        var posts = db.get('posts');
        posts.insert({title : title, body : body, author : author, 
            date : date, category : category, mainimage : mainimage}, function(err, post){
                if(err){
                    res.send(err);
                }
                else{
                    req.flash("success", "The Poast Added");
                    res.location('/');
                    res.redirect('/');
                }
            });
    }
});
module.exports = router;
