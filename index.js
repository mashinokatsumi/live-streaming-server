var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  
  console.log('a user connected: ' + socket.id);

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

    socket.on('webimage-byte', function(data){
        //console.log('received: ' + data.ByteData.length);
    	socket.emit('webimage-byte', {
    	    Width:data.Width,
    	    Height:data.Height,
            ByteData:data.ByteData,
    	    Base64Str:data.Base64Str
            });
    	socket.broadcast.emit('webimage-byte', {
    	    Width:data.Width,
    	    Height:data.Height,
            ByteData:data.ByteData,
    	    Base64Str:data.Base64Str
            });
	
    });

    socket.on('DemoReceive', function(data){

        console.log('received: ' + data.name);

        socket.emit('DemoReceive', {
        name:data.name
        });
        socket.broadcast.emit('DemoReceive', {
        name:data.name
        });
    
    });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});