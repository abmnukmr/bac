/**
 * Created by manyu on 13/08/17.
 */



var URL='mongodb://abmnukmr:12345@ds035703.mlab.com:35703/vioti';
const db = require('monk')(URL)
const users = db.get('profile')
const search = db.get('search')
const cred = db.get('user_detatils')
const addv=db.get('ad_final')
const settings=db.get('settings')
//const notification=db.get('notification')





function socket(io) {


    var online=[];


    io.on('connection',function (socket) {
        console.log("A user is now connected ?"+ socket.id);
        socket.on('getmessage',function (msg) {
            var data={
                user:msg.usr,
                user_name:msg.username
            }
        })

        socket.on('socketjoined',function (room) {
            console.log("user joined",room)
            socket.join(room);
            online.push(room)


        })

        socket.on('gettomessage', function (msg) {


          var t=socket.adapter.rooms[msg.email];
            console.log(socket.adapter.rooms[msg.email]);

             if(t){


                 io.to(msg.email).to(msg.sender_mail).emit('gettomessage', msg)

             }
             else {
                //var token= users.find({"email":msg.email})
                 io.to(msg.sender_mail).emit('gettomessage', msg)
                 triggernotification(msg.email,msg);
                 console.log("Send Notification")

             }
         io.emit('chatlist', msg)


            /// var data= {
            //   user:msg.user,
            ///  user_naem:set_msg.username
            // }

            //  io.sockets.in(data.email).emit('message', {msg: data.message});
            //console.log(data.email);

            console.log(msg);

        })

        socket.on('typing', function (msg) {
            /// var data= {
            //   user:msg.user,
            ///  user_naem:set_msg.username
            // }

            //  io.sockets.in(data.email).emit('message', {msg: data.message});
            //console.log(data.email);
            socket.broadcast.to(msg.email).emit('typingrec', msg)

            console.log(msg);


        })







        socket.on('disconnected', function() {

            socket.emit("closed","closed")


        });








    });






}


function triggernotification(email,msg){



    var  tokenn;
    cred.find({"email":email},function (err, docs) {
        if (err) console.log(err);
        else {
            //res.json(docs[0]);
             var tokennn=docs[0].token
            var checktoken=tokennn.slice(0,email.length)
            if(checktoken==email){
                 tokenn=tokennn(email.length,tokennn.length)
            }
            else {
                tokenn=null
            }


              console.log(tokenn)


            const FCM = require('fcm-node');
// Replace these with your own values.
            const apiKey = "AAAAgPqR_xY:APA91bHetgjKrznUqzsIde8Arpu3nvMrmsG8h5EX_G450TjEkJxOZDsxbhNrkgzHYshtp9_xYyaTWEI7H8y0pYPwvg2EwNZfxqaFm7Xc9ixfvQS6ZoR-B5y7mo8Wws4vrCCrDuYN1N50";
           // const deviceID = tokenn
            const fcm = new FCM(apiKey);
            const to=tokenn

            notification = {
                title: msg.user_sender,
                body: msg.message
                 }

            const payload = {
                to,
                notification,
                priority: 'high',
                content_available: true // tried without too
                }



            fcm.send(payload, function (err,response) {
             /// console.log(tokenn + "fetchig right" + message +msg.message)
                if (err) {
                    console.log(err);
                    cred.update({'email': email},{$push:{lastmessage:msg}},function (err, docs) {
                        if (err) console.log(err);

                        else{ console.log("sucess")};
                    })

                        console.log("Something has gone wrong!");
                } else {

                    cred.update({'email': email},{$push:{lastmessage:msg}},function (err, docs) {
                        if (err) console.log(err);

                        else{ console.log("sucess")};
                    })
                    console.log("Successfully sent with response: ", response);
                }
            });


        }
    })



}


module.exports = socket;
