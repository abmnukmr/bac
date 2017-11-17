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

       const to ="fT3L6c-pOCY:APA91bGcCwjA8CUwpM_246x-QWHWCjrh4zoC4m_qsr1-G8Sh0AAx4axc4zZLgkLXCpRt0ifF_xf-21UrZQVUmh-psNgxX2v5Fh-3FU2jvPBZmAPtNFWwxrQDd7TfMOCWPYIsvJaDyVkV",

       // mutable_content:true,
           // content_available : false,
       //   text: " msgmessage",
        //message: "msg",
      //  priority: 'high',


         notification = {
            title: 'Hello Guys',
            body: 'Thank  you'
        }

        const payload = {
            to,
            notification,
            priority: 'high',
            content_available: true, // tried without too
        }


    fcm.send(payload, function (err,response) {
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
