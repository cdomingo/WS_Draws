var app = require('http').createServer(handler); //import http module and create server passing in callback to fire
var io = require('socket.io')(app); //import socket.io module and pass the http server to it
var fs = require('fs'); //pull in file system module

//set port, process.env.PORT or process.env.NODE_PORT for heroku or a number for local
var port = process.env.PORT || process.env.NODE_PORT || 3000;

//have the http server start listening on the port
app.listen(port);

//callback for the http server
function handler (req, res) {
  //read in the html file to serve. On callback, send it back to the client
  fs.readFile(__dirname + '/../client/index.html', function (err, data) {
    if (err) {
      throw err;
    }

    //write a 200 success
    res.writeHead(200);
    //end the response and pass the data read from the html file (the html code) to the client
    res.end(data);
  });
}

//tell the io server to listen for new connections
//On each connection, you will get the socket for that user
io.on("connection", function(socket) {
    
    //add the new socket to a room
    //We will use the same room for everyone instead of different rooms
    //The room name is just arbitrary. You can call the room(s) whatever you want
    //or join a user to multiple rooms
    socket.join("room1");
    
    //on 'draw' message types from the client, fire this method
    socket.on('draw', function(data) {
       //use the socket's broadcast method to send a message to everyone ELSE in the specified room
       //broadcast goes to everyone except the user that sent it
       //io.sockets.in goes to everyone including the user that sent it
       //The following emits a drawclient message type and the received data to everyone except the user sending it
       socket.broadcast.to('room1').emit('drawclient', data); 
    });
    
    //on 'disconnect' message types from the client, fire this method
    //Disconnect can be called manually, but it also happens automatically
    //For this reason the disconnect message type is reserved by socket.io
    socket.on("disconnect", function(data) {
        //remove the user's socket from the current room because they got disconnected
        socket.leave("room1");
    });
});







