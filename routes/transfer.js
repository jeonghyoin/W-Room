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
    var transId = "T991603750U" + countnum; // 회원정보 이용기관코드
    connection.query('SELECT * FROM user WHERE userID = ?', [userId], function (error, results, fields) {
        if (error) throw error;
        var option = {
            method : "post",
            url : "https://testapi.openbanking.or.kr/v2.0/transfer/withdraw/fin_num",
            headers : {
                Authorization : "Bearer " + results[0].accessToken
            },
            json : { // 출금이체 테스트 데이터에 내용이 들어가 있어야 함
                cntr_account_type : "N", // 약정 계좌/계정 구분(N: 계좌, C: 계정)
                cntr_account_num : "5582638902", // 약정 계좌 or 계정 번호
                dps_print_content : "９월생활비", // 입금계좌 인자내역
                fintech_use_num : 199160375057881337454548, // 출금계좌 핀테크 이용번호
                tran_amt : "300000", // 거래 금액
                tran_dtime : "20200622000000", // 요청 일시
                req_client_num : transId, // 요청고객 계좌번호 - 고유 번호
                req_client_bank_code : "097", // 요청고객 핀테크 이용번호
                req_client_account_num : "01080069901", // 요청고객 계좌 번호
                req_client_name : "김수지", // 요청고객 성명
                transfer_purpose : "TR", //이체 용도(TR: 송금, ST: 결제, RC: 충전)                 
                recv_client_name : "정효인", // 최종 수취고객 성명
                recv_client_bank_code : "097", // 최종 수취고객 계좌 개설기관. 표준코드
                recv_client_account_num : "01080069901", // 최종 수취고객 계좌번호
                bank_tran_id : transId,
                req_client_fintech_use_num : 199160375057881337454548

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
            form: {
              client_id: 'mZDDm2gP92FqwdD248kVm83PTJnlJKDIiTwaSSFu',
              client_secret: 'ed6EcMwoZ11mlHRRzmkmhD33w1Zg4zQ7ggbr0kPj',
              scope: 'oob',
              grant_type: 'client_credentials'
            }
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
  var transId = "T991603750U" + countnum;

  var option = {
          method : "POST",
          url : "https://testapi.openbanking.or.kr/v2.0/transfer/deposit/fin_num",
          headers : {
            Authorization: 'Bearer ' + TwoLegTtoken
          },
          json : {
            "cntr_account_type": "N",
            "cntr_account_num": "1100752336",
            "wd_pass_phrase": "NONE",
            "wd_print_content": "9월생활비",
            "name_check_option": "on",
            "tran_dtime": "20200918000000",
            "req_cnt": "1",
            "req_list": [{
                  "tran_no": "1",
                  "bank_tran_id": transId,
                  "fintech_use_num": "199160375057881337454548",
                  "print_content": "9월생활비",
                  "tran_amt": transferVal,
                  "req_client_name": "김수지",
                  "req_client_fintech_use_num" : "199160375057881337454548",
                  "req_client_num": "NONE",
                  "transfer_purpose": "TR"
                }]
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
  var userId = req.decoded.userId;
  var countnum = Math.floor(Math.random() * 1000000000) + 1;
  var transId = "T991603750U" + countnum; // 랜덤 숫자 만들기

  connection.query('SELECT * FROM user WHERE userID = ?', [userId],
        function (error, results, fields) {
        if (error) throw error;   
        var option = {
          method : "GET",
          url : "https://testapi.openbanking.or.kr/v2.0/account/balance/fin_num",
          headers : {
            Authorization : "Bearer" + results[0].accessToken // 디비에서 받아온 토큰
          },
          qs : {
              bank_tran_id: transId, // 은행 거래 고유번호
              fintech_use_num: '199160375057881337454548', // 핀테크 이용번호
              tran_dtime: '20200910101921' // 요청 시간
          }
        }
        request(option, function(error, response, body) {
          var resultObject = JSON.parse(body);

          console.log(resultObject);

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