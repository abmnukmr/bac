var express = require('express');
var router = express.Router();
var multer = require('multer');
var URL='mongodb://abmnukmr:12345@ds035703.mlab.com:35703/vioti';
const db = require('monk')(URL)
const users = db.get('profile')
const search = db.get('search')


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images')
    },
    filename: function (req, file, cb) {
        cb(null,   Date.now()+file.originalname);
    }
});
var upload = multer({ storage: storage });


router.get('/profile/upload',function (req,res,next) {
    res.render('index');


})

router.post('/profile/upload',upload.any(),function (req,res,next) {

    res.send(req.files);
    console.log(req.files);


})


/*
users.find(function (err,data) {
    if(err) console.log(err);
    console.log(data);

})
*/

router.get('/profile/:id', function(req, res, next) {
    users.find({'email':req.params.id },function (err,docs) {
        if(err) console.log(err);
        else res.json(docs[0]);
    })
});

router.get('/:id', function(req, res, next) {
    users.insert({'email':req.params.id },function (err) {
        if(err) console.log(err);
        else  console.log("inserted"); res.send("inserted");

    })
});

router.get('/all', function(req, res, next) {
    users.find(function (err) {
        if(err) console.log(err);
        else  console.log("inserted"); res.send("inserted");

    })
});




module.exports = router;
