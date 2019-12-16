//db
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'fintech'
});
connection.connect();

//express.js
var express = require("express");
var app = express();

var port = process.env.PORT || 3000;
app.use(express.static(__dirname + '/public'));

//라우터 설정
var notice = require('./routes/notice');
var user = require('./routes/notice');
var transfer = require('./routes/transfer');
app.use('/notice', notice);
app.use('/user', user);
app.use('/transfer', transfer);

//템플렛 추가
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.listen(port);
console.log("Listening on port ", port);