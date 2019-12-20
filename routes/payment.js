var express = require('express');
var router = express.Router();
var connection = require('../mysql-db');
var moment = require('moment');

//jwt token
var jwt = require('jsonwebtoken'); 
var tokenKey = "fintech123456789danahkim";
var auth = require("../lib/auth");


router.get('/bill', function(req, res) {
    console.log(req.query.dutchpayID);
    res.render('bill', {
        "dutchpayID" : req.query.dutchpayID,
        "totalAmount" : req.query.totalAmount.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,'),
        "payAmount" : req.query.payAmount.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,'),
        "categoryName" : req.query.categoryName,
        "payDate" : req.query.payDate
    });
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
            //res.render('main', {items : results});
        }
    });
});

//납부 내역 조회, 카테고리별 최신 데이터
//http://localhost:3000/payment/category
router.get('/category', auth, function(req, res) {
    var userId = req.decoded.userId;
    connection.query('SELECT RoomShare_roomID FROM roomshare_has_user WHERE User_userID = ?',
    [userId], function (error, result) {
        if (error) {
            throw error;
        } else {
            if (result.length >= 1) { // 룸 아이디가 있는 사용자만!
                var roomId = result[0].RoomShare_roomID;
                connection.query('SELECT * FROM pay INNER JOIN paycategory ON pay.payCategory = paycategory.categoryInt '+
                'AND pay.RoomShare_roomID = ? '+
                'WHERE (pay.payCategory, pay.payDate) '+
                'IN (SELECT pay.payCategory, MAX(pay.payDate) FROM pay GROUP BY pay.payCategory)',
                [roomId], function (error, results) {
                    if (error) {
                        throw error;
                    } else {
                        console.log(results);
                        res.json(results);
                    }
                })
            };     
        }
    });
});

//TODO: yn db 기본값 설정(false)
//납부 내역 조회 - TODO: 테스트
//0, 납부 미완 | 1, 납부 완료
//http://localhost:3000/payment/{flag}
router.get('/:flag', function(req, res) {
    var flag = req.params.flag;
    if(flag == 1) {
        res.render('afterPayment');
    } else {
        res.render('beforePayment');
    }
});
//http://localhost:3000/payment/status/{flag}
router.get('/status/:flag', auth, function(req, res) {
    var flag = req.params.flag;
    var userId = req.decoded.userId;
    connection.query('SELECT * FROM pay INNER JOIN dutchpayyn ON pay.payID = dutchpayyn.payID '+
    'WHERE dutchpayyn.User_userID = ? AND dutchpayyn.dutchpayYN = ?',
    [userId, flag], function (error, results) {
        if (error) {
            throw error;
        } else {
            console.log(results);
            //TODO: 테이블 payyn 기본값 설정하기, paydate null 수정하기
            //TODO: 데이터 포멧
            //var dueDate = moment(results[0].dueDate).format('YYYY-MM-DD hh:mm');
            //console.log(results);
            res.json(results);
        }
    });
});

//납부 내역 등록
//http://localhost:3000/payment
router.post('/', auth, function(req, res) {
    var data = req.body;
    var userId = req.decoded.userId;
    var roomId;
    connection.query('SELECT RoomShare_roomID FROM roomshare_has_user WHERE User_userID = ?',
    [userId], function (error, result) {
        if (error) {
            throw error;
        } else {
            roomId = result[0].RoomShare_roomID;
            console.log('룸 아이디: '+roomId);
            //유저가 속한 룸의 인원
            connection.query('SELECT COUNT(RoomShare_roomID) as share FROM wroom.roomshare_has_user ' + 
            'WHERE RoomShare_roomID IN (SELECT RoomShare_roomID ' +
            'FROM wroom.roomshare_has_user WHERE User_userID = ?)',
            [userId], function (error, results) {
                if (error) {
                    throw error;
                } else {
                    var shareAmount = data.payAmount / results[0].share;
                    var currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
                    connection.query('INSERT INTO pay ' +
                    '(payCategory, payAmount, shareAmount, payDate, dueDate, memo, RoomShare_roomID) VALUES (?,?,?,?,?,?,?)',
                    [data.payCategory, data.payAmount, shareAmount, currentTime, data.dueDate, data.memo, roomId],
                    function (error, results) {
                        if(error) {
                            throw error;
                        } else {
                            var insertId = results.insertId;
                            //유저가 속한 그룹의 유저 아이디들 가져오기
                            connection.query('SELECT User_userID FROM roomshare_has_user ' +
                            'WHERE RoomShare_roomID IN (SELECT RoomShare_roomID ' +
                            'FROM roomshare_has_user WHERE User_userID = ?)',
                            [userId], function (error, result) {
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
                                    res.json(1);
                                }
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

//납부 내역 삭제
//http://localhost:3000/payment/{id}
router.get('/:id', function(req, res) {
});

module.exports = router;