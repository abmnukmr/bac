var express = require('express');
var router = express.Router();

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





  router.get('/profile/upload/email/:id',function (req,res,next) {
    res.render('index');
    // console.log(req.params.id1,req.params.id2,req.params.id3,req.params.id4+" Hello");

  })

   router.post('/profile/upload/email/:id',upload.any(),function (req,res,next) {

  //  res.send(req.files);
    //console.log(req.files);

    items={
        "itemname":req.body.itemname,
        "itemno" : req.body.itemno,
        "discription" :req.body.discription,
        "price": req.body.itemprice,
        "id" : Date.now()+"gne5cr5der",
        "image":req.files
    }

     //  console.log(res.params.id1,res.params.id2,res.params.id3,res.params.id4+" Hellopost");
    console.log(items);
    ///item is main key
    users.update({'email':req.params.id},{$push: {item:items}}, function( err,res, result ) {
        if ( err ) {throw err;}

         else {
        console.log("success");
       // res.send(result);
        }
    })
       res.send("succesfully done");


   })


router.get('/profile/upload/email/profilepic/:id',function (req,res,next){

    res.render('profile');


})




router.post('/profile/upload/email/profilepic/:id',upload.any(),function (req,res,next) {

    //  res.send(req.files);
    //console.log(req.files);

  /*  items={
        "itemname":req.body.itemname,
        "itemno" : req.body.itemno,
        "discription" :req.body.discription,
        "price": req.body.itemprice,
        "id" : Date.now()+"gne5cr5der",
        "image":req.files[0]
    }
*/
    //  console.log(res.params.id1,res.params.id2,res.params.id3,res.params.id4+" Hellopost");
   // console.log(items);
    ///item is main key
    console.log(req.files[0]);
    users.update({'email':req.params.id},{$set: {"profileimage":req.files[0]}}, function( err,res, result ) {
        if ( err ) {throw err;}

        else {
            console.log("success");
            // res.send(result);
        }
    })
    res.send(req.files[0]);


})









router.get('/profile/email/:email/delete/:id',function(req, res,next) {
      //  id9=req.params.id;
       id2=req.params.id;
     //  console.log("deleted");
    //   console.log(req.params.id);

       users.update({"email":req.params.email},
           { $pull: { item:{"id":id2}}},
           { multi: true},function (err,res,result) {
               if(err)res.send(err);
               else{ console.log("deleted");

               console.log(id2);
               }


           });



       //res.send("deleted Successfully");
       console.log("deleted Successfully");

       //res.end();


});

router.post('/profile/email/update/item/:id',function(req, res,next) {
      itemname=req.body.item_name;
      itemno=req.body.item_number;
      discr=req.body.item_discription;
      prc=req.body.item_price;
      id2=req.body.item_id

    users.update({"email":req.params.id,"item.id":id2},
        { $set:{"item.$.itemname": itemname, "item.$.itemno":itemno, "item.$.discription":discr, "item.$.price":prc}},false ,
        true
        ,function (err,res,result) {
            if(err)res.send(err);
            else{ console.log("updated done");

                console.log(id2);
            }


        });



    //res.send("deleted Successfully");
    console.log("update Successfully");

    res.send("updated");
   res.end();

});



router.post('/profile/email/update/item/:id',function(req, res,next) {
    itemname=req.body.item_name;
    itemno=req.body.item_number;
    discr=req.body.item_discription;
    prc=req.body.item_price;
    id2=req.body.item_id

    users.update({"email":req.params.id,"item.id":id2},
        { $set:{"item.$.itemname": itemname, "item.$.itemno":itemno, "item.$.discription":discr, "item.$.price":prc}},false ,
        true
        ,function (err,res,result) {
            if(err)res.send(err);
            else{ console.log("updated done");

                console.log(id2);
            }


        });



    //res.send("deleted Successfully");
    console.log("update Successfully");

    res.send("updated");
    res.end();

});

router.post('/profile/email/update/item/:id',function(req, res,next) {
    itemname=req.body.item_name;
    itemno=req.body.item_number;
    discr=req.body.item_discription;
    prc=req.body.item_price;
    id2=req.body.item_id

    users.update({"email":req.params.id,"item.id":id2},
        { $set:{"item.$.itemname": itemname, "item.$.itemno":itemno, "item.$.discription":discr, "item.$.price":prc}},false ,
        true
        ,function (err,res,result) {
            if(err)res.send(err);
            else{ console.log("updated done");

                console.log(id2);
            }


        });



    //res.send("deleted Successfully");
    console.log("update Successfully");

    res.send("updated");
    res.end();

});


router.post('/profile/email/update/contact/:id',function(req, res,next) {
    phone=req.body.phone;
    whatsapp=req.body.whatsapp;
   // id2=req.body.item_id

    users.update({"email":req.params.id},
        { $set:{"phone": phone, "whatsapp":whatsapp}},false ,
        true
        ,function (err,res,result) {
            if(err)res.send(err);
            else{ console.log("updated contact done");

                console.log(id2);
            }


        });



    //res.send("deleted Successfully");
    console.log("update Successfully");

    res.send("updated");
    res.end();

});
router.post('/profile/email/update/title/:id',function(req, res,next) {
    name = req.body.shopname;
    location = req.body.shoplocation;
    // id2=req.body.item_id

    users.update({"email": req.params.id},
        {$set: {"name": name, "address": location}}, false,
        true
        , function (err, res, result) {
            if (err) res.send(err);
            else {
                console.log("updated contact done");

                console.log(id2);
            }


        });

    });




    router.post('/profile/email/update/dis/:id', function (req, res, next) {
        discription = req.body.discription;
        // id2=req.body.item_id

        users.update({"email": req.params.id},
            {$set: {"discription": discription}}, false,
            true
            , function (err, res, result) {
                if (err) res.send(err);
                else {
                    console.log("updated contact done");

                    console.log(id2);
                }


            });


        //res.send("deleted Successfully");
        console.log("update Successfully");

        res.send("updated");
        res.end();

    });

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


    router.get('/profile/:id', function (req, res, next) {
        users.find({'email': req.params.id}, function (err, docs) {
            if (err) console.log(err);

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
    router.get('/all', function (req, res, next) {
        users.find(function (err) {
            if (err) console.log(err);
            else  console.log("inserted");
            res.send("inserted");

        })
    });


    module.exports = router;