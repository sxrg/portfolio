var express = require('express');
var app = express();
var path = require('path'); // use __dirname
const port = 8080;

var dir = path.join(__dirname, 'public');
app.use(express.static(dir));

app.get('/lab2', (req, res) => {
    res.sendFile(path.join(__dirname + "/public/lab2.html"));
});

app.listen(port, function() {
    console.log(`listening on port ${port}`);
});