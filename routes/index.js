var express = require('express');

var mongoose = require('mongoose');
var router = express.Router();
var URL='mongodb://abmnukmr:12345@ds035703.mlab.com:35703/vioti';
db = mongo.db(URL);

/* GET home page. */

mongoose.connect(URL, function(err){
    if(err){
        console.log('database not connected');
    }

});



router.get('/', function(req, res, next) {
    mongoose.connect(URL, function(err){
        if(err){
            console.log('database not connected');
        }

        var collection = db.collection('profile')
          collection.find(function (err,data) {
              if(err) send(err);
              res.json(data);

          });
    });




});

module.exports = router;
