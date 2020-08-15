var express = require('express');
var app = express();
//var giphy = require('giphy-js-sdk-core');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 8080;

var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

var $ = jQuery = require('jquery')(window);

// let imported = document.createElement('script');
// imported.src = "./js/user.js";
// document.head.appendChild(imported);
//Setup Starts

// Dictionary containing rooms referenced by id
let rooms = {}
let boardSizes = [19,13,9];

// Socket for initial connections from users
io.on('connection', function (socket) {
    // Generate a new room and return its id in the callback
    socket.on('newRoom', function (data, callback) {
        let roomid = Math.floor(Math.random() * 90000) + 10000
        let room = new Room(roomid,data.index,data.colour)
        console.log("New room created with id " + roomid)
        rooms[roomid] = room
        callback(roomid)
    })

    // Attempt to join a room, and return success in callback
    socket.on('joinRoom', function (roomid, callback) {
        if ((roomid in rooms) && (rooms[roomid].notFull)) {
            callback({"room":!rooms[roomid].player1Colour,"boardSizeIndex":rooms[roomid].boardSizeIndex})
            rooms[roomid].notFull = false
        } else {
            callback({"room":-1,"boardSizeIndex":rooms[roomid].boardSizeIndex})
        }
    })
});

function Room(roomID,boardSizeIndex,player1Colour) {
  this.roomID = roomID;
  this.notFull = true
  this.boardSizeIndex = boardSizeIndex;
  this.player1Colour = player1Colour
  this.boardSize = boardSizes[this.boardSizeIndex];
  this.boardRow = new Array(this.boardSize).fill(-1)
  this.board = this.boardRow.map(x => new Array(this.boardSize).fill(-1))
  this.nsp = io.of('/' + this.roomID);

  let t = this
  console.log(t.board)
  this.nsp.on('connection', function(socket) {
    socket.on("place",function(id){
      place = id.split("-")
      t.board[place[0]][place[1]] = 0
      socket.emit("updateBoard",t.board)
    });
  });
}

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});



http.listen(port, function () {
  console.log('listening on *:' + port);
});

app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));


// Exports for testing purposes.
module.exports = app;
