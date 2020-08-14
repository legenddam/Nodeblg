var express = require('express');
var router = express.Router();

  
/* GET Posts*/
router.get('/add', function(req, res, next) {

    res.render('addcategories', {title : "Add Categories"});

});

router.post('/add', function(req, res, next){

    var name = req.body.name;
    var db = req.db;

    //Form validation
    req.checkBody('name', 'Name field is required').notEmpty();
 
    var errors = req.validationErrors();
    if(errors){
        res.render('addcategories', {"errors": errors});
    }
    else{
        var categories = db.get('categories');
        categories.insert({name : name}, function(err, category){
                if(err){
                    res.send(err);
                }
                else{
                    req.flash("success", "The Category Added");
                    res.location('/');
                    res.redirect('/');
                }
            });
    }
});
module.exports = router;
