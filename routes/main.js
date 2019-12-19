var express = require('express');
var router = express.Router();
var connection = require('../mysql-db');

var jwt = require('jsonwebtoken'); // 토큰용 
var tokenKey = "fintech123456789danahkim"; // 토큰용
var auth = require("../lib/auth"); // 토큰용
router.get('/', function(req, res) {
    res.render('main');
});

router.get('/payment/form', function(req, res) {
    res.render('paymentForm');
});

//사용자가 가지는 같은 roomID 사람들 정보를 보내기
router.post('/', auth, function(req, res){
    // console.log(req.body.findEmail);
    var userEmail = req.decoded.userEmail
    var resultObject;
    var roomIDresult;
    connection.query('SELECT * FROM user WHERE email = ?', [userEmail], function (error, results, fields) { //룸아이디 검색
        if (error) throw error;
        if(results.length < 1){
            console.log('사용자가 없습니다');
        }
        else {
            roomIDresult= results[0].roomID;
            console.log(roomIDresult);
           // resultObject = results;
            connection.query('SELECT * FROM user WHERE roomID = ?', [roomIDresult], function (error, results, fields){
                console.log(results);
                resultObject=results;
                res.json(resultObject);
            })
           // 
        }
     });
   //  request(option, function (error, response, body) {
        
      //  res.json(resultObject);
   // });
 });

module.exports = router;