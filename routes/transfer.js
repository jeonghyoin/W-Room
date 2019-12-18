var express = require('express');
var request = require('request');
var router = express.Router();

var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'kisadana',
  // host     : '192.168.30.54',
  // user     : 'dana',
  // password : 'dana1234!',
  database : 'wroom'
});
connection.connect();

router.get('/', function(req, res) {
    res.send('respond with a resource');
});

// 출금이체 - 단아한테서 돈 300000 빼기
router.post('/withdraw', function(req, res){
    var userId = req.body.userId

    var countnum = Math.floor(Math.random() * 1000000000) + 1;
    var transId = "T991599860U" + countnum; // 회원정보 이용기관코드
    connection.query('SELECT * FROM user WHERE userId = ?', [userId], function (error, results, fields) {
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
                "fintech_use_num" : "199159986057870945489890",
	            "wd_print_content" : "월세김단아",
	            "tran_amt" : "300000",
	            "tran_dtime" : "20191217164250",
	            "req_client_name" : "김단아",
	            "req_client_bank_code" : "097",
	            "req_client_account_num" : "01077335549",
	            "transfer_purpose" : "TR",
	            "req_client_num" : "DANAHKIM0903" // 사용자마다 우리가 겹치지 않게 만들어야 하는 부분 = 유저 or 카카오 ID 쓰면 될 듯? 
            }
        }
        request(option, function (error, response, body) {
            console.log(body);
            var resultObject = body;
            if (resultObject.rsp_code == "A0000"){
              res.json(resultObject);
            } else {
              res.json(resultObject.rep_code);
            }
        });
    });
  });

  // 입금이체 

module.exports = router;