var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost', // FIXME!
    user: 'root', // FIXME!
    password: 'root', // FIXME!
    database: 'wroom'

});

module.exports = connection;