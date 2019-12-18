var express = require('express');
var request = require('request');
var router = express.Router();

var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : '192.168.30.54',
  user     : 'dana',
  password : 'dana1234!',
  database : 'wroom'
});
connection.connect();

router.get('/', function(req, res) {
    res.render('invite');
});

router.post('/', function(req, res){
   // console.log(req.body.findEmail);
    var findEmail = req.body.findEmail;
    var findname;
    var findimg;
    var resultObject;
   connection.query('SELECT * FROM user WHERE email = ?',
    [findEmail], function (error, results, fields) {
        if (error) throw error;
       // console.log(results);
        if(results.length < 1){
            console.log('사용자가 없습니다');
        }
        else {
            //console.log(results[0].name, results[0].image);
            findname = results[0].name;
            findimg = results[0].image;
            resultObject = results;
            console.log(resultObject);
            res.json(resultObject);
            //해당 이메일 사용자의 이름과 이미지를 보여준다.
        }
    });  
});

router.post('/add', function(req, res){
    // console.log(req.body.findEmail);
     var addEmail = req.body.findEmail;
     var findname;
     var findimg;
     var resultObject;
    connection.query('SELECT * FROM user WHERE roomID=?',
     [addEmail], function (error, results, fields) {
        if (error) throw error;
        if(result[0].roomID!='NULL'){console.log("이미 다른 룸쉐어 중");
    }else{
       // connection.query('INSERT INTO user.roomID WHERE email=?',
    // [addEmail], function (error, results, fields) {

    }
    
     })
});

module.exports = router;