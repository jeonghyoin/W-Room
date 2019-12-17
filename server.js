//db
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'jmyc1921',
  database : 'wroom'
});
connection.connect();

//express.js
var express = require("express");
var app = express();

var port = process.env.PORT || 3000;
app.use(express.static(__dirname + '/public'));

//라우터 설정
var notice = require('./routes/notice');
var user = require('./routes/user');
var transfer = require('./routes/transfer');
var payment = require('./routes/payment');
app.use('/notice', notice);
app.use('/user', user);
app.use('/transfer', transfer);
app.use('/payment', payment);


//템플렛 추가
app.set('views', __dirname + '/view');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.listen(port);
console.log("Listening on port ", port);