/**
 * Created by manyu on 13/08/17.
 */



function socket(io) {


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

        })
        socket.on('message', function (msg) {
            /// var data= {
            //   user:msg.user,
            ///  user_naem:set_msg.username
            // }

            //  io.sockets.in(data.email).emit('message', {msg: data.message});
            //console.log(data.email);
            io.to(msg.email).emit('message', msg)

            console.log(msg);

        })

        socket.on('typing', function (msg) {
            /// var data= {
            //   user:msg.user,
            ///  user_naem:set_msg.username
            // }

            //  io.sockets.in(data.email).emit('message', {msg: data.message});
            //console.log(data.email);
            socket.broadcast.emit('typing', msg)

            console.log(msg);

        })

        socket.on('disconnect', function () {
            socket.removeAllListeners('getmessage');
            socket.removeAllListeners('socketjoined');
            socket.removeAllListeners('message');
            socket.removeAllListeners('typing');
            io.removeAllListeners('connection');
        });



    });



}
module.exports = socket;