var express = require('express');
var request = require('request');
var router = express.Router();

var jwt = require('jsonwebtoken'); // 토큰용 
var tokenKey = "fintech123456789danahkim"; // 토큰용
var auth = require("../lib/auth"); // 토큰용
var connection = require('../database/mysql');
var mysql = require('mysql');

router.get('/', function(req, res) {
    res.render('invite');
});

router.post('/', function(req, res){
   // console.log(req.body.findEmail);
    var findEmail = req.body.findEmail;
    var resultObject;
   connection.query('SELECT * FROM user WHERE email = ?',
    [findEmail], function (error, results, fields) {
        if (error) throw error;
        if(results.length < 1){
            console.log('사용자가 없습니다');
        }
        else {
            resultObject = results;
            res.json(resultObject);
            //해당 이메일 사용자의 이름과 이미지를 보여준다.
        }
    });
});

router.post('/add', auth, function(req, res){
    var myEmail = req.decoded.userEmail;//내 이메일
    var addEmail = req.body.addEmail;//친구 이메일
    var userRoomID='';
    connection.query('SELECT ISNULL(roomID) as roomID, userID FROM user WHERE email=?', //친구 이메일의 룸아이디 확인
     [addEmail], function (error, results, fields) {
        if (error) throw error;
        var adduserID =results[0].userID;
        if(results[0].roomID == 1){ // 룸메이트의 룸아이디가 비었으면
            connection.query('SELECT * FROM user WHERE email=?',
            [myEmail], function (error, results, fields) { // 리더의 룸아이디를 가져와서
                    userRoomID = results[0].roomID;
                    connection.query('UPDATE user SET roomID = ? WHERE email= ?', [10, addEmail]); // 추가
                    connection.query('INSERT INTO roomshare_has_user (`RoomShare_roomID`, `User_userID`) VALUES (?, ?)' , [10, adduserID], function (error, results, fields) {
                        if (error) throw error;
                        });

                    res.send(addEmail);
            });
            
    }else{
        console.log("이미 다른 룸쉐어 중");
        res.send('');
     }    
});
//}
});

module.exports = router;