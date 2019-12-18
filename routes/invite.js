var express = require('express');
var request = require('request');
var router = express.Router();

var jwt = require('jsonwebtoken'); // 토큰용 
var tokenKey = "fintech123456789danahkim"; // 토큰용
var auth = require("../lib/auth"); // 토큰용

var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : '192.168.30.54',
  user     : 'dana',
  password : 'dana1234!',
  database : 'wroom'
});
connection.connect();

router.get('/', function(req, res) {
    res.render('invite');
});

router.post('/', function(req, res){
   // console.log(req.body.findEmail);
    var findEmail = req.body.findEmail;
    var findname;
    var findimg;
    var resultObject;
   connection.query('SELECT * FROM user WHERE email = ?',
    [findEmail], function (error, results, fields) {
        if (error) throw error;
       // console.log(results);
        if(results.length < 1){
            console.log('사용자가 없습니다');
        }
        else {
            //console.log(results[0].name, results[0].image);
            findname = results[0].name;
            findimg = results[0].image;
            resultObject = results;
            console.log(resultObject);
            res.json(resultObject);
            //해당 이메일 사용자의 이름과 이미지를 보여준다.
        }
    });  
});

router.post('/add', auth, function(req, res){
    var myEmail = req.decoded.userEmail;
    // console.log(req.body.findEmail);
     var addEmail = req.body.findEmail;
  //   var userToken = sessionStorage.getItem('jwtToken')
     var findname;
     var findimg;
     var resultObject;
     var userRoomID;
    connection.query('SELECT * FROM user WHERE email=?',
     [addEmail], function (error, results, fields) {
        if (error) throw error;
        if(result[0].roomID!='NULL'){console.log("이미 다른 룸쉐어 중");
    }else{
        connection.query('SELECT * FROM user WHERE email=?',
        [myEmail], function (error, results, fields) {
            if (error) throw error;
            else{
                userRoomID = results[0].roomID;
            }
        }),
        connection.query('UPDATE user.roomID '+'SET '+ userRoomID + 'WHERE email='+addEmail);
        console.log('추가 완료');
     }
});
});

module.exports = router;