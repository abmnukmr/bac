var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

/* GET home page. */

mongoose.connect('mongodb://abmnukmr:12345@ds035703.mlab.com:35703/vioti', function(err){
    if(err){
        console.log('database not connected');
    }
});
router.get('/', function(req, res, next) {
  res.render('index', { title: 'abmnu' });

});

module.exports = router;
