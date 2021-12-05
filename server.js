const express = require("express");
const newConnection = require("./connectDB");
const path = require("path");
const { nextTick } = require("process");

const app = express();
const port = 80;

const checkCredentials = (username, password, customer) => {
    const conn = newConnection();
    let table;
    const user = {};
    customer? table = "Customers" : table = "Employees";
    conn.query(
        `
        SELECT * FROM ${table}
        Where username = ${username} and password = ${password};
        `
        , (err, rows, fields) => user = {usr: rows[0].username, pwd:rows[0].password, cust:rows[0].customer, id:rows[0].ID});

    conn.end();
    return user;
}

app.get('/', (req, res, err) => res.send("hi"));

app.get('/db/finishedGoods', (req, res, err) => {
    //let filter = req.body.filter;
    const conn = newConnection();
    conn.query(
        `
        SELECT Item_Description, Category, Sub_Category, Size, RM_Group, Price FROM Materials
        Where Group_ID = "FG";
        `, (err, rows, fields) => res.send(rows)
    );
    conn.end();
});

app.use((req, res, err) => {
    let user = req.body.user;
    user = checkCredentials(user.usr, user.pwd, user.customer);
    req.body.user = user;
    if (user === {}) res.send("Invalid Credentials");
    next();
});

app.post('/db/login', (req, res, err) => {
    res.send(req.body.user);
})

app.get('/db/orderHistory', (req, res, err) => {
    const conn = newConnection();
    conn.query(
        `
        SELECT d.ID, m.Item_Description, d.Qty, d.Price, d,Status FROM Demand_Orders d
        INNER JOIN Materials m on m.ID = d.Material
        WHERE d.Customer = ${req.body.user.ID}
        `, (err, rows, fields) => res.send(rows)
    );
    conn.end();
})

app.listen(port, () => console.log(`Server is listening on port ${port}`));
