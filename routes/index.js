var express = require('express');

var mongoose = require('mongoose');
var router = express.Router();
var URL='mongodb://abmnukmr:12345@ds035703.mlab.com:35703/vioti';

/* GET home page. */
/*
mongoose.connect(URL, function(err){
    if(err){
        console.log('database not connected');
    }

});
*/


router.get('/', function(req, res, next) {
 res.send('fhjfgh');


});

module.exports = router;
