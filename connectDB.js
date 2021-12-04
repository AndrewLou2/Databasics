const mysql = require("mysql");

function newConnection() {
    let conn = mysql.createConnection({
        host:'34.69.81.146',
        user: 'root',
        password: 'root',
        database: 'databasics'
    });

    return conn;
}

module.exports = newConnection;