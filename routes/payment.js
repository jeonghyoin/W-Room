var express = require('express');
var router = express.Router();
var connection = require('../mysql-db');
var moment = require('moment');

router.get('/bill', function(req, res) {
    res.render('bill');
});

router.get('/check', function(req, res) {
    res.render('check');
});

//납부 내역 조회, 전체
//http://localhost:3000/payment
router.get('/', function(req, res) {
    connection.query('SELECT * FROM pay', function (error, results) {
        if (error) {
            throw error;
        } else {
            res.render('main', {items : results});
        }
    });
});

//납부 내역 조회, 카테고리 id
//http://localhost:3000/payment/{categoryId}
router.get('/category/:id', function(req, res) {

});

//납부 내역 조회
//0, 납부 미완 | 1, 납부 완료
//http://localhost:3000/payment/{flag}
router.get('/:flag', function(req, res) {
    var flag = req.params.flag;
    var userId = 5; //임시
    connection.query('SELECT * FROM pay INNER JOIN dutchpayyn ' + 
    'ON pay.payID = dutchpayyn.dutchpayID ' +
    'WHERE dutchpayyn.User_userID = ? AND dutchpayyn.dutchpayYN = ?',
    [userId, flag],
    function (error, results) {
        if (error) {
            throw error;
        } else {
            res.render('payment', {items : results});
        }
    });
});

//납부 내역 삭제
//http://localhost:3000/payment/{id}
router.get('/:id', function(req, res) {

});

//납부 내역 등록
//http://localhost:3000/payment
router.post('/', function(req, res) {
    var data = req.body;
    connection.query('SELECT COUNT(RoomShare_roomID) as share FROM wroom.roomshare_has_user ' + 
    'WHERE RoomShare_roomID IN (SELECT RoomShare_roomID ' +
    'FROM wroom.roomshare_has_user WHERE User_userID = 5)',
    function (error, results) {
        if (error) {
            throw error;
        } else {
            var shareAmount = data.payAmount / results[0].share;
            connection.query('INSERT INTO pay ' +
            '(payCategory, payAmount, shareAmount, payDate, dueDate, memo, payYN, RoomShare_roomID) VALUES (?,?,?,?,?,?,?,?)',
            [data.payCategory, data.payAmount, shareAmount, data.payDate, data.dueDate, data.memo, data.payYN, data.RoomShare_roomID],
            function (error, results) {
                if(error) {
                    throw error;
                } else { //유저번호 임시
                    var insertId = results.insertId;
                    connection.query('SELECT User_userID FROM roomshare_has_user ' +
                    'WHERE RoomShare_roomID IN (SELECT RoomShare_roomID ' +
                    'FROM roomshare_has_user WHERE User_userID = 5)',
                    function (error, result) {
                        if(error) {
                            throw error;
                        } else {
                            Object.keys(result).forEach(function(key) {
                                var row = result[key];
                                connection.query('INSERT INTO dutchpayyn(payID, User_userID) VALUES (?,?)',
                                [insertId, row.User_userID],
                                function (error, results) {
                                    if(error) {
                                        throw error;
                                    } else {
                                        console.log(row.User_userID+' 작업 완료');
                                    }
                                });
                            });
                        }
                    });
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