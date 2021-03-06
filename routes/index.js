
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
const notificationn=db.get('notification')


aws.config.loadFromPath('./config.json');
aws.config.update({
    signatureVersion: 'v4'
});
var s0 = new aws.S3({})


var upload = multer({
    storage: multerS3({
        s3: s0,
        bucket: 'vaiotiaws',
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
        "image":req.files,
       "link":req.body.link,
       "label":req.body.label,
    }
    var trigger=req.body.trigger;
       
       
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
       if(trigger==true) {
         users.find({'email': req.params.id}, function (err, docs) {
             //console.log("updated is needed")
             if (err) console.log(err);

             else {
                 //res.json(docs[0]);

                 var fav = docs[0].fav

                 console.log(JSON.stringify(fav))
                 for (let i=0; i < fav.length; i++) {

                     triggernotification(fav[i].email, docs[0].name, discr, req.params.id)

                 }

             }

         })

     }else {

     }


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



///// quick list
router.post('/profile/email/update/dis/quicklist/:id',function(req,res,next){

   users.update({'email':req.params.id},{$set:{"quicklist":req.body.quicklist}},false,true,function(err,result){
    if(err){console.log(err)}
    else{
       console.log("Success")
      }
})
res.send("starus")
 res.end()
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


///// get all notifiaction
router.get('/public/notification',function (req,res,next) {
     notificationn.find({"note":"notification"},function (err,docs) {
        if(err) console.log(err)
         else {
            res.json(docs[0])
        }
     })

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
    link=req.body.link;
    label=req.body.label;
    trigger=req.body.trigger;
    users.update({"email":req.params.id,"item.id":id2},
        { $set:{"item.$.itemname": itemname, "item.$.itemno":itemno, "item.$.discription":discr, "item.$.price":prc}},false ,
        true
        ,function (err,res,result) {
            if(err){
                res.send(err);
            }

            else
                {
                   console.log("updated done");


                   res.send("hkhk")
                console.log(id2);
            }

            console.log("update Successfully");



            });
    res.send("updated");
    res.end();

    console.log("update Successfully");

     if(trigger==true) {
         users.find({'email': req.params.id}, function (err, docs) {
             //console.log("updated is needed")
             if (err) console.log(err);

             else {
                 //res.json(docs[0]);

                 var fav = docs[0].fav

                 console.log(JSON.stringify(fav))
                 for (let i=0; i < fav.length; i++) {

                     triggernotification(fav[i].email, docs[0].name, discr, req.params.id)

                 }

             }

         })

     }else {

     }






    //res.send("deleted Successfully");

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
    linki=req.body.link;

    users.update({"email": req.params.id},
        {$set: {"name": name, "address": location,"catagory":catagory,"link":linki}}, false,
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


    cred.find({"email": req.params.email}, function (err, docs) {

        // res.json(docs.length)

        if (docs.length < 1) {
            var d = new Date();
            var m = ("0" + (d.getMonth() + 1)).slice(-2);
            var y = d.getFullYear();
            var d = ("0" + (d.getDate() )).slice(-2);
            detail = {
                "name": req.body.name,
                "phone": req.body.phone,
                "lat": req.body.lat,
                "lng": req.body.lng,
                "email": req.body.email,
                "otp": req.body.otp,
                "date": y.toString() + m.toString() + d.toString(),
                "fav": [],
                "scan": [],
                "token":""
            }
            cred.insert(detail, function (err, docs) {
                if (err) console.log(err);

                else res.send("successfully");
            })
        }
        else {
            res.send("error")
        }

    });
})

/////sendotp:-
router.post('/user/create/otp/:id', function (req, res, next) {

   var otp=req.body.otp;
   var phone=req.body.phone;
   cred.update({"email":req.params.id},{$set:{"otp":otp,"phone":phone}}, function (err, docs) {
        if (err) console.log(err);

        else{ res.json(docs[0]);
            res.end();

        }

   })
     console.log("fjfjyry");

});



////get addvertisment

router.get('/addver/all', function (req, res, next) {

    // otp=req.body.otp;
    addv.find({"advr":"cool"},function (err, docs) {
        if (err) console.log(err);

        else {
            res.json(docs[0]);
             console.log(docs[0]);
        }

    })

});


/////false










     /// add a shop
     router.post('/profile/shop/add/:id', function(req, res, next) {



         users.find({"email":req.params.email},function (err,docs) {

             // res.json(docs.length)

             if(docs.length<1) {

                 var d = new Date();
                 var m = ("0" + (d.getMonth() + 1)).slice(-2);
                 var y = d.getFullYear();
                 var d = ("0" + (d.getDate() )).slice(-2);


                 var shop = {

                     "name": req.body.name,
                     "address": req.body.address,
                     "whatsapp": req.body.whats,
                     "phone": req.body.phone,
                     "profileimage": "http://cache3.asset-cache.net/xc/470259759.jpg?v=2&c=IWSAsset&k=2&d=_VHJK9wJYZHoCONxXGGQrSFCmgH-_LMXYoxZwqsEeoA1",
                     "lat": req.body.lat,
                     "lng": req.body.lng,
                     "email": req.params.id,
                     "status_phone": "true",
                     "date": y.toString() + m.toString() + d.toString(),
                     "discription": req.body.discription,
                     "catagory": req.body.catagory,
                     "visits": "2",
                     "device": req.body.device,
                     "status": "true",
                     "fav": [],
                     "item": []

                 }

                 sear = {
                     "name": req.body.name,
                     "address": req.body.address,
                     "phone": req.body.phone,
                     "profileimage": "http://cache3.asset-cache.net/xc/470259759.jpg?v=2&c=IWSAsset&k=2&d=_VHJK9wJYZHoCONxXGGQrSFCmgH-_LMXYoxZwqsEeoA1",
                     "lat": req.body.lat,
                     "lng": req.body.lng,
                     "email": req.params.id,
                     "catagory": req.body.catagory,
                     "visits": "2",
                     "status": "true",

                 }
                 users.insert(shop, function (err, docs) {
                     if (err) console.log(err);

                     else res.json(docs[0]);
                 })
                 search.update({"search": "gogolio"}, {$push: {"location": sear}}, false,
                     true
                     , function (err, res, result) {
                         if (err) res.send(err);
                         else {
                             console.log("updated title done");
                         }


                     });
             }else {

                 res.send("error")
             }
         })


     });




/////deleteshop
///delete a shop
router.get('/delete/shop/:id',function (req,res,next) {
    users.remove({"email":req.params.id},function (err,docs) {
        if(err) console.log(err);

        else res.json(docs[0]);
    });

    search.update({"search":"gogolio"},{$pull:{"location":{"email":req.params.id}}},false ,
        true
        ,function (err,res,result) {
            if(err)res.send(err);
            else{ console.log("updated title done");
            }


        });



})


////////////get shop profile

  router.get('/profile/:id', function (req, res, next) {
        users.find({'email': req.params.id}, function (err, docs) {
            if (err) console.log(err);

            else res.json(docs[0]);
        })
    });

    ///


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


//// push notification tokenb

router.post('/user/noti/token/:id',function (req,res,next) {

  cred.update({'email': req.params.id},{$set:{"token":req.body.token}},function (err, docs) {
      if (err) console.log(err);

      else res.json(docs[0]);
  })
})



router.post('/user/noti/lastmessage/:id',function (req,res,next) {

  // var id2=req.body.tid
    cred.update({"email":req.params.id},{ $pull: { lastmessage:{"tid":req.body.tid}}},
    { multi: true},function (err,res,result) {
        if(err)res.send(err);
        else{ console.log("deleted");
            //res.end("deleted")
           // console.log(id2);
        }


    });
    res.send("")

})

router.get('/tes/:id1/:id2',function (req,res,next) {

  //  console.log(req.query.id1+req.query.id2
      res.send(req.params.id1+req.params.id2)

})





function triggernotification(email,title,body,sender){



    const FCM = require('fcm-node');

    var  tokenn;
    cred.find({"email":email},function (err, docs) {
        if (err) console.log(err);
        else {
            //res.json(docs[0]);

            var tokennn=docs[0].token
            if(tokennn==undefined){
//         sendmail(email,"Mail Notification",msg.message)
//           sendmail("abmnukmr@gmail.com","Mail notification","hfgjshdgfsdjhffahfjahjhafdshf");

            }          else{

                console.log(tokennn)
                //             sendmail(email,"Mail Notification",msg.message)
                //           sendmail("abmnukmr@gmail.com","Mail Notification","jgfsajdhgfjhasd")
                var checktoken=tokennn.slice(0,email.length)
                console.log(checktoken)
                if(checktoken==email){
                    var  tokenn=tokennn.slice(email.length,tokennn.length)
                }

                else {
                    // var  tokenn=null
                }
            }

            console.log(tokenn)


            // Replace these with your own values.
            const apiKey = "AAAAgPqR_xY:APA91bHetgjKrznUqzsIde8Arpu3nvMrmsG8h5EX_G450TjEkJxOZDsxbhNrkgzHYshtp9_xYyaTWEI7H8y0pYPwvg2EwNZfxqaFm7Xc9ixfvQS6ZoR-B5y7mo8Wws4vrCCrDuYN1N50";
            // const deviceID = tokenn
            const fcm = new FCM(apiKey);
            const to=tokenn

            notification = {
                title: title,
                body: body,
                sound:"default",

            }

            data={
                nevigate:'wendor',
                sender:sender

            }

            const payload = {
                to,
                data,

                notification,

                content_available: true // tried without too
            }



            fcm.send(payload, function (err,response) {
                /// console.log(tokenn + "fetchig right" + message +msg.message)
                if (err) {
                    console.log(err);


                    console.log("Something has gone wrong!");
                } else {

                   /// console.log(payload)
                    console.log("Successfully sent with response: ", response);
                }
            });


        }
    })



}


function sendmail(data,sub, message) {
        var transporter = nodemailer.createTransport(smtpTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: 'vaiotiservices@gmail.com',
                pass: 'Arjunsingh1$'
            }
        }));


        var  mail = {
            from: 'VAIOTI<vaioti@noreply.com>', // sender address
            to: data, // list of receivers
            subject: sub, // Subject line
            text: message, // plain text body
            // html: '<b>Hello world?</b>' // html body
        };

        transporter.sendMail(mail, function(err, res){
            if (err)
                console.log(err)
            else
                console.log(res);
        });


    }



module.exports = router;
