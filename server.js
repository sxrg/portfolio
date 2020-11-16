var express = require('express');
var app = express();
var mysql = require('mysql');
var path = require('path'); // use __dirname
const port = 8080;
let url = require('url');
const bodyParser = require('body-parser');
const { request } = require('http');

var dir = path.join(__dirname, 'public');

app.use(express.static(dir));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Create connection and export (REMOTE)
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "glacier10",
  database: "comp4537"
});

// LOCAL
// const con = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "comp4537"
//   });

con.connect((err) => {
    if (err) {
        console.log('Connection error message: ' + err.message);
        return;
    }
    console.log('Connected!')
});

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
    const queryString = "SELECT * FROM score";

    con.query(queryString, (err, res, fields) => {
        if (err) {
          console.log('Error: ' + err);
          return;
        }
        console.log('Here is the result of the query:');
        console.log(res);
    });

    res.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*"});
    res.end(JSON.stringify(res));
})

// lab 4: write
app.get('/writeScore', (req, res) => {
    let q = url.parse(req.url, true);
    let query = q.query;
    console.log(query);

      const queryString = "INSERT INTO score(name, score) values (" + " ' " + query['name'] + " ' " + "," + query['score'] +")";

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

// lab 5: API -- POST definition
app.post('/addDef', (req, res) => {
    console.log(req.body);
    const queryString = "INSERT INTO words(word, definition) values (" + "'" 
                        + req.body.word + "'" + "," + "'" + req.body.definition + "'" +")";

    con.query(queryString, (err, res, fields) => {
        if (err) {
            console.log('Error: ' + err);
            return;
        }
        console.log('Here is the result of the query:');
        console.log(res);
    });      

    res.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*"});
    res.end('...definition written!');
});

// lab 5: API -- GET definition
app.get('/searchDef', (req, res) => {
    let q = url.parse(req.url, true);
    const word = q.query['word']

    const queryString = `SELECT * FROM words WHERE word = ${"'" + word + "'"}`;

    con.query(queryString, (err, row, fields) => {
        let wordDef = {};
        
        if (err) {
          console.log('Error: ' + err);
        } else if (row.length) {
            wordDef['word'] = row[0].word;
            wordDef['definition'] = row[0].definition;

            console.log('Here is the result of the query:');
            const defResponse = JSON.stringify(wordDef);
            
            console.log(defResponse);

            res.writeHead(200, {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"});
            res.end(defResponse);
        } else {
            res.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*"});
            res.end("Query didn't return any results");
        }
    });
});