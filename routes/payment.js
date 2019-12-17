var express = require('express');
var router = express.Router();

//납부 내역 조회, 전체
//http://localhost:3000/payment
router.get('/', function(req, res) {
    var temp;
    connection.query('SELECT * FROM wroom.pay', function (error, results) {
        if (error) throw error;
        temp = results;
        res.send(temp);
    });
});

//납부 내역 조회, 유저 id
//http://localhost:3000/payment/{userId}
router.get('/:id', function(req, res) {
});

//납부 내역 조회, 카테고리 id
//http://localhost:3000/payment/{categoryId}
router.get('/:id', function(req, res) {
});

//납부 내역 삭제
//http://localhost:3000/payment/{id}
router.get('/:id', function(req, res) {
});

//납부 내역 등록
//http://localhost:3000/payment
router.post('/', function(req, res) {
    /* var payCategory = req.body.email;
    var payAmount = req.body.password;
    var payDate = req.body.accessToken;
    var dueDate = req.body.refreshToken;
    var memo = req.body.userseqno;
    var payYN = req.body.userseqno; */
    const data = req.body;

    connection.query('INSERT INTO pay ' +
    '(payCategory, payAmount, payDate, dueDate, memo, payYN) VALUES (?,?,?,?,?,?)',
    [data.payCategory, data.payAmount, data.payDate, data.dueDate, data.memo, data.payYN],
    function (error, results) {
        if(error) {
            throw error;
        } else {
            res.redirect('/'); //업데이트 후 메인 화면 이동
         }
    });
});

//납부 내역 수정
//http://localhost:3000/payment/{id}
router.post('/:id', function(req, res) {
    
});

module.exports = router;