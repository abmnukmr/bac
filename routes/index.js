var express = require('express');
var router = express.Router();
var mongoose=require('mongoose');
var URL='mongodb://abmnukmr:12345@ds035703.mlab.com:35703/vioti';
const db = require('monk')(URL)
const users = db.get('profile')

/*
users.find(function (err,data) {
    if(err) console.log(err);
    console.log(data);

})
*/

router.get('/profile/:id', function(req, res, next) {
    users.find({'email':req.params.id },function (err,docs) {
        if(err) console.log(err);
        else res.send.JSON.parse(docs);

    })

  });

module.exports = router;
