var express = require('express');
var app = express();
var path = require('path'); // use __dirname
const port = 8080;
let http = require('http');
let url = require('url');

var dir = path.join(__dirname, 'public');
app.use(express.static(dir));

// MYSQL
const mysql = require("mysql");

// Create connection and export
export const conDB = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "glacier10",
  database: "comp4537"
});

// actually unnecessary; fix after lab2 gets marked 
// app.get('/lab2', (req, res) => {
//     res.sendFile(path.join(__dirname + "/public/lab2.html"));
// });

// lab 3
app.get('/serverTime', (req, res) => {
    let q = url.parse(req.url, true);
    const dateTime = new Date();
    const time = dateTime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
  
    console.log(q.query);
    res.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*"});
    res.end('Hello '+ q.query["name"] + ", the current server time is " + time);
})

app.listen(port, function() {
    console.log(`listening on port ${port}`);
});