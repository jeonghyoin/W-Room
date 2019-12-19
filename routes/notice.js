var express = require('express');
var router = express.Router();
var connection = require('../mysql-db');

//jwt token
var jwt = require('jsonwebtoken'); 
var tokenKey = "fintech123456789danahkim";
var auth = require("../lib/auth");


//뷰 이동
router.get('/', function(req, res) {
    res.render('notice');
});
//전체 공지 가져오기
//http://localhost:3000/notice/items
router.get('/items', auth, function(req, res) {
    var userId = req.decoded.userId;
    connection.query('SELECT RoomShare_roomID FROM roomshare_has_user WHERE User_userID = ?',
    [userId], function (error, result) {
        if (error) {
            throw error;
        } else {
            var roomId = result[0].RoomShare_roomID;
            connection.query('SELECT * FROM notice WHERE roomID = ?',
            [roomId], function (error, results) {
                if (error) {
                    throw error;
                } else {
                    res.json(results);
                }
            });
        }
    });
});

//공지 등록
//http://localhost:3000/notice
router.post('/', auth, function(req, res){
    var data = req.body;
    var contents = data.contents;
    var userId = req.decoded.userId;
    connection.query('SELECT RoomShare_roomID FROM roomshare_has_user WHERE User_userID = ?',
    [userId], function (error, result) {
        if (error) {
            throw error;
        } else {
            var roomId = result[0].RoomShare_roomID;
            connection.query('INSERT INTO notice (roomId, contents) VALUES (?,?)',
            [roomId, contents], function (error, results) {
                if (error) {
                    throw error;
                } else {
                }
            });
        }
    });
})

//공지 삭제
//http://localhost:3000/notice/{id}
router.get('/:id', function(req, res) {
    var noticeId = req.params.id;
    connection.query('DELETE FROM notice WHERE noticeID = ?;',
    [noticeId],
    function (error, results) {
        if (error) {
            throw error;
        } else {
            res.render('notice');
        }
    });
});

module.exports = router;