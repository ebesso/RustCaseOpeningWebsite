const User = require('../resources/models/user')

module.exports = function(io){
    
    io.sockets.on('connection', function(socket){

        var socketUser;

        if(socket.request.session && socket.request.session.passport && socket.request.session.passport.user){

            User.findOne({steamid: socket.request.session.passport.user}, 'steamid balance', function(err, user){
                user.getSteamProfile(function(err, profile){
                    socketUser = profile
                });
            });
            
        }
        
        socket.on('messageSent', function(msg){

            var data = {
                sender: socketUser,
                text: msg
            }

            socket.emit('newMessage', data);
            socket.broadcast.emit('newMessage', data);
    
        });
    });

}