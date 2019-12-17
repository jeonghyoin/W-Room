//database
//database
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : '192.168.30.54',
  user     : 'dana',
  password : 'dana1234!',
  database : 'wroom'
});
connection.connect();


//express.js
var express = require("express");
var app = express();

var port = process.env.PORT || 3000;
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));

//body parser
app.use(express.json());
app.use(express.urlencoded({extended:false}));

//라우터 설정
var notice = require('./routes/notice');
var user = require('./routes/user');
var transfer = require('./routes/transfer');
var payment = require('./routes/payment');
var nhapi = require('./routes/nhapi');
var main = require('./routes/main');

app.use('/notice', notice);
app.use('/user', user);
app.use('/transfer', transfer);
app.use('/payment', payment);
app.use('/nh', nhapi);
app.use('/main', main);


//템플렛 추가
app.set('views', __dirname + '/view');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.listen(port);
console.log("Listening on port ", port);
