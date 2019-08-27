var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {

    console.log('a user connected: ' + socket.id);

    var serverID = 'undefined';

    socket.on('RegServerId', function (data) {
        serverID = socket.id;
    });

      socket.on('disconnect', function(){
          if (serverID == socket.id) {
              console.log('removed Server: ' + socket.id);
              serverID = 'undefined';
          }
          else {
              console.log('user disconnected: ' + socket.id);
          }
      });

    socket.on('webimage-byte', function(data){
    	io.emit('webimage-byte', {
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

    socket.on('OnReceiveData', function (data) {
        if (serverID != 'undefined') {
            if (data.EmitType == 0) {
                io.emit('OnReceiveData', {
                    DataString: data.DataString,
                    DataByte: data.DataByte
                });
            }

            if (data.EmitType == 1) {
                io.to(serverID).emit('OnReceiveData', {
                    DataString: data.DataString,
                    DataByte: data.DataByte
                });
            }

            if (data.EmitType == 2) {
                socket.broadcast.emit('OnReceiveData', {
                    DataString: data.DataString,
                    DataByte: data.DataByte
                });
            }
        }
        else {
            console.log('cannot find any active server');
        }
    });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});