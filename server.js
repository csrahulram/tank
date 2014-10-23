var 
express = require('express'),
app = express(),
http = require('http').Server(app),
io = require('socket.io')(http)

app.use(express.static(__dirname + '/'));

app.get('/', function(req, res){
  res.sendfile('index.html',{root:__dirname});
});

io.on('connection', function(socket){

	console.log(socket)
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});