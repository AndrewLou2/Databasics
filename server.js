const express = require("express");
const newConnection = require("./connectDB");
const path = require("path");

const app = express();
const port = 80;

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
    if (req.user == {}) res.send(JSON.stringify("Access Denied"));
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

    let id = req.user.ID;
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
    if (req.user == {}) res.send(JSON.stringify("Access Denied"));
    let id = req.user.ID;
    let material = req.body.materialid;
    let qty = req.body.qty;
    const conn = newConnection();
    if (req.user.customer)
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
    if (req.user == {}) res.send(JSON.stringify("Access Denied"));
    if (req.user.customer) res.send(JSON.stringify("No Customers allowed"));
    let filter = req.body.filter;
    let demandfilter = req.body.demandfilter;
    let category = makeSqlString(filter.category, true);
    if (filter.category.length == 0) category = `m.Category`;
    let sub_category = makeSqlString(filter.sub_category, true);
    if (filter.sub_category.length == 0) sub_category = `m.Sub_Category`;
    let size = makeSqlString(filter.size, false);
    if (filter.size.length == 0) size = `m.Size`;
    let gauge = makeSqlString(filter.category, false);
    if (filter.gauge.length == 0) gauge = `m.Gauge`;
    let rm = makeSqlString(filter.material, true);
    if (filter.material.length == 0) rm = `m.RM_Group`;
    let status = makeSqlString(demandfilter.status, true)
    if (demandfilter.status.length == 0) status = `d.Status`
    let ordered_by = makeSqlString(demandfilter.ordered_by, false)
    if (demandfilter.ordered_by.length == 0) ordered_by = `d.Ordered_By`
    let customer = makeSqlString(demandfilter.customer, true)
    if (demandfilter.customer.length == 0) customer = `d.Customer`

    const conn = newConnection();
    conn.query(
        `
        SELECT d.ID, m.Item_Description, d.Qty, d.Price, d.Status, d.Customer, d.Ordered_By FROM Demand_Orders d
        INNER JOIN Materials m on m.ID = d.Material
        WHERE (d.Customer in (${customer}) or d.Ordered_By in (${ordered_by}) and m.Category in (${category}) and m.Sub_Category in (${sub_category}) and m.Size in (${size}) and m.Gauge in (${gauge}) and m.RM_Group in (${rm}) and d.Status in (${status})))
        `, (err, rows, fields) => res.send(JSON.stringify(rows))
    );
    conn.end();
})

app.get('/db/listdemandstatus', (req, res, err) => {
    if (req.user == {}) res.send(JSON.stringify("Access Denied"));
    if (req.user.customer) res.send(JSON.stringify("No Customers allowed"));
    let filter = req.body.filter;
    let category = makeSqlString(filter.category, true);
    if (filter.category.length == 0) category = `m2.Category`;
    let sub_category = makeSqlString(filter.sub_category, true);
    if (filter.sub_category.length == 0) sub_category = `m2.Sub_Category`;
    let size = makeSqlString(filter.size, false);
    if (filter.size.length == 0) size = `m2.Size`;
    let gauge = makeSqlString(filter.category, false);
    if (filter.gauge.length == 0) gauge = `m2.Gauge`;
    let rm = makeSqlString(filter.material, true);
    if (filter.material.length == 0) rm = `m2.RM_Group`;
    let ordered_by = makeSqlString(demandfilter.ordered_by, false)
    if (demandfilter.ordered_by.length == 0) ordered_by = `d.Ordered_By`
    let customer = makeSqlString(demandfilter.customer, true)
    if (demandfilter.customer.length == 0) customer = `d.Customer`
    const conn = newConnection();
    conn.query(
        `
        SELECT d.Status, sum(EXISTS(SELECT * FROM Demand_Orders d2
            INNER JOIN Materials m2 on m2.ID = d2.Material
            WHERE m2.Category in (${category}) and m2.Sub_Category in (${sub_category}) and m2.Size in (${size}) and m2.Gauge in (${gauge}) and m2.RM_Group in (${rm}))) as Available FROM demand_orders d
            WHERE (d.Customer in (${customer}) or d.Ordered_By in (${ordered_by})
            Group by d.status;
        `, (err, rows, fields) => res.send(JSON.stringify(rows))
    );
    conn.end();
})

app.post('/db/approvedemand', (req, res, err) => {
    if (req.user == {}) res.send(JSON.stringify("Access Denied"));
    if (req.user.customer) res.send(JSON.stringify("No Customers allowed"));
    let id = req.user.ID;
    let demandID = req.user.demandID;
    const conn = newConnection();
    conn.query(
        `
        UPDATE Demand_Orders SET Status="OPEN", Approved_By=${id} where ID = ${demandID} and Status="Closed" and (SELECT approve_demand from Employees INNER JOIN User_Rights on User_Rights.ID = Employees.User_Rights where Employees.ID = ${id});
        `, (err, rows, fields) => {
            if (err) res.send(JSON.stringify(false));
            res.send(JSON.stringify(true));
        }
    );
    conn.end();
})

app.post('/db/completedemand', (req, res, err) => {
    if (req.user == {}) res.send(JSON.stringify("Access Denied"));
    if (req.user.customer) res.send(JSON.stringify("No Customers allowed"));
    let id = req.user.ID;
    let demandID = req.user.demandID;
    const conn = newConnection();
    conn.query(
        `
        UPDATE Demand_Orders SET Status="COMPLETE", Completion_Date=curdate() where ID = ${demandID} and Status="STAGED" and (SELECT complete_demand from Employees INNER JOIN User_Rights on User_Rights.ID = Employees.User_Rights where Employees.ID = ${id});
        `, (err, rows, fields) => {
            if (err) res.send(JSON.stringify(false));
            res.send(JSON.stringify(true));
        }
    );
    conn.end();
})

app.listen(port, () => console.log(`Server is listening on port ${port}`));
