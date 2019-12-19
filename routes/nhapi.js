var express = require('express');
var request = require('request');
var moment = require('moment');
var jwt = require('jsonwebtoken'); // 토큰용 
var tokenKey = "fintech123456789danahkim"; // 토큰용
var auth = require("../lib/auth"); // 토큰용
var connection = require('../server');
var connection = require('../mysql-db');

var router = express.Router();

router.get('/efpayment', function (req, res) {
    res.render('test');
});

router.post('/efpayment', auth, function (req, res) {
    var userId = req.decoded.userId;
    var today = moment().format("YYYYMMDD");
    var num = Math.floor(Math.random() * 9000) + 1000;

    console.log(today);

    // sql 로그인 id 수정
    var rMember = 'SELECT COUNT(RoomShare_roomID) as share FROM wroom.roomshare_has_user WHERE RoomShare_roomID IN (SELECT RoomShare_roomID FROM wroom.roomshare_has_user WHERE User_userID = ?)';

    connection.query(rMember, [userId],
        function (error, rMemberResults, fields) {
            if (error) throw error;

            console.log("룸메이트 수: " + rMemberResults[0].share);
            var options = {
                method: 'POST',
                url: 'https://developers.nonghyup.com/InquireElectricityFarePayment.nh',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: {
                    Header: {
                        ApiNm: 'InquireElectricityFarePayment',
                        Tsymd: String(today),
                        Trtm: '112428',
                        Iscd: '000083',
                        FintechApsno: '001',
                        ApiSvcCd: '13E_001_00',
                        IsTuno: String(num),
                        AccessToken: '77e6e4d1423789df17041565b263c59d806da81738ad03b339ebe1ce751ca3c9'
                    },
                    ElecPayNo: '0606628088',
                    Acno: '3020000000071'
                },
                json: true
            };


            // var options = {
            //     method: 'POST',
            //     url: 'https://developers.nonghyup.com/InquireElectricityFarePayment.nh',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: {
            //         Header: {
            //             ApiNm: 'InquireElectricityFarePayment',
            //             Tsymd: String(today),
            //             Trtm: '112428',
            //             Iscd: '000083',
            //             FintechApsno: '001',
            //             ApiSvcCd: '13E_001_00',
            //             IsTuno: String(num),
            //             AccessToken: '77e6e4d1423789df17041565b263c59d806da81738ad03b339ebe1ce751ca3c9'
            //         },
            //         ElecPayNo: '0606628088',
            //         Acno: '3020000000071'
            //     },
            //     json: true
            // };

            request(options, function (error, response, body) {
                var resultObject = body;
                console.log(`body.Tram : ${body.Tram}, rMemberResults[0].share : ${rMemberResults[0].share}`)
                resultObject.price = body.Tram / rMemberResults[0].share;
                console.log(" >> resultObject.price : " + resultObject.price);
                var payCategory = 2;
                var dueDate = moment().add("1", "M").format("YYYYMMDD");

                // sql 로그인 id 수정
                // 테이블 pay 전기세 삽입
                var sql1 = 'SELECT RoomShare_roomID FROM wroom.roomshare_has_user WHERE User_userID = ?';
                var sql2 = 'INSERT INTO wroom.pay(payCategory, payAmount, shareAmount, payDate, dueDate, memo, payYN, RoomShare_roomID)' +
                    ' VALUES (?,?,?,?,?,?,?,?)';

                // sql 로그인 id 수정
                // 테이블 dutchpayyn 룸메이트 개별 전기세 삽입
                var sql3 = 'SELECT User_userID FROM wroom.roomshare_has_user WHERE RoomShare_roomID IN (SELECT RoomShare_roomID FROM roomshare_has_user WHERE User_userID = ?)';
                var sql4 = 'INSERT INTO wroom.dutchpayyn(payID, User_userID) VALUES (?,?)';

                connection.query(sql1, [userId], function (error, sql1Result, fields) {
                    console.log("this.sql : " + this.sql);
                    console.log("sql1 :" + sql1Result[0].RoomShare_roomID);

                    if (error) throw error;
                    else {
                        connection.query(sql2, [payCategory, resultObject.Tram, resultObject.price, null, resultObject.PbtxPayExdt, null, 0, sql1Result[0].RoomShare_roomID],
                            function (error, sql2Results, fields) {
                                console.log("this.sql : " + this.sql);
                                if (error) throw error;
                                else {
                                    var insertId = sql2Results.insertId;
                                    connection.query(sql3, [userId], function (error, sql3Result) {
                                        if (error) {
                                            throw error;
                                        } else {
                                            Object.keys(sql3Result).forEach(function (key) {
                                                var row = sql3Result[key];
                                                connection.query(sql4, [insertId, row.User_userID],
                                                    function (error, results) {
                                                        if (error) {
                                                            throw error;
                                                        } else {
                                                            console.log('전기세 dutchpayyn 삽입 완료');
                                                        }
                                                    });
                                            });
                                        }
                                    });
                                    res.json(resultObject);
                                }
                            });

                    }
                });
            });
        });
});


module.exports = router;