var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

/* GET home page. */

var db=mongoose.connect('mongodb://abmnukmr:12345@ds035703.mlab.com:35703/vioti', function(err){
    if(err){
        console.log('database not connected');
    }
    console.log('connected');

});



router.get('/', function(req, res, next) {

  db.collection('profle').find(function (err,data) {

    if(err){
      console.log('hhjhfgsj');

    }
    res.json(data);
  });

});

module.exports = router;
