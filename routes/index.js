var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

/* GET home page. */

mongoose.connect('mongodb://abmnukmr:12345@ds035703.mlab.com:35703/vioti', function(err){
    if(err){
        console.log('database not connected');
    }
    console.log('connected');

});

mongoose.connection.once('connected', function() {
    console.log("Connected to database")
});


router.get('/', function(req, res, next) {
  res.render('index', { title: 'abkgkgmnu' });

    console.log("sadbjsa");
});

module.exports = router;
