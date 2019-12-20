var express = require('express');
var router = express.Router();
var connection = require('../mysql-db');

var jwt = require('jsonwebtoken'); // 토큰용 
var tokenKey = "fintech123456789danahkim"; // 토큰용
var auth = require("../lib/auth"); // 토큰용

router.get('/', function(req, res) {
    res.render('makeRoom');
});
    
router.post('/update', auth, function(req, res) {
    var userId = req.decoded.userId;    
    var roomName = req.body.roomName ;
    var account = req.body.account ;

    connection.query('INSERT INTO roomshare SET ' +
    'roomName = ?, roomAccount = ?, roomLeader = ?' , [roomName, account, userId], function (error, results, fields) {
        if (error) throw error;
        console.log(results);
        res.json(1);       
    });     

});

module.exports = router;