var express = require('express');
var request = require('request');
var router = express.Router();

var jwt = require('jsonwebtoken'); // 토큰용 
var tokenKey = "fintech123456789danahkim"; // 토큰용
var auth = require("../lib/auth"); // 토큰용
var connection = require('../database/mysql');
var mysql = require('mysql');

router.get('/', auth, function(req, res) {
    var userId = req.decoded.userId;
    connection.query('SELECT * FROM wroom.user WHERE userID = ?',
    [userId], function (error, result) {
        if (error) {
            throw error;
        } else {
            // result.img = result[0].image;
            res.json(result);
        }
    });
});

module.exports = router;