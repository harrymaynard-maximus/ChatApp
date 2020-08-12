//import PeerCollection from './peer-collection';
const PeerCollection = require('./peer-collection');
// Setup basic express server
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});
app.set('view engine', 'ejs');

// Routing
app.use(express.static(path.join(__dirname, 'public')));
//app.use((req, res) => res.sendFile(`${__dirname}/public/index.html`))

app.get('/room/:roomId', function (req, res) {
  var roomId = req.params.roomId;
  res.render('room', {roomId: roomId});
});

app.get('/room/users/:roomId', function (req, res) {
  var roomId = req.params.roomId;
  const users = peers.getUsersFromRoom(roomId);
  res.send(JSON.stringify(users));
});

// Chatroom

var numUsers = 0;
const peers = new PeerCollection();


io.on('connection', (socket) => {
  console.log("Connected.");

  socket.on('login', (roomId, peerId, userName) => {
    console.log("login: " + roomId + ", " + userName);
    socket.roomId = roomId;
    socket.peerId = peerId;
    peers.addUserToRoom(peerId, userName, roomId);

    socket.join(roomId, (error) => {
      socket.emit('user-joined', peerId, userName);
      socket.in(roomId).emit('user-joined', peerId, userName);
    });
  });

  socket.on('disconnect', () => {
    peers.removeUserFromRoom(socket.peerId, socket.roomId);
    // socket.to(socket.roomId).broadcast.emit('user left', {
    //   peerId: socket.peerId,
    // });
    
  });
  /*
  var addedUser = false;
  
  // when the client emits 'new message', this listens and executes
  socket.on('new message', (message) => {
    // we tell the client to execute 'new message'
    socket.to(socket.roomId).broadcast.emit('new message', {
      username: socket.username,
      message: message
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', (username, roomId) => {
    if (addedUser) {
      console.log("Added user already.");
      return;
    }

    // we store the username in the socket session for this client
    socket.username = username;
    socket.roomId = roomId;
    ++numUsers;
    addedUser = true;
    socket.join(socket.roomId);
    console.log("Joined Room: " + socket.roomId);
    socket.to(socket.roomId).emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.to(socket.roomId).broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', () => {
    socket.to(socket.roomId).broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', () => {
    socket.to(socket.roomId).broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', () => {
    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.to(socket.roomId).broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
  */
});
