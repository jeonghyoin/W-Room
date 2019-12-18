var express = require('express');
var router = express.Router();
var connection = require('../mysql-db');

router.get('/', function(req, res) {
    res.render('main');
});

module.exports = router;