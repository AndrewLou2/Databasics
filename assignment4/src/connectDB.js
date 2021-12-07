const mysql = require("mysql");

function newConnection() {
    let conn = mysql.createConnection({
        host:'34.136.182.95',
        user: 'root',
        password: 'root',
        database: 'databasics'
    });

    return conn;
}

module.exports = newConnection;