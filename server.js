//database
var mysql = require('mysql');
var connection = mysql.createConnection({
<<<<<<< HEAD
  host     : '192.168.30.54',
  user     : 'dana',
  password : 'dana1234!',
=======
<<<<<<< HEAD
  host     : 'localhost',
  user     : 'root',
  password : 'jmyc1921',
=======
  host     : '192.168.30.54',
  user     : 'jeongin',
  password : 'jeongin1234',
>>>>>>> 630c47fade4d57640d247ef70fe6afac611c9b62
>>>>>>> bc9b7b73893082c7d97c69526b9397894952b465
  database : 'wroom'
});
connection.connect();

//express.js
var express = require("express");
var app = express();

var port = process.env.PORT || 3000;
app.use(express.static(__dirname + '/public'));

//body parser
app.use(express.json());
app.use(express.urlencoded({extended:false}));

//라우터 설정
var notice = require('./routes/notice');
var user = require('./routes/user');
var transfer = require('./routes/transfer');
var payment = require('./routes/payment');
var main = require('./routes/main');

app.use('/notice', notice);
app.use('/user', user);
app.use('/transfer', transfer);
app.use('/payment', payment);
app.use('/main', main);


//템플렛 추가
app.set('views', __dirname + '/view');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.listen(port);
console.log("Listening on port ", port);