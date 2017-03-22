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
const cred = db.get('user_detatils')
const addv=db.get('ad_final')
const settings=db.get('settings')


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


///user profile create
router.post('create/user',function (req,res,next) {


    var name=req.body.name
    var  email=req.body.email
    var  phone=req.body.phone
    var  phone_uid=req.body.phone_uid
    var date=req.body.date
    var otp='0000'
    var lat=req.body.lat
    var lng=req.body.lng





    console.log(req.files[0].location);
    cred.insert({'email': req.params.id}, {$set: {"profileimage": req.files[0].location}}, function (err, res, result) {
        if (err) {
            throw err;
        }

        else {
            console.log("success");
            // res.send(result);
        }
    })

})


/// get all search data

router.get('/search/all/shop', function (req, res, next) {
    search.find({ "search": "gogolio"}, function (err, docs) {
        if (err) console.log(err);

        else {
            console.log("successfully get");
            console.log(docs);
            res.json(docs[0])

        }

    })
});




//// send message



router.get('/profile/upload/email/profilepic/:id',function (req,res,next){

    res.render('profile');


})


//// add profile pic//

router.post('/profile/upload/email/profilepic/:id',upload.any(),function (req,res,next) {

    console.log(req.files[0].location);
    users.update({'email':req.params.id},{$set: {"profileimage":req.files[0].location}}, function( err,res, result ) {
        if ( err ) {throw err;}

        else {
            console.log("success");
            // res.send(result);
        }
    })
    res.send(req.files[0]);

    search.update({"search":"gogolio","location.email":req.params.id},{$set:{"location.$.profileimage":req.files[0].location}},false ,
        true
        ,function (err,res,result) {
            if(err)res.send(err);
            else{ console.log("updated profile in search done");


            }


        });




})


////// add more photos//

router.post('/profile/upload/email/addmore/:id',upload.any(),function (req,res,next) {


    var id2=req.body.id4;

    console.log(req.files[0].location);
    users.update({'email':req.params.id,"item.id":id2},{$push: {"item.$.image":{"location":req.files[0].location}}}, function( err,res, result ) {
        if ( err ) {throw err;}

        else {
            console.log("success");
            // res.send(result);
        }
    })
    res.send(req.files[0]);


})



///////change shop status////


router.post('/profile/upload/email/status/:id',upload.any(),function (req,res,next) {

    //console.log(req.files[0]);
    users.update({'email':req.params.id},{$set: {"status":req.body.status}}, function( err,res, result ) {
        if ( err ) {throw err;}

        else {
            console.log("success");
            // res.send(result);
        }
    })

    search.update({"search":"gogolio","location.email":req.params.id},{$set:{"location.$.status":req.body.status}},false ,
        true
        ,function (err,res,result) {
            if(err)res.send(err);
            else{ console.log("updated profile in search done");


            }


        });



    res.send("status updated");
    res.end();






})


////// phone no visiblity

router.post('/profile/upload/email/status/phonevisible/:id',upload.any(),function (req,res,next) {

    //console.log(req.files[0]);
    users.update({'email':req.params.id},{$set: {"status_phone":req.body.statuss}}, function( err,res, result ) {
        if ( err ) {throw err;}

        else {
            console.log("success");
            // res.send(result);
        }
    })



    res.send("status updated");
    res.end();






})


//////like a shop
router.post('/profile/like/shop/:id',function (req,res,next) {

    emailfav={
        "email":req.body.useremail
    }
    users.update({'email':req.params.id},{$push: {"fav":emailfav}}, function( err,res, result ) {
        if ( err ) {throw err;}

        else {
            console.log("success");
        }
    });

    var dateobj= new Date() ;
    var month = dateobj.getMonth() + 1;
    var day = dateobj.getDate() ;
    var year = dateobj.getFullYear();


    liked={

        "name": req.body.name,
        "profileimage":req.body.profileimage,
        "catagory": req.body.catagory,
        "email": req.params.id,
        "status": req.body.status,
        "id":year+month+day

    }
    userid=req.body.useremail

    cred.update({"email":userid},{$push:{"fav":liked }},false ,
        true
        ,function (err,res,result) {
            if(err)res.send(err);
            else{ console.log("updated location in search done");


            }


        });



    res.send("status updated");
    res.end();





})


/////unlike a shop


router.post('/profile/dislike/shop/:id',function (req,res,next) {

  ///////user email
        emaildelete=req.body.useremail

    users.update({'email':req.params.id},{$pull: {"fav":{"email": emaildelete}}}, function( err,res, result ) {
        if ( err ) {throw err;}

        else {
            console.log("success");
        }
    });




    cred.update({"email":req.body.useremail},{$pull:{"fav":{"email":req.params.id} }},false ,
        true
        ,function (err,res,result) {
            if(err)res.send(err);
            else{ console.log("updated location in search done");


            }


        });

    res.send("done deleted");
    res.end();





})











//// update location
router.post('/profile/upload/email/location/:id',function (req,res,next) {

    users.update({'email':req.params.id},{$set: {"lat":req.body.lat,"lng":req.body.lng}}, function( err,res, result ) {
        if ( err ) {throw err;}

        else {
            console.log("success");
        }
    });

    search.update({"search":"gogolio","location.email":req.params.id},{$set:{"location.$.lat":req.body.lat,"location.$.lng":req.body.lng}},false ,
        true
        ,function (err,res,result) {
            if(err)res.send(err);
            else{ console.log("updated location in search done");


            }


        });



    res.send("status updated");
    res.end();





})












//// delete item ////


router.get('/profile/email/:email/delete/:id',function(req, res,next) {
       id2=req.params.id;

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


//// update item




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


//// update contact


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


    search.update({"search":"gogolio","location.email":req.params.id},{$set:{"location.$.phone":phone,"location.$.whatsapp":whatsapp}},false ,
        true
        ,function (err,res,result) {
            if(err)res.send(err);
            else{ console.log("updated contact done");


            }


        });



});


///update title

router.post('/profile/email/update/title/:id',function(req, res,next) {
    name = req.body.shopname;
    location = req.body.shoplocation;
     catagory=req.body.shopcata;
    // id2=req.body.item_id

    users.update({"email": req.params.id},
        {$set: {"name": name, "address": location,"catagory":catagory}}, false,
        true
        , function (err, res, result) {
            if (err) res.send(err);
            else {
                console.log("updated contact done");

                console.log(id2);
            }


        });

    search.update({"search":"gogolio","location.email":req.params.id},{$set:{"location.$.name":name,"location.$.address":location,"location.$.catagory":catagory}},false ,
        true
        ,function (err,res,result) {
            if(err)res.send(err);
            else{ console.log("updated title done");


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


//// create an user

router.post('/user/create/new', function (req, res, next) {


    var d=new Date();
    var m=("0" + (d.getMonth() + 1)).slice(-2);
    var y=d.getFullYear();
    var d=("0" + (d.getDate() )).slice(-2);
    detail={
        "name":req.body.name,
        "phone": req.body.phone,
        "lat": req.body.lat,
        "lng": req.body.lng,
        "email":req.body.email,
        "otp":req.body.otp,
        "date":y.toString()+m.toString()+d.toString(),
        "fav":[],
        "scan":[]

    }
    cred.insert(detail, function (err, docs) {
        if (err) console.log(err);

        else res.send("successfully");
    })
});

/////sendotp:-
router.post('/user/create/otp/:id', function (req, res, next) {

   var otp=req.body.otp;
   cred.update({"email":req.params.id},{$set:{"otp":otp}}, function (err, docs) {
        if (err) console.log(err);

        else res.send("successfully");
    })
});



////get addvertisment

router.get('/addver/all', function (req, res, next) {

    // otp=req.body.otp;
    addv.find(function (err, docs) {
        if (err) console.log(err);

        else res.json(docs[0]);

    })
    res.send("successfully");
});


/////false





router.get('/user/create/new', function (req, res, next) {


    var d=new Date();
    var m=("0" + (d.getMonth() + 1)).slice(-2);
    var y=d.getFullYear();
    var d=("0" + (d.getDate() )).slice(-2);
    detail={
        "name":req.body.name,
        "phone": req.body.phone,
        "lat": req.body.lat,
        "lng": req.body.lng,
        "email":req.body.email,
        "otp":req.body.otp,
        "date":y.toString()+m.toString()+d.toString(),
        "fav":[],
        "scan":[]

    }
    cred.insert(detail, function (err, docs) {
        if (err) console.log(err);

        else res.send("succefully");
    })
});



//check date get
/*
router.get('/user/create/new', function (req, res, next) {

     var d=new Date();
     var m=("0" + (d.getMonth() + 1)).slice(-2);

     var y=d.getFullYear();
     var d=("0" + (d.getDate() )).slice(-2);
console.log(y.toString()+m.toString()+d.toString());
   res.send(y.toString()+m.toString()+d.toString());


});

*/








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


    ///////// get all favourate

router.get('/favourite/user/:id', function (req, res, next) {
    cred.find({'email': req.params.id}, function (err, docs) {
        if (err) console.log(err);

        else res.json(docs[0]);
    })
});

////// post  scanned shop

router.post('/favourite/user/scan/:id', function (req, res, next) {



    detail={
             "name":req.body.name,
             "profileimage": req.body.profileimage,
             "catagory": req.body.catagory,
             "email": req.body.email,
             "id":Date.now()

           }
    cred.update({'email': req.params.id},{$push:{scan:detail}}, function (err, docs) {
        if (err) console.log(err);

        else res.json(docs[0]);
    })
});



router.post('/favourite/user/scan/delete/:id', function (req, res, next) {

     id4=req.body.iddel

    cred.update({'email': req.params.id},{$pull:{scan:{"id":id4}}}, function (err, docs) {
        if (err) console.log(err);

        else res.json(docs[0]);
    })
});



module.exports = router;