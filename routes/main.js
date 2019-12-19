var express = require('express');
var router = express.Router();
var connection = require('../mysql-db');

var jwt = require('jsonwebtoken'); // 토큰용 
var tokenKey = "fintech123456789danahkim"; // 토큰용
var auth = require("../lib/auth"); // 토큰용
router.get('/', function(req, res) {
    res.render('main');
});

//사용자가 가지는 같은 roomID 사람들 정보를 보내기
router.post('/', auth, function(req, res){
    // console.log(req.body.findEmail);
    var userEmail = req.decoded.userEmail
    var resultObject;
    connection.query('SELECT * FROM user WHERE id = ?', [userId], function (error, results, fields) { //룸아이디 검색
        if (error) throw error;
        if(results.length < 1){
            console.log('사용자가 없습니다');
        }
        else {
            resultObject = results;
            console.log('')
           // res.json(resultObject);
        }
     });
     request(option, function (error, response, body) {
        
      //  res.json(resultObject);
    });
 });

module.exports = router;