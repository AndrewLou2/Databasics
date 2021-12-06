const express = require("express");
const newConnection = require("./connectDB");
const path = require("path");
const { nextTick } = require("process");

const app = express();
const port = 80;

const checkCredentials = (username, password, customer) => {
    const conn = newConnection();
    let table;
    let user = {};
    customer? table = "Customers" : table = "Employees";
    conn.query(
        `
        SELECT * FROM ${table}
        Where username = "${username}" and password = "${password}";
        `
        , (err, rows, fields) => {
            if (err) console.log(err);
            if (rows.length > 0)
                user = {user: rows[0].username, password:rows[0].password, customer:customer, id:rows[0].ID};
                return user;
        });

    conn.end();
}

const makeSqlString = (arr, isString) => {
    let out = ``;
    if (arr.length == 0) return out;
    for (let i = 0; i < arr.length; i++) {
        if (isString) 
            out += `"`+arr[i]+`",`;
        else 
            out += arr[i] + `,`;
    }
    out = out.substring(0, out.length-1);
    return out;
}

app.use(express.json());

app.use((req,res,next) => {
    console.log(req.body.user);
    let user = req.body.user;
    let checkedUser = {};
    const conn = newConnection();
    let table;
    user.customer? table = "Customers" : table = "Employees";
    console.log(table);
    conn.query(
        `
        SELECT * FROM ${table}
        Where username = "${user.user}" and password = "${user.password}";
        `
        , (err, rows, fields) => {
            if (err) console.log(err);
            else if (rows.length > 0) {
                console.log(rows);
                checkedUser = {user: rows[0].username, password:rows[0].password, customer:user.customer, id:rows[0].ID};
            }
            req.user = checkedUser;
            next();
        });
    conn.end();
})

app.get('/', (req, res, err) => res.send("hi"));

app.get('/db/productlist', (req, res, err) => {
    let filter = req.body.filter;
    let category = makeSqlString(filter.category, true);
    if (filter.category.length == 0) category = `Category`;
    let sub_category = makeSqlString(filter.sub_category, true);
    if (filter.sub_category.length == 0) sub_category = `Sub_Category`;
    let size = makeSqlString(filter.size, false);
    if (filter.size.length == 0) size = `Size`;
    let gauge = makeSqlString(filter.category, false);
    if (filter.gauge.length == 0) gauge = `Gauge`;
    let rm = makeSqlString(filter.material, true);
    if (filter.material.length == 0) rm = `RM_Group`;

    const conn = newConnection();
    conn.query(
        `
        SELECT ID, Item_Description, Price, Category, Sub_Category, Size, Gauge, RM_Group FROM Materials
        WHERE Category in (${category}) and Sub_Category in (${sub_category}) and Size in (${size}) and Gauge in (${gauge}) and RM_Group in (${rm});
        `, (err, rows, fields) => res.send(JSON.stringify(rows))
    );
    conn.end();
})

app.get('/db/listcategory', (req, res, err) => {
    let filter = req.body.filter;
    let sub_category = makeSqlString(filter.sub_category, true);
    if (filter.sub_category.length == 0) sub_category = `m2.Sub_Category`;
    let size = makeSqlString(filter.size, false);
    if (filter.size.length == 0) size = `m2.Size`;
    let gauge = makeSqlString(filter.category, false);
    if (filter.gauge.length == 0) gauge = `m2.Gauge`;
    let rm = makeSqlString(filter.material, true);
    if (filter.material.length == 0) rm = `m2.RM_Group`;

    const conn = newConnection();
    conn.query(
        `
        SELECT m.Category, sum(EXISTS(SELECT * FROM Materials m2
            WHERE m2.Category = m.Category and m2.Sub_Category in (${sub_category}) and m2.Size in (${size}) and m2.Gauge in (${gauge}) and m2.RM_Group in (${rm}))) as Available FROM Materials m
            Where m.Group_ID = "FG"
            Group by m.Category;
        
        `, (err, rows, fields) => res.send(JSON.stringify(rows))
    );
    conn.end();
})

app.get('/db/listsubcategory', (req, res, err) => {
    let filter = req.body.filter;
    let category = makeSqlString(filter.category, true);
    if (filter.category.length == 0) category = `m2.Category`;
    let size = makeSqlString(filter.size, false);
    if (filter.size.length == 0) size = `m2.Size`;
    let gauge = makeSqlString(filter.category, false);
    if (filter.gauge.length == 0) gauge = `m2.Gauge`;
    let rm = makeSqlString(filter.material, true);
    if (filter.material.length == 0) rm = `m2.RM_Group`;

    const conn = newConnection();
    conn.query(
        `
        SELECT m.Sub_Category, sum(EXISTS(SELECT * FROM Materials m2
            WHERE m2.Category in (${category}) and m2.Sub_Category = m.Sub_Category and m2.Size in (${size}) and m2.Gauge in (${gauge}) and m2.RM_Group in (${rm}))) as Available FROM Materials m
            Where m.Group_ID = "FG"
            Group by m.Sub_Category;
        
        `, (err, rows, fields) => res.send(JSON.stringify(rows))
    );
    conn.end();
})

app.get('/db/listsize', (req, res, err) => {
    let filter = req.body.filter;
    let category = makeSqlString(filter.category, true);
    if (filter.category.length == 0) category = `m2.Category`;
    let sub_category = makeSqlString(filter.sub_category, true);
    if (filter.sub_category.length == 0) sub_category = `m2.Sub_Category`;
    let gauge = makeSqlString(filter.category, false);
    if (filter.gauge.length == 0) gauge = `m2.Gauge`;
    let rm = makeSqlString(filter.material, true);
    if (filter.material.length == 0) rm = `m2.RM_Group`;

    const conn = newConnection();
    conn.query(
        `
        SELECT m.Size, sum(EXISTS(SELECT * FROM Materials m2
            WHERE m2.Category in (${category}) and m2.Sub_Category in (${sub_category}) and m2.Size = m.Size and m2.Gauge in (${gauge}) and m2.RM_Group in (${rm}))) as Available FROM Materials m
            Where m.Group_ID = "FG"
            Group by m.Size;
        
        `, (err, rows, fields) => res.send(JSON.stringify(rows))
    );
    conn.end();
})

app.get('/db/listgauge', (req, res, err) => {
    let filter = req.body.filter;
    let category = makeSqlString(filter.category, true);
    if (filter.category.length == 0) category = `m2.Category`;
    let sub_category = makeSqlString(filter.sub_category, true);
    if (filter.sub_category.length == 0) sub_category = `m2.Sub_Category`;
    let size = makeSqlString(filter.size, false);
    if (filter.size.length == 0) size = `m2.Size`;
    let rm = makeSqlString(filter.material, true);
    if (filter.material.length == 0) rm = `m2.RM_Group`;

    const conn = newConnection();
    conn.query(
        `
        SELECT m.Gauge, sum(EXISTS(SELECT * FROM Materials m2
            WHERE m2.Category in (${category}) and m2.Sub_Category in (${sub_category}) and m2.Size in (${size}) and m2.Gauge = m.Gauge and m2.RM_Group in (${rm}))) as Available FROM Materials m
            Where m.Group_ID = "FG"
            Group by m.Gauge;
        
        `, (err, rows, fields) => res.send(JSON.stringify(rows))
    );
    conn.end();
})

app.get('/db/listproductrm', (req, res, err) => {
    let filter = req.body.filter;
    let category = makeSqlString(filter.category, true);
    if (filter.category.length == 0) category = `m2.Category`;
    let sub_category = makeSqlString(filter.sub_category, true);
    if (filter.sub_category.length == 0) sub_category = `m2.Sub_Category`;
    let size = makeSqlString(filter.size, false);
    if (filter.size.length == 0) size = `m2.Size`;
    let gauge = makeSqlString(filter.category, false);
    if (filter.gauge.length == 0) gauge = `m2.Gauge`;

    const conn = newConnection();
    conn.query(
        `
        SELECT m.RM_Group, sum(EXISTS(SELECT * FROM Materials m2
            WHERE m2.Category in (${category}) and m2.Sub_Category in (${sub_category}) and m2.Size in (${size}) and m2.Gauge in (${gauge}) and m2.RM_Group = m.RM_Group)) as Available FROM Materials m
            Where m.Group_ID = "FG"
            Group by m.RM_Group;
        
        `, (err, rows, fields) => res.send(JSON.stringify(rows))
    );
    conn.end();
})

app.post('/db/register', (req, res, err) => {
    console.log(req.body.user);
    let newUser = req.body.user;
    const conn = newConnection();
    conn.query(
        `
        INSERT INTO Customers (Name, username, password, Address, Contact) 
        VALUES ("${newUser.name}", "${newUser.username}", "${newUser.password}", "${newUser.address}", "${newUser.contact}")
        `, (err, rows, fields) => {
            if (err) res.send(JSON.stringify(false));
            else res.send(JSON.stringify({user:newUser.username, password:newUser.password, customer:true, id:rows.insertId}));
        }
    );
    conn.end();
});

app.post('/db/login', (req, res, err) => {
    console.log(req.user)
    let user =  req.user;
    if (user != {}) res.send(user);
    else res.send(false);
})

app.get('/db/orderHistory', (req, res, err) => {
    let filter = req.body.filter;
    let category = makeSqlString(filter.category, true);
    if (filter.category.length == 0) category = `Category`;
    let sub_category = makeSqlString(filter.sub_category, true);
    if (filter.sub_category.length == 0) sub_category = `Sub_Category`;
    let size = makeSqlString(filter.size, false);
    if (filter.size.length == 0) size = `Size`;
    let gauge = makeSqlString(filter.category, false);
    if (filter.gauge.length == 0) gauge = `Gauge`;
    let rm = makeSqlString(filter.material, true);
    if (filter.material.length == 0) rm = `RM_Group`;

    let id = req.body.user.ID;
    const conn = newConnection();
    conn.query(
        `
        SELECT d.ID, m.Item_Description, d.Qty, d.Price, d,Status FROM Demand_Orders d
        INNER JOIN Materials m on m.ID = d.Material
        WHERE d.Customer = ${id} and m.Category in (${category}) and m.Sub_Category in (${sub_category}) and m.Size in (${size}) and m.Gauge in (${gauge}) and m.RM_Group in (${rm})))
        `, (err, rows, fields) => res.send(JSON.stringify(rows))
    );
    conn.end();
})

app.get('/db/placeorder', (req, res, err) => {
    let id = req.body.user.ID;
    let material = req.body.materialid;
    let qty = req.body.qty;
    const conn = newConnection();
    if (req.body.user.customer)
        conn.query(
            `
            INSERT INTO Demand_Orders (Material, Qty, Price, Customer, Order_Date)
            Select (ID, ${qty}, ${qty}*Price, ${id}, curdate())
            from Materials where ID = ${material};
            `, (err, rows, fields) => {
                if (err) res.send(JSON.stringify(false));
                res.send(JSON.stringify(true));
            }
        );
    else 
        conn.query(
            `
            INSERT INTO Demand_Orders (Material, Qty, Price, Ordered_By, Order_Date)
            Select (ID, ${qty}, ${qty}*Price, ${id}, curdate())
            from Materials where ID = ${material};
            `, (err, rows, fields) => {
                if (err) res.send(JSON.stringify(false));
                res.send(JSON.stringify(true));
            }
        );
    conn.end();
})

app.get('/db/demandlist', (req, res, err) => {
    let filter = req.body.filter;
    let demandfilter = req.body.demandfilter;
    let category = makeSqlString(filter.category, true);
    if (filter.category.length == 0) category = `Category`;
    let sub_category = makeSqlString(filter.sub_category, true);
    if (filter.sub_category.length == 0) sub_category = `Sub_Category`;
    let size = makeSqlString(filter.size, false);
    if (filter.size.length == 0) size = `Size`;
    let gauge = makeSqlString(filter.category, false);
    if (filter.gauge.length == 0) gauge = `Gauge`;
    let rm = makeSqlString(filter.material, true);
    if (filter.material.length == 0) rm = `RM_Group`;
    let status = makeSqlString(demandfilter.status, true)
    if (demandfilter.status.length == 0) status = `Status`

    let id = req.body.user.ID;
    const conn = newConnection();
    conn.query(
        `
        SELECT d.ID, m.Item_Description, d.Qty, d.Price, d,Status FROM Demand_Orders d
        INNER JOIN Materials m on m.ID = d.Material
        WHERE d.Customer = ${id} and m.Category in (${category}) and m.Sub_Category in (${sub_category}) and m.Size in (${size}) and m.Gauge in (${gauge}) and m.RM_Group in (${rm}) and d.Status in (${status})))
        `, (err, rows, fields) => res.send(JSON.stringify(rows))
    );
    conn.end();
})

app.get('/db/listdemandstatus', (req, res, err) => {
    let filter = req.body.filter;
    let category = makeSqlString(filter.category, true);
    if (filter.category.length == 0) category = `Category`;
    let sub_category = makeSqlString(filter.sub_category, true);
    if (filter.sub_category.length == 0) sub_category = `Sub_Category`;
    let size = makeSqlString(filter.size, false);
    if (filter.size.length == 0) size = `Size`;
    let gauge = makeSqlString(filter.category, false);
    if (filter.gauge.length == 0) gauge = `Gauge`;
    let rm = makeSqlString(filter.material, true);
    if (filter.material.length == 0) rm = `RM_Group`;

    let id = req.body.user.ID;
    const conn = newConnection();
    conn.query(
        `
        SELECT d.Status, sum(EXISTS(SELECT * FROM Materials m2
            WHERE m2.Category in (${category}) and m2.Sub_Category in (${sub_category}) and m2.Size in (${size}) and m2.Gauge = m.Gauge and m2.RM_Group in (${rm}))) as Available FROM demand_orders d
            Where m.Group_ID = "FG"
            Group by m.Gauge;
        `, (err, rows, fields) => res.send(JSON.stringify(rows))
    );
    conn.end();
})

app.listen(port, () => console.log(`Server is listening on port ${port}`));
