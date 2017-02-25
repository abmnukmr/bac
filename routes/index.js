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
aws.config.update({
    signatureVersion: 'v4'
});
var s0 = new aws.S3({})


var upload = multer({
    storage: multerS3({
        s3: s0,
        bucket: 'vioti',
        acl: 'public-read',
//       accessKeyId:'AKIAI3Q6TFHIZE67TWSQ',
  //     secretAccessKey: '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',

        metadata: function (req, file, cb) {
            cb(null, {fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
            cb(null, Date.now()+file.originalname)
        }
    })
})





  router.get('/profile/upload/email/abmnukmr@gmail.com',function (req,res,next) {
    res.render('index');
    // console.log(req.params.id1,req.params.id2,req.params.id3,req.params.id4+" Hello");

  })

   router.post('/profile/upload/email/abmnukmr@gmail.com',upload.any(),function (req,res,next) {

  //  res.send(req.files);
    //console.log(req.files);

    items={
        "itemno" : "res.body.id2",
        "description" :"res.body.id3",
        "price": "res.body.id4",
        "id" : Date.now(),
        "image":req.files
    }

     //  console.log(res.params.id1,res.params.id2,res.params.id3,res.params.id4+" Hellopost");
    console.log(items);
    ///item is main key
    users.update({'email':'abmnukmr@gmail.com'},{$push: {item:items}}, function( err,res, result ) {
        if ( err ) {throw err;}

         else {
        console.log("success");
       // res.send(result);
        }
    })
       res.send("succesfully done");


   })


/*
users.find(function (err,data) {
    if(err) console.log(err);
    console.log(data);

})
*/


/*

router.post('/profile/add/:id', function(req, res, next) {
    var shop={
        "name": req.body.name,
        "address": req.body.address,
        "whatsapp": req.body.whatsapp,
        "phone": req.body.phone,
        "lat": req.body.lat,
        "lng": req.body.lng,
        "email": req.body.email,
        "discription": req.body.discription,
        "folowers": "2",
        "status": "true",

    }
    users.insert(shop,function (err,docs) {
        if(err) console.log(err);

        else res.json(docs[0]);
    })
});
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
