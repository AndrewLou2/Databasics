const mysql = require("mysql");

function newConnection() {
    let conn = mysql.createConnection({
        host:'127.0.0.1',
        port: '3306',
        user: 'root',
        password: '',
        database: 'databasics'
    });

    return conn;
}

module.exports = newConnection;