var express = require('express');
var router = express.Router();
var connection = require('../mysql-db');

//전체 공지 가져오기
//http://localhost:3000/notice
router.get('/', function(req, res) {
    var roomId = 1; //방 번호 임시
    connection.query('SELECT * FROM notice WHERE roomID = ?',
    [roomId],
    function (error, results) {
        if (error) {
            throw error;
        } else {
            console.log(results);
            res.render('notice', {items : results});
        }
    });
});

//공지 등록
//http://localhost:3000/notice
router.post('/', function(req, res){
    var data = req.body;
    var roomId = 1;
    connection.query('INSERT INTO notice ' +
    '(roomId, contents) VALUES (?,?)',
    [roomId, data.contents], function (error, results) {
        if (error) {
            throw error;
        } else {
            console.log(results);
            //페이지 새로고침
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
            console.log(results);
            //페이지 새로고침
        }
    });
});

module.exports = router;