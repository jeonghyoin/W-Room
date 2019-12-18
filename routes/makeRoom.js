var express = require('express');
var router = express.Router();
var connection = require('../mysql-db');

router.get('/', function(req, res) {
    res.render('makeRoom');
});

router.post('/update', function(req, res) {
    var roomName = req.body.roomName ;
    var account = req.body.account ;

    connection.query('INSERT INTO roomshare SET ' +
    'roomName = ?, roomAccount = ?' , [roomName, account], function (error, results, fields) {
        if (error) throw error;
        console.log(results);
        res.json(1);       
    });     

});

module.exports = router;