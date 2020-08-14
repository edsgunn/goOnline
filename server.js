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

io.on('connection', function(socket) {
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
