var express = require('express');
var router = express.Router();

//database
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : '192.168.30.54',
  user     : 'dana',
  password : 'dana1234!',
  database : 'wroom'
});
connection.connect();

//납부 내역 조회, 전체
//http://localhost:3000/payment
router.get('/', function(req, res) {
    var temp;
    connection.query('SELECT * FROM pay', function (error, results) {
        if (error) throw error;
        //temp = results;
        //res.send(temp);
        console.log(results);
    });
});

//납부 내역 조회, 유저 id
//http://localhost:3000/payment/{userId}
router.get('/user/:id', function(req, res) {
});

//납부 내역 조회, 카테고리 id
//http://localhost:3000/payment/{categoryId}
router.get('/category/:id', function(req, res) {

});

//납부 내역 조회, 납부 여부
//http://localhost:3000/payment/{0|1}
router.get('/:id', function(req, res) {

});

//납부 내역 삭제
//http://localhost:3000/payment/{id}
router.get('/:id', function(req, res) {

});

//납부 내역 등록
//http://localhost:3000/payment
router.post('/', function(req, res) {
    var data = req.body;
    connection.query('INSERT INTO pay ' +
    '(payCategory, payAmount, payDate, dueDate, memo, payYN, RoomShare_roomID) VALUES (?,?,?,?,?,?,?)',
    [data.payCategory, data.payAmount, data.payDate, data.dueDate, data.memo, data.payYN, data.RoomShare_roomID],
    function (error, results) {
        if(error) {
            throw error;
        } else { //유저번호 임시
            connection.query('SELECT User_userID FROM roomshare_has_user ' +
            'WHERE RoomShare_roomID IN (SELECT RoomShare_roomID ' +
            'FROM roomshare_has_user WHERE User_userID = 5)',
            function (error, results) {
                if(error) {
                    throw error;
                } else {
                    var userIdList = [];
                    userIdList = results.Row;
                    console.log(userIdList);
                }
            });
         }
    });
});

//납부 내역 수정
//http://localhost:3000/payment/{id}
router.post('/:id', function(req, res) {

});

module.exports = router;