
$(document).ready(function(){
    console.log('Trying to connect to client');
    var socket = io();
    
    $('#sendButton').click(function(){
        socket.emit('messageSent', $('#messageInput').val());
    });

    socket.on('newMessage', function(data){

        var messageList = document.getElementById('message-history');
        
        var messageObj = document.createElement('li');
        messageObj.setAttribute('class', 'message')
        
        var text = document.createElement('p');
        text.setAttribute('class', 'message-text');

        var image = document.createElement('img');
        image.setAttribute('src', 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/ca/' + data.sender.avatarHash + '.jpg');
        image.setAttribute('alt', 'avatar');
        image.setAttribute('class', 'chat-image');

        var username = document.createElement('strong');
        username.innerHTML = data.sender.name + ': ';

        var message = document.createElement('span');
        message.innerHTML = data.text;

        messageObj.appendChild(image);
        messageObj.appendChild(text);
        text.appendChild(username);
        text.appendChild(message);
        
        messageList.appendChild(messageObj);
        
    
    });

});