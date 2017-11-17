var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
/* GET users listing. */
router.get('/', function(req, res, next) {




    const FCM = require('fcm-node');
// Replace these with your own values.
    const apiKey = "AAAAgPqR_xY:APA91bHetgjKrznUqzsIde8Arpu3nvMrmsG8h5EX_G450TjEkJxOZDsxbhNrkgzHYshtp9_xYyaTWEI7H8y0pYPwvg2EwNZfxqaFm7Xc9ixfvQS6ZoR-B5y7mo8Wws4vrCCrDuYN1N50";
   // const deviceID = tokenn
    const fcm = new FCM(apiKey);

    var message = {
        to:"fT3L6c-pOCY:APA91bGcCwjA8CUwpM_246x-QWHWCjrh4zoC4m_qsr1-G8Sh0AAx4axc4zZLgkLXCpRt0ifF_xf-21UrZQVUmh-psNgxX2v5Fh-3FU2jvPBZmAPtNFWwxrQDd7TfMOCWPYIsvJaDyVkV",



        data: {
            //title: "msg.user_sender",
            text: " msg.message",
            //icon: 'noti.png',
            //body: "msg.user_sender",
            message: "msg",
            //image:'https://img13.androidappsapk.co/300/0/d/3/com.vaioti.png',
            //picture:'https://img13.androidappsapk.co/300/0/d/3/com.vaioti.png',
            //image: "https://pbs.twimg.com/profile_images/837060031895896065/VHIQ4oUf_400x400.jpg",
            // image-type: "circle",
            //vibrationPattern: [2000, 1000, 500, 500],
            //ledColor: [0, 0, 255, 0]
        }
    };

    fcm.send(message, function (err,response) {
        //console.log(tokenn + "fetchig right" + message +msg.message)
        if (err) {
            console.log(err);
            //cred.update({'email': email},{$push:{lastmessage:msg}},function (err, docs) {
              //  if (err) console.log(err);
//
  //              else{ console.log("sucess")};
    //        })

            console.log("Something has gone wrong!");
        } else {
//
  //          cred.update({'email': email},{$push:{lastmessage:msg}},function (err, docs) {
    //            if (err) console.log(err);

      //          else{ console.log("sucess")};
        //    })
            console.log("Successfully sent with response: ", response);
        }
    });






  res.send('respond with a resource');
});

module.exports = router;
