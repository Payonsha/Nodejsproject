var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('subjects.ejs', { title: 'Subjects' });
});

module.exports = router;