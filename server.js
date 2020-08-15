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
boardSizes = [19,13,9];
boardSizeIndex = 0;
boardSize = boardSizes[boardSizeIndex];
boardRow = new Array(boardSize).fill(-1)
board = boardRow.map(x => new Array(boardSize).fill(-1))

io.on('connection', function(socket) {
  socket.emit('boardSize',boardSizeIndex)
  socket.on("place",function(id){
    place = id.split("-")
    console.log(place)
    board[place[0]][place[1]] = 0
    socket.emit("updateBoard",board)
  });
});

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
