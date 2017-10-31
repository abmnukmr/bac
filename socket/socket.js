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
const notification=db.get('notification')





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


           // console.log(socket.adapter.rooms[msg.email]);

            /// var data= {
            //   user:msg.user,
            ///  user_naem:set_msg.username
            // }

            //  io.sockets.in(data.email).emit('message', {msg: data.message});
            //console.log(data.email);
            io.to(msg.email).emit('gettomessage', msg)

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
module.exports = socket;
