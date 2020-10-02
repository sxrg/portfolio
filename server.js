var express = require('express');
var app = express();
var path = require('path'); // use __dirname

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(8080);