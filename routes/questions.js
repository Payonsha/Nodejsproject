var express = require('express');
var router = express.Router();
var Dsc = require('../models/discussionsmodel.js');

router.get('/:id', function(req, res, next) { 
   var id = req.params.id;
    console.log("tagnaid " + id);

    Dsc.findOne({discussionID: id}, function(err, doc){
        console.log("log doc van in de route " + doc);
        res.render('questions.ejs', {docs: doc});
    });
});

/*router.get('/', function(req, res, next) { 
    res.render('questions.ejs', { title: 'Questions' });
});*/

module.exports = router;