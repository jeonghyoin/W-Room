var express = require('express');
var router = express.Router();
var connection = require('../mysql-db');

router.get('/', function(req, res) {
    res.render('makeRoom');
});

//router.get('/update', function(req, res) {
///    res.send('업데이트 완료');
//});


module.exports = router;