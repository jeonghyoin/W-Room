var express = require('express');
var router = express.Router();
var request = require('request');

var connection = require('../mysql-db');

var jwt = require('jsonwebtoken'); // 토큰용 
var tokenKey = "fintech123456789danahkim"; // 토큰용
var auth = require("../lib/auth"); // 토큰용

var currentUserID; // 현재 유저 저장용(kakaoID 활용)

router.get('/', function(req, res) {
    res.send('respond with a resource');
});

// 로그인 페이지
router.get("/login", function (req, res) {
    res.render('login');
});

// 회원가입 페이지
router.get("/signup", function (req, res) {
    res.render('signup');
})

// 카카오로 로그인 후 받아온 정보를 DB에 저장
router.post("/kakao", function (req, res) {
    console.log(req.body);
    var kakaoID = req.body.id;
    var name = req.body.nickname;
    var image = req.body.image;
    var email = req.body.email;
    var age = req.body.age;
    var gender = req.body.gender;
    currentUserID = kakaoID;
    connection.query('SELECT * FROM user WHERE kakaoID = ?',
    [kakaoID], function (error, results, fields) {
        if (results.length < 1) {
            console.log('사용자가 없습니다. DB에 추가 후 나머지 회원가입 절차 진행')
            connection.query('INSERT INTO user ' +
           '(name, email, age, gender, kakaoID, image) VALUES (?,?,?,?,?,?)',
                [name, email, age, gender, kakaoID, image], function (error, results, fields) {
                if (error) throw error;
            })
            res.json(0);
        } else { // 사용자가 있다면 1
            jwt.sign( // 토큰 만드는 곳 같은뎁!
                {
                    userName : results[0].name,
                    userId : results[0].userID,
                    userEmail : results[0].email
                },
                tokenKey,
                {
                    expiresIn : '10d', // 토큰 유효기간 1d 일, 1h 시, 15m
                    issuer : 'wroom.admin',
                    subject : 'user.login.info'
                },
                function(err, token){
                    console.log('사용자가 이미 존재합니다. 메인 화면으로 이동')
                    res.json(token) // 우리 서비스에 로그인하기 위한 토큰
                    // 액세스 토큰은 오픈 API를 이용하기 위한 토큰!
                }
            )
        } 
    });
});

// 오픈뱅킹 인증 절차
router.get("/authResult", function (req, res) {
  var authCode = req.query.code;
  var option = {
      method : "POST",
      url : "https://testapi.openbanking.or.kr/oauth/2.0/token",
      header : "",
      form : {
        code : authCode, // 인증 코드 받아서  
        client_id : "앱 키",
        client_secret : "앱 시크릿키",
        redirect_uri : "http://localhost:3000/user/authResult",
        grant_type : "authorization_code"
      }
  }
  request(option, function(error, response, body) {
    var result = JSON.parse(body);
    var access_token = result.access_token;
    var refresh_token = result.refresh_token;
    var user_seq_no = result.user_seq_no

    connection.query('UPDATE user SET ' +
    'accessToken = ?, refreshToken=?, userSeqno =? WHERE kakaoId = ?',
    [access_token, refresh_token, user_seq_no, currentUserID], function (error, results, fields) {
        if (error) throw error;     
    });
    res.send("현재 창을 닫고 회원가입을 계속 해주세요.");
  }) // 토큰과 ID 값 받아와서 DB에 저장까지 완료
});

// 이메일/비번 입력 후 DB 업데이트 - 회원가입 완료
router.post('/passwdUpdate', function (req, res) { // 패스워드 업데이트
    var email = req.body.email ;
    var password = req.body.password ;

    connection.query('UPDATE user SET ' +
    'password = ? WHERE email = ?', [password, email], function (error, results, fields) {
        if (error) throw error;
        res.json(1);       
    });     
});

// 로그인 페이지에서 이메일/비번 입력 후 로그인 눌렀을 때
router.post("/login", function(req, res) {
  var userEmail = req.body.userEmail;
  var userPassword = req.body.userPassword;

  connection.query('SELECT * FROM user WHERE email = ?',
    [userEmail], function (error, results, fields) {
        if (results.length < 1) {
            res.json(0);
        }
        else {
          if (results[0].password == userPassword) { // 비밀번호 체크
            jwt.sign( // 토큰 만드는 곳 같은뎁!
                {
                    userName : results[0].name,
                    userId : results[0].userID,
                    userEmail : results[0].email
                },
                tokenKey,
                {
                    expiresIn : '10d', // 토큰 유효기간 1d 일, 1h 시, 15m
                    issuer : 'wroom.admin',
                    subject : 'user.login.info'
                },
                function(err, token){
                    console.log('로그인 성공', token)
                    res.json(token) // 우리 서비스에 로그인하기 위한 토큰
                    // 액세스 토큰은 오픈 API를 이용하기 위한 토큰!
                }
            )
            }
          else {
            res.json(0);
          }
        };
    });  
});

module.exports = router;