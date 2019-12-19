var express = require('express');
var router = express.Router();
var connection = require('../mysql-db');

router.get('/', function(req, res) {
    res.render('main');
});

router.post('/', function(req, res){
    // console.log(req.body.findEmail);
    var userId = req.decoded.userId
    var resultObject;
    connection.query('SELECT * FROM user WHERE id = ?', [userId], function (error, results, fields) {
        if (error) throw error;
            resultObject = results;
            
            res.json(resultObject);
     });
 });

module.exports = router;