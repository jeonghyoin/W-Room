var express = require('express');
var request = require('request');
var moment = require('moment');
var connection = require('../server');

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: '192.168.30.54',
    user: 'dana',
    password: 'dana1234!',
    database: 'wroom'
});
connection.connect();

var router = express.Router();

router.get('/efpayment', function (req, res) {
    res.render('test');
});

router.post('/efpayment', function (req, res) {
    var today = moment().format("YYYYMMDD");
    var num = Math.floor(Math.random() * 9000) + 1000;

    console.log(today);

    connection.query('SELECT COUNT(RoomShare_roomID) as share' +
        ' FROM wroom.roomshare_has_user' +
        ' WHERE RoomShare_roomID IN (SELECT RoomShare_roomID FROM wroom.roomshare_has_user WHERE User_userID = 5)',
        function (error, results, fields) {

            console.log("룸메이트 수: " + results[0].share);

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
                        Trtm: '210400',
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
            request(options, function (error, response, body) {
                var resultObject = body;
                var payCategory = 2;
                var dueDate = moment().add("1", "M").format("YYYYMMDD");
                connection.query('INSERT INTO wroom.pay(payCategory, payAmount, payDate, dueDate, memo, payYN, RoomShare_roomID)' +
                    ' VALUES (' + payCategory + ',' + resultObject.Tram + ', null , ' + "\'" + dueDate + "\'" + ', null, 1, 1)',
                    function (error, results, fields) {
                        console.log("this.sql : " + this.sql);
                        if (error) throw error;
                    });
                res.json(resultObject);
            });
        });
});


module.exports = router;