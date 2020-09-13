var express = require('express');
var request = require('request');
var router = express.Router();

var connection = require('../database/mysql');

var jwt = require('jsonwebtoken'); // 토큰용 
var tokenKey = "fintech123456789danahkim"; // 토큰용
var auth = require("../lib/auth"); // 토큰용

router.get('/', function(req, res) {
    res.send('respond with a resource');
});

// 출금이체 - 단아한테서 돈 300,000 빼기
// auth 불러오는 곳에 아래 코드 있어야함
// headers : {
//   'x-access-token' : jwtToken
// },
router.post('/withdraw', auth, function(req, res){
    var userId = req.decoded.userId;
    var transferVal = req.body.transferVal.substr(2).replace(",","");
    var countnum; 
    var nine = true;
    while (nine)
    { countnum = Math.floor(Math.random() * 1000000000) + 1;
      if ((countnum >= 100000000) && (countnum <= 999999999)){
            nine = false;
        }
    }
    var transId = "T991599860U" + countnum; // 회원정보 이용기관코드
    connection.query('SELECT * FROM user WHERE userID = ?', [userId], function (error, results, fields) {
        if (error) throw error;
        var option = {
            method : "post",
            url : "https://testapi.openbanking.or.kr/v2.0/transfer/withdraw/fin_num",
            headers : {
                Authorization : "Bearer " + results[0].accessToken
            },
            json : { // 출금이체 테스트 데이터에 내용이 들어가 있어야 함
                "bank_tran_id": transId,
                "cntr_account_type": "N",
                "cntr_account_num": "4847518547", // 이용기관 출금이체 약정번호
                "dps_print_content": "월세김단아", 
                "fintech_use_num" : "199159986057870945489890", // 내 FIN_USE_NUM
  	            "wd_print_content" : "월세김단아",
  	            "tran_amt" : transferVal,
  	            "tran_dtime" : "20191217164250",
  	            "req_client_name" : "김단아",
  	            "req_client_bank_code" : "097",
  	            "req_client_account_num" : "01077335549",
  	            "transfer_purpose" : "TR",
  	            "req_client_num" : "DANAHKIM0903" // 사용자마다 우리가 겹치지 않게 만들어야 하는 부분 = 유저 or 카카오 ID 쓰면 될 듯? 
            }
        }
        request(option, function (error, response, body) {
            var resultObject = body;
            if (resultObject.rsp_code == "A0000"){
              res.json(1);
            } else {
              res.json(0);
            }
        });
    });
  });

  //token
  var TwoLegTtoken;
  router.get("/token", auth, function(req, res){
    var option = {
            method : "POST",
            url : "https://testapi.openbanking.or.kr/oauth/2.0/token",
            headers : {
            },
            form: 
            { client_id: 'BYDWJtEBTE523XORl2bthXPX3bT21JxNzKAo7lqi',
              client_secret: 'BvrW1wX8Fy1juZAh1Wdzhk7AgDBgrcPIr84KrVYi',
              scope: 'oob',
              grant_type: 'client_credentials' }
          }
          request(option, function(error, response, body) {
            var resultObject = JSON.parse(body);
            TwoLegTtoken = resultObject.access_token;
            res.json(1);
          });
  });

  // 입금이체 - 정인한테 300,000 입금하기
router.post('/deposit', auth, function(req, res){
    var userId = req.decoded.userId;
    var transferVal = req.body.transferVal.substr(2).replace(",","");
    var countnum; 
    var nine = true;
    while (nine)
    { countnum = Math.floor(Math.random() * 1000000000) + 1;
      if ((countnum >= 100000000) && (countnum <= 999999999)){
            nine = false;
        }
    }
  var transId = "T991599860U" + countnum;

  var option = {
          method : "POST",
          url : "https://testapi.openbanking.or.kr/v2.0/transfer/deposit/fin_num",
          headers : {
            Authorization: 'Bearer ' + TwoLegTtoken
                    },
          json : {
            "cntr_account_type": "N",
            "cntr_account_num": "1736442487",
            "wd_pass_phrase": "NONE",
            "wd_print_content": "월세김단아",
            "name_check_option": "on",
            "tran_dtime": "20191217164250",
            "req_cnt": "1",
            "req_list": [ {
                  "tran_no": "1",
                  "bank_tran_id": transId,
                  "fintech_use_num": "199159986057870945593762", // 정인언니꺼
                  "print_content": "오픈서비스캐시백",
                  "tran_amt": transferVal,
                  "req_client_name": "윤정인",
                  "req_client_fintech_use_num" : "199159986057870945593762",
                  "req_client_num": "JUNGIN1234",
                  "transfer_purpose": "TR" } ]
          }
        }

        request(option, function(error, response, body) {
            var resultObject = body;
            if (resultObject.rsp_code == "A0000"){
              res.json(1);
            } else {
              res.json(0);
            }
        });
});

// 잔액 조회
router.post('/balance', auth, function(req, res){
  var userId = req.decoded.userId ;
  var countnum = Math.floor(Math.random() * 1000000000) + 1;
  var transId = "T991599860U" + countnum; // 랜덤 숫자 만들기

  connection.query('SELECT * FROM user WHERE userID = ?', [userId],
        function (error, results, fields) { // 디비에서 토큰 받아오기
        if (error) throw error;   
        var option = {
          method : "GET",
          url : "https://testapi.openbanking.or.kr/v2.0/account/balance/fin_num",
          headers : {
            Authorization : "Bearer" + results[0].accessToken // 디비에서 받아온 토큰
          },
          qs : { // GET 방식이니까
              bank_tran_id: transId,
              fintech_use_num: '199159986057870945489890',
              tran_dtime: '20191220140900'
          }
        }
        request(option, function(error, response, body) {
          var resultObject = JSON.parse(body);
          res.json(resultObject);
        });
    });     
})

// 송금 완료 후 payYN 1로 바꾸기
router.post('/payed', auth, function(req, res) {
  var userId = req.decoded.userId ;
  var dutchpayID = req.body.dutchpayID ;

  connection.query('UPDATE dutchpayyn SET ' +
    'dutchpayYN = ?, payDate = now() WHERE (dutchpayID = ? and User_userID = ?)', [1, dutchpayID, userId], function (error, results, fields) {
        if (error) throw error;
        res.json(1);
    });   

});

// 그룹 송금 내역 인자 받아오기
router.post('/groupList', auth, function(req, res) {
  var userId = req.decoded.userId ;
  var dutchpayID = req.body.dutchpayID ;
  // console.log(userId, dutchpayID);

  connection.query('SELECT payID FROM dutchpayyn WHERE dutchpayID = ? and User_userID = ?', [10, 5], function (error, results, fields) {
        if (error) throw error;

        connection.query('SELECT * FROM dutchpayyn WHERE (dutchpayID = ? and PayID = ?)', [10, results[0].payID], function (error, results, fields) {
          if (error) throw error;
          res.send(results);
      });
    });   

});

module.exports = router;