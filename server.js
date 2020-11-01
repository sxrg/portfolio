var express = require('express');
var app = express();
var mysql = require('mysql');
var path = require('path'); // use __dirname
const port = 8080;
let http = require('http');
let url = require('url');

var dir = path.join(__dirname, 'public');
app.use(express.static(dir));

// Create connection and export
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "glacier10",
  database: "comp4537"
});

con.connect((err) => {
    if (err) {
        console.log('Connection error message: ' + err.message);
        return;
    }
    console.log('Connected!')
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

// lab 4: read
app.get('/readScore', (req, res) => {

})

// lab 4: write
app.get('/writeScore', (req, res) => {
    let q = url.parse(req.url, true);
    let query = q.query;
    console.log(query);

    // con.connect(function(err) {
    //     if (err) throw err;
    //     console.log("Connected!");
    //     var sql = "INSERT INTO score(name, score) values ('John', 2900)";
    //     con.query(sql, function (err, result) {
    //       if (err) throw err;
    //       console.log("1 record inserted");
    //     });
    //   });

      const queryString = "INSERT INTO score(name, score) values ('John', 2900)";

      con.query(queryString, (err, res, fields) => {
        if (err) {
          console.log('Error: ' + err);
          return;
        }
        console.log('Here is the result of the query:');
        console.log(res);
      });      

    res.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*"});
    res.end("score written.");
})

app.listen(port, function() {
    console.log(`listening on port ${port}`);
});