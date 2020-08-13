
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const port = process.env.PORT || 8080;

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

const $ = jQuery = require('jquery')(window);

io.on('connection', function(socket) {
});

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});



// let imported = document.createElement('script');
// imported.src = "./js/user.js";
// document.head.appendChild(imported);

app.listen(port, () => {
  console.log(`goOnline: listening on port ${port}`);
});
app.use('/js', express.static(__dirname + '/js'));


// Exports for testing purposes.
module.exports = app;
