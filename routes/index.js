var express = require('express');
var aws = require('aws-sdk');
var router = express.Router();
var multerS3 = require('multer-s3');
var multer = require('multer');
var URL='mongodb://abmnukmr:12345@ds035703.mlab.com:35703/vioti';
const db = require('monk')(URL)
const users = db.get('profile')
const search = db.get('search')



aws.config.loadFromPath('./config.json');
/*var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images')
    },
    filename: function (req, file, cb) {
        cb(null,   Date.now()+file.originalname);
    }
});*/
//var upload = multer({ storage: storage });
var s0 = new aws.S3({})


var upload = multer({
    storage: multerS3({
        s3: s0,
        bucket: 'vioti',
       accessKeyId:'AKIAI3Q6TFHIZE67TWSQ',
       secretAccessKey: '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',

        metadata: function (req, file, cb) {
            cb(null, {fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString())
        }
    })
})





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
/*
router.get('/:id', function(req, res, next) {
    users.insert({'email':req.params.id },function (err) {
        if(err) console.log(err);
        else  console.log("inserted"); res.send("inserted");

    })
});
*/
router.get('/all', function(req, res, next) {
    users.find(function (err) {
        if(err) console.log(err);
        else  console.log("inserted"); res.send("inserted");

    })
});




module.exports = router;
