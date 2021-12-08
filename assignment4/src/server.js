const express = require("express");
const newConnection = require("./connectDB");
const path = require("path");

const app = express();
const port = 80;

const makeSqlString = (arr, isString) => {
    let out = ``;
    try {if (arr.length == 0) return out;} catch (err) {return out;}
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

app.use(express.static(path.join(__dirname, "client/build")));

app.use((req,res,next) => {
    let user = req.body.user;
    let checkedUser = {};
    if (user == null || user == undefined) {
        req.user = checkedUser;
        next();
    } else {
        const conn = newConnection();
        let table;
        user.customer? table = "Customers" : table = "Employees";
        conn.query(
            `
            SELECT * FROM ${table}
            Where username = "${user.user}" and password = "${user.password}";
            `
            , (err, rows, fields) => {
                if (err) console.log(err);
                else if (rows.length > 0) {
                    checkedUser = {user: rows[0].username, password:rows[0].password, customer:user.customer, id:rows[0].ID};
                }
                req.user = checkedUser;
                next();
            });
        conn.end();
    }
})

app.get('/', (req, res, err) => res.sendFile(path.join(__dirname, "/client/build/index.html")));

app.post('/db/productlist', (req, res, err) => {
    let filter = req.body.filter;
    let category = makeSqlString(filter.category, true);
    if (filter.category.length == 0) category = `Category`;
    let sub_category = makeSqlString(filter.sub_category, true);
    if (filter.sub_category.length == 0) sub_category = `Sub_Category`;
    let size = makeSqlString(filter.size, false);
    if (filter.size.length == 0) size = `Size`;
    let gauge = makeSqlString(filter.gauge, false);
    if (filter.gauge.length == 0) gauge = `Gauge`;
    let rm = makeSqlString(filter.material, true);
    if (filter.material.length == 0) rm = `RM_Group`;
    let groupid = makeSqlString(filter.groupID, true);
    if (filter.groupID.length == 0) groupid = `Group_ID`;
    let uom = makeSqlString(filter.uom, true);
    if (filter.uom.length == 0) uom = `UOM`;

    const conn = newConnection();
    conn.query(
        `
        SELECT ID, Item_Description, Price, Category, Sub_Category, Size, Gauge, RM_Group FROM Materials
        WHERE Category in (${category}) and Sub_Category in (${sub_category}) and Size in (${size}) and Gauge in (${gauge}) and RM_Group in (${rm}) and Group_ID in (${groupid}) and UOM in (${uom});
        `, (err, rows, fields) => {
            if (err) console.log(err);
            res.send(JSON.stringify(rows))
        }
    );
    conn.end();
})

app.post('/db/listcategory', (req, res, err) => {
    let filter = req.body.filter;
    let category = `Category`;
    let sub_category = makeSqlString(filter.sub_category, true);
    if (filter.sub_category.length == 0) sub_category = `Sub_Category`;
    let size = makeSqlString(filter.size, false);
    if (filter.size.length == 0) size = `Size`;
    let gauge = makeSqlString(filter.gauge, false);
    if (filter.gauge.length == 0) gauge = `Gauge`;
    let rm = makeSqlString(filter.material, true);
    if (filter.material.length == 0) rm = `RM_Group`;
    let groupid = makeSqlString(filter.groupID, true);
    if (filter.groupID.length == 0) groupid = `Group_ID`;
    let uom = makeSqlString(filter.uom, true);
    if (filter.uom.length == 0) uom = `UOM`;
    const conn = newConnection();
    conn.query(
        `
        SELECT Category, count(ID) Available From Materials
            WHERE (Category in (${category}) or Category IS NULL) 
            and (Sub_Category in (${sub_category}) or Sub_Category IS NULL) 
            and (Size in (${size}) or Size IS NULL) 
            and (Gauge in (${gauge}) or Gauge IS NULL) 
            and (RM_Group in (${rm}) or RM_Group IS NULL) 
            and (Group_ID in (${groupid}) or Group_ID IS NULL)
            and (UOM in (${uom}) or UOM IS NULL)
            Group by Category;
        
        `, (err, rows, fields) => res.send(JSON.stringify(rows))
    );
    conn.end();
})

app.post('/db/listsubcategory', (req, res, err) => {
    let filter = req.body.filter;
    let category = makeSqlString(filter.category, true);
    if (filter.category.length == 0) category = `Category`;
    let sub_category = `Sub_Category`;
    let size = makeSqlString(filter.size, false);
    if (filter.size.length == 0) size = `Size`;
    let gauge = makeSqlString(filter.gauge, false);
    if (filter.gauge.length == 0) gauge = `Gauge`;
    let rm = makeSqlString(filter.material, true);
    if (filter.material.length == 0) rm = `RM_Group`;
    let groupid = makeSqlString(filter.groupID, true);
    if (filter.groupID.length == 0) groupid = `Group_ID`;
    let uom = makeSqlString(filter.uom, true);
    if (filter.uom.length == 0) uom = `UOM`;

    const conn = newConnection();
    conn.query(
        `
        SELECT Sub_Category, count(ID) Available From Materials
            WHERE (Category in (${category}) or Category IS NULL) 
            and (Sub_Category in (${sub_category}) or Sub_Category IS NULL) 
            and (Size in (${size}) or Size IS NULL) 
            and (Gauge in (${gauge}) or Gauge IS NULL) 
            and (RM_Group in (${rm}) or RM_Group IS NULL) 
            and (Group_ID in (${groupid}) or Group_ID IS NULL)
            and (UOM in (${uom}) or UOM IS NULL)
            Group by Sub_Category;
        
        `, (err, rows, fields) => res.send(JSON.stringify(rows))
    );
    conn.end();
})

app.post('/db/listsize', (req, res, err) => {
    let filter = req.body.filter;
    let category = makeSqlString(filter.category, true);
    if (filter.category.length == 0) category = `Category`;
    let sub_category = makeSqlString(filter.sub_category, true);
    if (filter.sub_category.length == 0) sub_category = `Sub_Category`;
    let size = `Size`;
    let gauge = makeSqlString(filter.gauge, false);
    if (filter.gauge.length == 0) gauge = `Gauge`;
    let rm = makeSqlString(filter.material, true);
    if (filter.material.length == 0) rm = `RM_Group`;
    let groupid = makeSqlString(filter.groupID, true);
    if (filter.groupID.length == 0) groupid = `Group_ID`;
    let uom = makeSqlString(filter.uom, true);
    if (filter.uom.length == 0) uom = `UOM`;

    const conn = newConnection();
    conn.query(
        `
        SELECT Size, count(ID) Available From Materials
        WHERE (Category in (${category}) or Category IS NULL) 
        and (Sub_Category in (${sub_category}) or Sub_Category IS NULL) 
        and (Size in (${size}) or Size IS NULL) 
        and (Gauge in (${gauge}) or Gauge IS NULL) 
        and (RM_Group in (${rm}) or RM_Group IS NULL) 
        and (Group_ID in (${groupid}) or Group_ID IS NULL)
        and (UOM in (${uom}) or UOM IS NULL)
        Group by Size;
        
        `, (err, rows, fields) => res.send(JSON.stringify(rows))
    );
    conn.end();
})

app.post('/db/listgauge', (req, res, err) => {
    let filter = req.body.filter;
    let category = makeSqlString(filter.category, true);
    if (filter.category.length == 0) category = `Category`;
    let sub_category = makeSqlString(filter.sub_category, true);
    if (filter.sub_category.length == 0) sub_category = `Sub_Category`;
    let size = makeSqlString(filter.size, false);
    if (filter.size.length == 0) size = `Size`;
    let gauge = `Gauge`;
    let rm = makeSqlString(filter.material, true);
    if (filter.material.length == 0) rm = `RM_Group`;
    let groupid = makeSqlString(filter.groupID, true);
    if (filter.groupID.length == 0) groupid = `Group_ID`;
    let uom = makeSqlString(filter.uom, true);
    if (filter.uom.length == 0) uom = `UOM`;

    const conn = newConnection();
    conn.query(
        `
        SELECT Gauge, count(ID) Available From Materials
        WHERE (Category in (${category}) or Category IS NULL) 
        and (Sub_Category in (${sub_category}) or Sub_Category IS NULL) 
        and (Size in (${size}) or Size IS NULL) 
        and (Gauge in (${gauge}) or Gauge IS NULL) 
        and (RM_Group in (${rm}) or RM_Group IS NULL) 
        and (Group_ID in (${groupid}) or Group_ID IS NULL)
        and (UOM in (${uom}) or UOM IS NULL)
        Group by Gauge;
        
        `, (err, rows, fields) => res.send(JSON.stringify(rows))
    );
    conn.end();
})

app.post('/db/listproductrm', (req, res, err) => {
    let filter = req.body.filter;
    let category = makeSqlString(filter.category, true);
    if (filter.category.length == 0) category = `Category`;
    let sub_category = makeSqlString(filter.sub_category, true);
    if (filter.sub_category.length == 0) sub_category = `Sub_Category`;
    let size = makeSqlString(filter.size, false);
    if (filter.size.length == 0) size = `Size`;
    let gauge = makeSqlString(filter.gauge, false);
    if (filter.gauge.length == 0) gauge = `Gauge`;
    let rm = `RM_Group`;
    let groupid = makeSqlString(filter.groupID, true);
    if (filter.groupID.length == 0) groupid = `Group_ID`;
    let uom = makeSqlString(filter.uom, true);
    if (filter.uom.length == 0) uom = `UOM`;

    const conn = newConnection();
    conn.query(
        `
        SELECT RM_Group, count(ID) Available From Materials
        WHERE (Category in (${category}) or Category IS NULL) 
        and (Sub_Category in (${sub_category}) or Sub_Category IS NULL) 
        and (Size in (${size}) or Size IS NULL) 
        and (Gauge in (${gauge}) or Gauge IS NULL) 
        and (RM_Group in (${rm}) or RM_Group IS NULL) 
        and (Group_ID in (${groupid}) or Group_ID IS NULL)
        and (UOM in (${uom}) or UOM IS NULL)
        Group by RM_Group;
        
        `, (err, rows, fields) => res.send(JSON.stringify(rows))
    );
    conn.end();
})

app.post('/db/register', (req, res, err) => {
    //console.log(req.body.user);
    if (Object.keys(req.user).length > 0) res.send(JSON.stringify("Username Unavailable"));
    else if (Object.keys(req.body.user).length == 0) res.send(JSON.stringify("All fields are mandatory"));
    else {
        let newUser = req.body.user;
        const conn = newConnection();
        conn.query(
            `
            INSERT INTO Customers (Name, username, password, Address, Contact) 
            VALUES ("${newUser.name}", "${newUser.username}", "${newUser.password}", "${newUser.address}", "${newUser.contact}")
            `, (err, rows, fields) => {
                if (err) res.send(JSON.stringify(false))
                else res.send(JSON.stringify({user:newUser.username, password:newUser.password, customer:true, id:rows.insertId}));
            }
        );
        conn.end();
    }
});

app.post('/db/login', (req, res, err) => {
    let user = req.user;
    if (Object.keys(req.user).length != 0) res.send(user);
    else res.send(false);
})

app.post('/db/orderHistory', (req, res, err) => {
    if (Object.keys(req.user).length == 0) res.send(JSON.stringify("Access Denied"));
    else {
        let filter = req.body.filter;
        let category = makeSqlString(filter.category, true);
        if (filter.category.length == 0) category = `m.Category`;
        let sub_category = makeSqlString(filter.sub_category, true);
        if (filter.sub_category.length == 0) sub_category = `m.Sub_Category`;
        let size = makeSqlString(filter.size, false);
        if (filter.size.length == 0) size = `m.Size`;
        let gauge = makeSqlString(filter.gauge, false);
        if (filter.gauge.length == 0) gauge = `m.Gauge`;
        let rm = makeSqlString(filter.material, true);
        if (filter.material.length == 0) rm = `m.RM_Group`;

        let id = req.user.id;
        const conn = newConnection();
        conn.query(
            `
            SELECT d.ID, m.Item_Description, d.Qty, d.Price, d.Status FROM Demand_Orders d
            INNER JOIN Materials m on m.ID = d.Material
            WHERE d.Customer = ${id} and m.Category in (${category}) and m.Sub_Category in (${sub_category}) and m.Size in (${size}) and m.Gauge in (${gauge}) and m.RM_Group in (${rm})
            `, (err, rows, fields) => res.send(JSON.stringify(rows))
        );
        conn.end();
    }
})

app.post('/db/placeorder', (req, res, err) => {
    if (Object.keys(req.user).length == 0) {res.send(JSON.stringify("Access Denied"))}
    else {
        let id = req.user.id;
        let material = req.body.materialid;
        let qty = req.body.qty;
        const conn = newConnection();
        if (req.user.customer)
            conn.query(
                `
                INSERT INTO Demand_Orders (Material, Qty, Price, Customer, Order_Date)
                Select ID, ${qty}, ${qty}*Price, ${id}, curdate()
                from Materials where ID = ${material}
                and Group_ID = "FG"
                `, (err, rows, fields) => {
                    if (err || rows.affectedRows == 0) res.send(JSON.stringify(false))
                    else res.send(JSON.stringify(true));
                }
            )
        else 
            conn.query(
                `
                INSERT INTO Demand_Orders (Material, Qty, Price, Ordered_By, Order_Date)
                Select ID, ${qty}, ${qty}*Price, ${id}, curdate()
                from Materials where ID = ${material};
                `, (err, rows, fields) => {
                    if (err) res.send(JSON.stringify(false))
                    else res.send(JSON.stringify(true));
                }
            );
        conn.end();
    }
})

app.post('/db/createsupply', (req, res, err) => {
    if (Object.keys(req.user).length == 0) res.send(JSON.stringify("Access Denied"));
    else if (req.user.customer) res.send(JSON.stringify("No Customers allowed"));
    else {
        let id = req.user.id;
        let material = req.body.materialid;
        let qty = req.body.qty;
        const conn = newConnection();
            conn.query(
                `
                INSERT INTO Supply_Orders (Material, Qty, Ordered_By, Order_Date)
                VALUES (${material}, ${qty}, ${id}, curdate())
                `, (err, rows, fields) => {
                    console.log(rows.affectedRows);
                    if (err) {console.log(err);res.send(JSON.stringify(false))}
                    else res.send(JSON.stringify(true));
                }
            )
        conn.end();
    }
})

app.post('/db/demandlist', (req, res, err) => {
    if (Object.keys(req.user).length == 0) res.send(JSON.stringify("Access Denied"));
    else if (req.user.customer) res.send(JSON.stringify("No Customers allowed"));
    else {
        let filter = req.body.filter;
        let demandfilter = req.body.demandfilter;
        let category = makeSqlString(filter.category, true);
        if (filter.category.length == 0) category = `m.Category`;
        let sub_category = makeSqlString(filter.sub_category, true);
        if (filter.sub_category.length == 0) sub_category = `m.Sub_Category`;
        let size = makeSqlString(filter.size, false);
        if (filter.size.length == 0) size = `m.Size`;
        let gauge = makeSqlString(filter.gauge, false);
        if (filter.gauge.length == 0) gauge = `m.Gauge`;
        let rm = makeSqlString(filter.material, true);
        if (filter.material.length == 0) rm = `m.RM_Group`;
        let groupid = makeSqlString(filter.groupID, true);
        if (filter.groupID.length == 0) groupid = `m.Group_ID`;
        let uom = makeSqlString(filter.uom, true);
        if (filter.uom.length == 0) uom = `m.UOM`;
        let status = makeSqlString(demandfilter.status, true)
        if (demandfilter.status.length == 0) status = `d.Status`
        let ordered_by = makeSqlString(demandfilter.ordered_by, false)
        if (demandfilter.ordered_by.length == 0) ordered_by = `d.Ordered_By`
        let customer = makeSqlString(demandfilter.customer, true)
        if (demandfilter.customer.length == 0) customer = `d.Customer`

        const conn = newConnection();
        conn.query(
            `
            SELECT d.ID, m.Item_Description, m.Group_ID, d.Qty, d.Price, d.Status, d.Customer, d.Ordered_By FROM Demand_Orders d
            INNER JOIN Materials m on m.ID = d.Material
            WHERE (d.Customer in (${customer}) or d.Ordered_By in (${ordered_by})) 
            and d.Status in (${status}) 
            and (Category in (${category}) or Category IS NULL) 
            and (Sub_Category in (${sub_category}) or Sub_Category IS NULL) 
            and (Size in (${size}) or Size IS NULL) 
            and (Gauge in (${gauge}) or Gauge IS NULL) 
            and (RM_Group in (${rm}) or RM_Group IS NULL) 
            and (Group_ID in (${groupid}) or Group_ID IS NULL) 
            and (UOM in (${uom}) or UOM IS NULL)
            `, (err, rows, fields) =>{
                if (err) console.log(err);
                 res.send(JSON.stringify(rows));
                
            }
        );
        conn.end();
    }
})

app.post('/db/listdemandstatus', (req, res, err) => {
    if (Object.keys(req.user).length == 0) res.send(JSON.stringify("Access Denied"));
    else if (req.user.customer) res.send(JSON.stringify("No Customers allowed"));
    else {
        let filter = req.body.filter;
        let demandfilter = req.body.demandfilter;
        let category = makeSqlString(filter.category, true);
        if (filter.category.length == 0) category = `m.Category`;
        let sub_category = makeSqlString(filter.sub_category, true);
        if (filter.sub_category.length == 0) sub_category = `m.Sub_Category`;
        let size = makeSqlString(filter.size, false);
        if (filter.size.length == 0) size = `m.Size`;
        let gauge = makeSqlString(filter.gauge, false);
        if (filter.gauge.length == 0) gauge = `m.Gauge`;
        let rm = makeSqlString(filter.material, true);
        if (filter.material.length == 0) rm = `m.RM_Group`;
        let groupid = makeSqlString(filter.groupID, true);
        if (filter.groupID.length == 0) groupid = `m.Group_ID`;
        let uom = makeSqlString(filter.uom, true);
        if (filter.uom.length == 0) uom = `m.UOM`;
        let ordered_by = makeSqlString(demandfilter.ordered_by, false)
        if (demandfilter.ordered_by.length == 0) ordered_by = `d.Ordered_By`
        let customer = makeSqlString(demandfilter.customer, true)
        if (demandfilter.customer.length == 0) customer = `d.Customer`
        const conn = newConnection();
        conn.query(
            `
            SELECT d.Status, count(d.ID) Available From Demand_Orders d
            INNER JOIN Materials m
            WHERE (m.Category in (${category}) or m.Category IS NULL) 
            and (m.Sub_Category in (${sub_category}) or m.Sub_Category IS NULL) 
            and (m.Size in (${size}) or m.Size IS NULL) 
            and (m.Gauge in (${gauge}) or m.Gauge IS NULL) 
            and (m.RM_Group in (${rm}) or m.RM_Group IS NULL) 
            and (m.Group_ID in (${groupid}) or m.Group_ID IS NULL)
            and (m.UOM in (${uom}) or m.UOM IS NULL)
            Group by d.Status;
            `, (err, rows, fields) => res.send(JSON.stringify(rows))
        );
        conn.end();
    }
})

app.post('/db/approvedemand', (req, res, err) => {
    if (Object.keys(req.user).length == 0) res.send(JSON.stringify("Access Denied"));
    else if (req.user.customer) res.send(JSON.stringify("No Customers allowed"));
    else {
        let id = req.user.id;
        let demandID = req.body.demandID;
        const conn = newConnection();
        conn.query(
            `
            UPDATE Demand_Orders SET Status="OPEN", Approved_By=${id} where ID = ${demandID} and Status="NEW" and (SELECT approve_demand from Employees INNER JOIN User_Rights on User_Rights.ID = Employees.User_Rights where Employees.ID = ${id});
            `, (err, rows, fields) => {
                if (err || rows.affectedRows == 0) res.send(JSON.stringify(false))
                else res.send(JSON.stringify(true));
            }
        );
        conn.end();
    }
})

app.post('/db/completedemand', (req, res, err) => {
    if (Object.keys(req.user).length == 0) res.send(JSON.stringify("Access Denied"));
    else if (req.user.customer) res.send(JSON.stringify("No Customers allowed"));
    else {    
        let id = req.user.id;
        let demandID = req.body.demandID;
        const conn = newConnection();
        conn.query(
            `
            UPDATE Demand_Orders SET Status="COMPLETE", Completion_Date=curdate() where ID = ${demandID} and Status="STAGED" and (SELECT complete_demand from Employees INNER JOIN User_Rights on User_Rights.ID = Employees.User_Rights where Employees.ID = ${id});
            `, (err, rows, fields) => {
                if (err) res.send(JSON.stringify(false));
                else {
                    conn.query(
                        `
                        UPDATE Materials m
                        INNER JOIN Demand_Orders d on d.Material = m.ID
                        SET m.Staged=m.Staged-d.Qty,
                            m.Stock=m.Stock-d.Qty
                        WHERE d.ID = ${demandID};
                        `, (err, rows, fields) => {
                            if (err) res.send(JSON.stringify(false));
                            else res.send(JSON.stringify(true));
                        }
                    );
                    conn.end();
                }
            }
        );
    }
})

app.post('/db/toptendemand', (req, res, err) => {
    if (Object.keys(req.user).length == 0) res.send(JSON.stringify("Access Denied"));
    else if (req.user.customer) res.send(JSON.stringify("No Customers allowed"));
    else {
        const conn = newConnection();
        conn.query(
            `
            SELECT m.ID, m.Item_Description, SUM(d.Qty) Total_Qty from Demand_Orders d 
            INNER JOIN Materials m on d.Material = m.ID
            GROUP BY m.ID, m.Item_Description
            LIMIT 10
            `, (err, rows, fields) => {
                if (err) res.send(JSON.stringify(err))
                else res.send(JSON.stringify(rows));
            }
        );
        conn.end();
    }
})

app.post('/db/toptendemandrevenue', (req, res, err) => {
    if (Object.keys(req.user).length == 0) res.send(JSON.stringify("Access Denied"));
    else if (req.user.customer) res.send(JSON.stringify("No Customers allowed"));
    else {
        const conn = newConnection();
        conn.query(
            `
            SELECT m.ID, m.Item_Description, SUM(d.Price) Total_Price from Demand_Orders d 
            INNER JOIN Materials m on d.Material = m.ID
            GROUP BY m.ID, m.Item_Description
            LIMIT 10
            `, (err, rows, fields) => {
                if (err) res.send(JSON.stringify(err))
                else res.send(JSON.stringify(rows));
            }
        );
        conn.end();
    }
})

app.post('/db/totalbyrm', (req, res, err) => {
    if (Object.keys(req.user).length == 0) res.send(JSON.stringify("Access Denied"));
    else if (req.user.customer) res.send(JSON.stringify("No Customers allowed"));
    else {
        const conn = newConnection();
        conn.query(
            `
            SELECT m.ID, m.Item_Description, SUM(a.Qty) Total, a.UOM from Materials m1 
            INNER JOIN (
            WITH RECURSIVE receipt(n, FG, FG_txt, Parent, Parent_txt, Child, Child_txt, Qty, UOM, Scrap, Price, GroupID) as 
            (
                SELECT 0, m.ID, m.Item_Description, m.ID, m.Item_Description, null, null, 1, m.UOM, 0.00, m.Price, m.Group_ID FROM Materials m
                UNION ALL
                SELECT 1, m.ID, m.Item_Description, m.ID, m.Item_Description, m2.ID, m2.Item_Description, b.Qty, m2.UOM, b.Scrap, m2.Price, m2.Group_ID From Bill_Of_Materials b
                INNER JOIN Materials m on b.Finished_Good = m.ID
                INNER JOIN Materials m2 on b.Child = m2.ID
                UNION ALL
                SELECT 1 + n, r.FG, r.FG_Txt, m.ID, m.Item_Description, m2.ID, m2.Item_Description, b.Qty*r.Qty, m2.UOM, b.Scrap, m2.Price, m2.Group_ID From Bill_Of_Materials b
                INNER JOIN Materials m on b.Finished_Good = m.ID
                INNER JOIN Materials m2 on b.Child = m2.ID
                INNER JOIN receipt r on r.Child = m.ID
            ) SELECT * FROM receipt) as a on a.FG = m1.ID
            INNER JOIN Materials m on a.Child = m.ID
            WHERE m.Category = "Metal"
            GROUP BY m.ID, m.Item_Description, a.UOM;
            `, (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    res.send(JSON.stringify(err));
                } else res.send(JSON.stringify(rows));
            }
        );
        conn.end();
    }
})

app.post('/db/inventorydemand', (req, res, err) => {
    if (Object.keys(req.user).length == 0) res.send(JSON.stringify("Access Denied"));
    else if (req.user.customer) res.send(JSON.stringify("No Customers allowed"));
    else {
        let filter = req.body.filter;
        let demandfilter = req.body.demandfilter;
        let category = makeSqlString(filter.category, true);
        if (filter.category.length == 0) category = `m.Category`;
        let sub_category = makeSqlString(filter.sub_category, true);
        if (filter.sub_category.length == 0) sub_category = `m.Sub_Category`;
        let size = makeSqlString(filter.size, false);
        if (filter.size.length == 0) size = `m.Size`;
        let gauge = makeSqlString(filter.gauge, false);
        if (filter.gauge.length == 0) gauge = `m.Gauge`;
        let rm = makeSqlString(filter.material, true);
        if (filter.material.length == 0) rm = `m.RM_Group`;
        let groupid = makeSqlString(filter.groupID, true);
        if (filter.groupID.length == 0) groupid = `m.Group_ID`;
        let uom = makeSqlString(filter.uom, true);
        if (filter.uom.length == 0) uom = `m.UOM`;
        let ordered_by = makeSqlString(demandfilter.ordered_by, false)
        if (demandfilter.ordered_by.length == 0) ordered_by = `d.Ordered_By`
        let customer = makeSqlString(demandfilter.customer, true)
        if (demandfilter.customer.length == 0) customer = `d.Customer`

        const conn = newConnection();
        conn.query(
            `
            SELECT d.ID, m.Item_Description, d.Qty, d.Price, d.Status, d.Customer, d.Ordered_By FROM Demand_Orders d
            INNER JOIN Materials m on m.ID = d.Material
            WHERE (d.Customer in (${customer}) or d.Ordered_By in (${ordered_by}) and m.Category in (${category}) and m.Sub_Category in (${sub_category}) and m.Size in (${size}) and m.Gauge in (${gauge}) and m.RM_Group in (${rm}) and m.Group_ID in (${groupid}) and m.UOM in (${uom}) and d.Status = "OPEN")
            `, (err, rows, fields) => res.send(JSON.stringify(rows))
        );
        conn.end();
    }
})

app.post('/db/stagedemand', (req, res, err) => {
    if (Object.keys(req.user).length == 0) res.send(JSON.stringify("Access Denied"));
    else if (req.user.customer) res.send(JSON.stringify("No Customers allowed"));
    else {
        let id = req.user.id;
        let demandID = req.body.demandID;
        const conn = newConnection();
        conn.query(
            `
            UPDATE Demand_Orders d INNER JOIN Materials m on m.ID = d.Material SET Status="STAGED" where m.Stock > d.Qty and d.ID = ${demandID} and d.Status="OPEN" and (SELECT stage_demand from Employees INNER JOIN User_Rights on User_Rights.ID = Employees.User_Rights where Employees.ID = ${id});
            `, (err, rows, fields) => {
                if (err || rows.affectedRows == 0) res.send(JSON.stringify(false));
                else {
                    conn.query(
                        `
                        UPDATE Materials m
                        INNER JOIN Demand_Orders d on d.Material = m.ID
                        SET m.Staged=m.Staged+d.Qty,
                            m.Stock=m.Stock-d.Qty
                        WHERE d.ID = ${demandID};
                        `, (err, rows, fields) => {
                            if (err ) res.send(JSON.stringify(false));
                            else res.send(JSON.stringify(true));
                        }
                    );
                    conn.end();
                }
            }
        );
    }
})

app.post('/db/supplylist', (req, res, err) => {
    if (Object.keys(req.user).length == 0) res.send(JSON.stringify("Access Denied"));
    else if (req.user.customer) res.send(JSON.stringify("No Customers allowed"));
    else {
        let filter = req.body.filter;
        let supplyfilter = req.body.supplyfilter;
        let category = makeSqlString(filter.category, true);
        if (filter.category.length == 0) category = `m.Category`;
        let sub_category = makeSqlString(filter.sub_category, true);
        if (filter.sub_category.length == 0) sub_category = `m.Sub_Category`;
        let size = makeSqlString(filter.size, false);
        if (filter.size.length == 0) size = `m.Size`;
        let gauge = makeSqlString(filter.gauge, false);
        if (filter.gauge.length == 0) gauge = `m.Gauge`;
        let rm = makeSqlString(filter.material, true);
        if (filter.material.length == 0) rm = `m.RM_Group`;
        let groupid = makeSqlString(filter.groupID, true);
        if (filter.groupID.length == 0) groupid = `m.Group_ID`;
        let uom = makeSqlString(filter.uom, true);
        if (filter.uom.length == 0) uom = `m.UOM`;
        let ordered_by = makeSqlString(supplyfilter.ordered_by, false)
        if (supplyfilter.ordered_by.length == 0) ordered_by = `s.Ordered_By`;
        let status = makeSqlString(supplyfilter.status, true)
        if (supplyfilter.status.length == 0) status = `s.Status`
        let vendor = makeSqlString(supplyfilter.vendor, false)
        if (supplyfilter.vendor.length == 0) vendor = `s.Vendor`

        const conn = newConnection();
        conn.query(
            `
            SELECT s.ID, m.Item_Description, m.Group_ID, s.Qty, s.Cost, s.Status, s.Ordered_By FROM Supply_Orders s
            INNER JOIN Materials m on m.ID = s.Material
            WHERE s.Ordered_By in (${ordered_by}) 
            and (s.Vendor in (${vendor}) or s.Vendor IS NULL) 
            and (m.Category in (${category}) or m.Category IS NULL) 
            and (m.Sub_Category in (${sub_category}) or m.Sub_Category IS NULL) 
            and (m.Size in (${size}) or m.Size IS NULL) 
            and (m.Gauge in (${gauge}) or m.Gauge IS NULL) 
            and (m.RM_Group in (${rm}) or m.RM_Group IS NULL) 
            and (m.Group_ID in (${groupid}) or m.Group_ID IS NULL)
            and (m.UOM in (${uom}) or m.UOM IS NULL)
            and s.Status in (${status})
            `, (err, rows, fields) => res.send(JSON.stringify(rows))
        );
        conn.end();
    }
})

app.post('/db/listsupplystatus', (req, res, err) => {
    if (Object.keys(req.user).length == 0) res.send(JSON.stringify("Access Denied"));
    else if (req.user.customer) res.send(JSON.stringify("No Customers allowed"));
    else {
        let filter = req.body.filter;
        let supplyfilter = req.body.supplyfilter;
        let category = makeSqlString(filter.category, true);
        if (filter.category.length == 0) category = `m.Category`;
        let sub_category = makeSqlString(filter.sub_category, true);
        if (filter.sub_category.length == 0) sub_category = `m.Sub_Category`;
        let size = makeSqlString(filter.size, false);
        if (filter.size.length == 0) size = `m.Size`;
        let gauge = makeSqlString(filter.gauge, false);
        if (filter.gauge.length == 0) gauge = `m.Gauge`;
        let rm = makeSqlString(filter.material, true);
        if (filter.material.length == 0) rm = `m.RM_Group`;
        let groupid = makeSqlString(filter.groupID, true);
        if (filter.groupID.length == 0) groupid = `m.Group_ID`;
        let uom = makeSqlString(filter.uom, true);
        if (filter.uom.length == 0) uom = `m.UOM`;
        let ordered_by = makeSqlString(supplyfilter.ordered_by, false)
        if (supplyfilter.ordered_by.length == 0) ordered_by = `s.Ordered_By`;

        const conn = newConnection();
        conn.query(
            `
            SELECT s.Status, count(s.ID) Available From Supply_Orders s
            INNER JOIN Materials m
            WHERE (m.Category in (${category}) or m.Category IS NULL) 
            and (m.Sub_Category in (${sub_category}) or m.Sub_Category IS NULL) 
            and (m.Size in (${size}) or m.Size IS NULL) 
            and (m.Gauge in (${gauge}) or m.Gauge IS NULL) 
            and (m.RM_Group in (${rm}) or m.RM_Group IS NULL) 
            and (m.Group_ID in (${groupid}) or m.Group_ID IS NULL)
            and (m.UOM in (${uom}) or m.UOM IS NULL)
            Group by s.Status;
            `, (err, rows, fields) => res.send(JSON.stringify(rows))
        );
        conn.end();
    }
})

app.post('/db/approvesupply', (req, res, err) => {
    if (Object.keys(req.user).length == 0) res.send(JSON.stringify("Access Denied"));
    else if (req.user.customer) res.send(JSON.stringify("No Customers allowed"));
    else {
        let id = req.user.id;
        let supplyID = req.body.supplyID;
        const conn = newConnection();
        conn.query(
            `
            UPDATE Supply_Orders SET Status="OPEN" where ID = ${supplyID} and Status="NEW" and (SELECT approve_supply from Employees INNER JOIN User_Rights on User_Rights.ID = Employees.User_Rights where Employees.ID = ${id});
            `, (err, rows, fields) => {
                if (err) res.send(JSON.stringify(false))
                else res.send(JSON.stringify(true));
            }
        );
        conn.end();
    }
})

app.post('/db/checkmaterialavailability', (req, res, err) => {
    if (Object.keys(req.user).length == 0) res.send(JSON.stringify("Access Denied"));
    else if (req.user.customer) res.send(JSON.stringify("No Customers allowed"));
    else {
        let id = req.user.id;
        let supplyID = req.body.supplyID;
        const conn = newConnection();
        conn.query(
            `
            select m.ID, m.Item_Description, m.Stock in_stock, b.Qty*s.Qty required from supply_orders s
            left join bill_of_materials b on s.Material = b.Finished_Good
            inner join materials m on b.Child
            where b.Qty*s.Qty > m.Stock and s.ID = ${supplyID}
            `, (err, rows, fields) => {
                if (err) res.send(JSON.stringify({}))
                else res.send(JSON.stringify(rows));
            }
        );
        conn.end();
    }
})

app.post('/db/producesupply', (req, res, err) => {
    if (Object.keys(req.user).length == 0) res.send(JSON.stringify("Access Denied"));
    else if (req.user.customer) res.send(JSON.stringify("No Customers allowed"));
    else {
        let id = req.user.id;
        let supplyID = req.body.supplyID;
        const conn = newConnection();
        conn.query(
            `
            UPDATE Supply_Orders as s
            INNER JOIN materials m on s.Material = m.ID
            SET Status="PRODUCTION"
            WHERE s.ID = ${supplyID} and Status="OPEN" 
            and m.Group_ID <> "RM"
            and (SELECT produce_supply FROM Employees 
            INNER JOIN User_Rights on User_Rights.ID = Employees.User_Rights WHERE Employees.ID = ${id})
            and not exists (
                SELECT * FROM bill_of_materials b
                INNER JOIN materials m2 on b.Child
                WHERE b.Qty*s.Qty > m2.Stock and s.Material = b.Finished_Good);
            `, (err, rows, fields) => {
                if (err) {console.log(err);res.send(JSON.stringify(false));}
                else {
                    conn.query(
                        `
                        UPDATE Materials m 
                        LEFT JOIN Bill_Of_Materials b on b.Child = m.ID
                        INNER JOIN Supply_Orders s on s.Material = b.Finished_Good
                        SET m.Stock=m.Stock-b.Qty*s.Qty 
                        WHERE s.ID = ${supplyID};
                        `, (err, rows, fields) => {
                            if (err) res.send(JSON.stringify(false));
                            else {
                                conn.query(
                                    `
                                    UPDATE Materials m 
                                    INNER JOIN Supply_Orders s on s.Material = m.ID
                                    SET m.WIP=m.WIP+s.Qty 
                                    WHERE s.ID = ${supplyID};
                                    `, (err, rows, fields) => {
                                        if (err) res.send(JSON.stringify(false));
                                        else res.send(JSON.stringify(true));
                                    }
                                );
                                conn.end();
                            }
                        }
                    );
                }
            }
        );
    }
})

app.post('/db/ordersupply', (req, res, err) => {
    if (Object.keys(req.user).length == 0) res.send(JSON.stringify("Access Denied"));
    else if (req.user.customer) res.send(JSON.stringify("No Customers allowed"));
    else {
        let id = req.user.id;
        let supplyID = req.body.supplyID;
        const conn = newConnection();
        conn.query(
            `
            UPDATE Supply_Orders as s
            INNER JOIN materials m on s.Material = m.ID
            SET Status="ORDERED"
            WHERE s.ID = ${supplyID} and Status="OPEN" 
            and m.Group_ID = "RM"
            and (SELECT order_supply FROM Employees 
            INNER JOIN User_Rights on User_Rights.ID = Employees.User_Rights WHERE Employees.ID = ${id})
            `, (err, rows, fields) => {
                if (err) res.send(JSON.stringify(false))
                else res.send(JSON.stringify(true));
            }
        );
        conn.end();
    }
})

app.post('/db/completesupply', (req, res, err) => {
    if (Object.keys(req.user).length == 0) res.send(JSON.stringify("Access Denied"));
    else if (req.user.customer) res.send(JSON.stringify("No Customers allowed"));
    else {
        let id = req.user.id;
        let supplyID = req.body.supplyID;
        const conn = newConnection();
        conn.query(
            `
            UPDATE Supply_Orders as s
            INNER JOIN materials m on s.Material = m.ID
            SET
            s.Cost = if(Status = "ORDERED", 
            (select vi2.cost from vendor_items vi2 where vi2.item = m.ID order by cost Asc limit 1)*s.Qty, null), 
            s.Vendor = if(Status = "ORDERED", 
            (select vi2.vendor from vendor_items vi2 where vi2.item = m.ID order by cost asc limit 1), null),
            s.Status="COMPLETE"
            WHERE s.ID = ${supplyID} and Status in ("PRODUCTION","ORDERED") 
            and (SELECT complete_supply FROM Employees 
            INNER JOIN User_Rights on User_Rights.ID = Employees.User_Rights WHERE Employees.ID = ${id});
            `, (err, rows, fields) => {
                console.log(err);
                if (err) res.send(JSON.stringify(false));
                else {
                    conn.query(
                        `
                        UPDATE Materials m 
                        INNER JOIN Supply_Orders s on s.Material = m.ID
                        SET m.Stock=m.Stock+s.Qty,
                            m.WIP = if(m.Group_ID <> "RM", m.Wip - s.Qty, m.Wip)
                        WHERE s.ID = ${supplyID};
                        `, (err, rows, fields) => {
                            if (err) res.send(JSON.stringify(false))
                            else res.send(JSON.stringify(true));
                        }
                    );
                    conn.end();
                }
            }
        );
    }
})

app.post('/db/materials', (req, res, err) => {
    if (Object.keys(req.user).length == 0) res.send(JSON.stringify("Access Denied"));
    else if (req.user.customer) res.send(JSON.stringify("No Customers allowed"));
    else {
        let filter = req.body.filter;
        let category = makeSqlString(filter.category, true);
        if (filter.category.length == 0) category = `Category`;
        let sub_category = makeSqlString(filter.sub_category, true);
        if (filter.sub_category.length == 0) sub_category = `Sub_Category`;
        let size = makeSqlString(filter.size, false);
        if (filter.size.length == 0) size = `Size`;
        let gauge = makeSqlString(filter.gauge, false);
        if (filter.gauge.length == 0) gauge = `Gauge`;
        let rm = makeSqlString(filter.material, true);
        if (filter.material.length == 0) rm = `RM_Group`;
        let groupid = makeSqlString(filter.groupID, true);
        if (filter.groupID.length == 0) groupid = `Group_ID`;
        let uom = makeSqlString(filter.uom, true);
        if (filter.uom.length == 0) uom = `UOM`;
        const conn = newConnection();
        conn.query(
            `
            SELECT * from Materials 
            WHERE (Category in (${category}) or Category IS NULL) and (Sub_Category in (${sub_category}) or Sub_Category IS NULL) and (Size in (${size}) or Size IS NULL) and (Gauge in (${gauge}) or Gauge IS NULL) and (RM_Group in (${rm}) or RM_Group IS NULL) and (Group_ID in (${groupid}) or Group_ID IS NULL) and (UOM in (${uom}) or UOM IS NULL)
            `, (err, rows, fields) => {res.send(JSON.stringify(rows))}
        );
        conn.end();
    }
})

app.post('/db/listgroupids', (req, res, err) => {
    if (Object.keys(req.user).length == 0) res.send(JSON.stringify("Access Denied"));
    else if (req.user.customer) res.send(JSON.stringify("No Customers allowed"));
    else {
        let filter = req.body.filter;
        let category = makeSqlString(filter.category, true);
        if (filter.category.length == 0) category = `Category`;
        let sub_category = makeSqlString(filter.sub_category, true);
        if (filter.sub_category.length == 0) sub_category = `Sub_Category`;
        let size = makeSqlString(filter.size, false);
        if (filter.size.length == 0) size = `Size`;
        let gauge = makeSqlString(filter.gauge, false);
        if (filter.gauge.length == 0) gauge = `Gauge`;
        let rm = makeSqlString(filter.material, true);
        if (filter.material.length == 0) rm = `RM_Group`;
        let groupid = `Group_ID`;
        let uom = makeSqlString(filter.uom, true);
        if (filter.uom.length == 0) uom = `UOM`;

        const conn = newConnection();
        conn.query(
            `
            SELECT Group_ID, count(ID) Available From Materials
            WHERE (Category in (${category}) or Category IS NULL) 
            and (Sub_Category in (${sub_category}) or Sub_Category IS NULL) 
            and (Size in (${size}) or Size IS NULL) 
            and (Gauge in (${gauge}) or Gauge IS NULL) 
            and (RM_Group in (${rm}) or RM_Group IS NULL) 
            and (Group_ID in (${groupid}) or Group_ID IS NULL)
            and (UOM in (${uom}) or UOM IS NULL)
            Group by Group_ID;
            
            `, (err, rows, fields) => res.send(JSON.stringify(rows))
        );
        conn.end();
    }
})

    app.post('/db/listuom', (req, res, err) => {
        if (Object.keys(req.user).length == 0) res.send(JSON.stringify("Access Denied"));
        if (req.user.customer) res.send(JSON.stringify("No Customers allowed"));
        let filter = req.body.filter;
        let category = makeSqlString(filter.category, true);
        if (filter.category.length == 0) category = `Category`;
        let sub_category = makeSqlString(filter.sub_category, true);
        if (filter.sub_category.length == 0) sub_category = `Sub_Category`;
        let size = makeSqlString(filter.size, false);
        if (filter.size.length == 0) size = `Size`;
        let gauge = makeSqlString(filter.gauge, false);
        if (filter.gauge.length == 0) gauge = `Gauge`;
        let rm = makeSqlString(filter.material, true);
        if (filter.material.length == 0) rm = `RM_Group`;
        let groupid = makeSqlString(filter.groupID, true);
        if (filter.groupID.length == 0) groupid = `Group_ID`;
        let uom = `UOM`;

        const conn = newConnection();
        conn.query(
            `
            SELECT UOM, count(ID) Available From Materials
            WHERE (Category in (${category}) or Category IS NULL) 
            and (Sub_Category in (${sub_category}) or Sub_Category IS NULL) 
            and (Size in (${size}) or Size IS NULL) 
            and (Gauge in (${gauge}) or Gauge IS NULL) 
            and (RM_Group in (${rm}) or RM_Group IS NULL) 
            and (Group_ID in (${groupid}) or Group_ID IS NULL)
            and (UOM in (${uom}) or UOM IS NULL)
            Group by UOM;
            `, (err, rows, fields) => res.send(JSON.stringify(rows))
        );
        conn.end();
})

app.post('/db/breakdown', (req, res, err) => {
    if (Object.keys(req.user).length == 0) res.send(JSON.stringify("Access Denied"));
    else if (req.user.customer) res.send(JSON.stringify("No Customers allowed"));
    else {
        let id = req.body.materialID;
        const conn = newConnection();
        conn.query(
            `
            select * from (
                with recursive receipt(n, FG, FG_txt, Parent, Parent_txt, Child, Child_txt, Qty, UOM, Scrap, Price, Group_ID) as
                (
                    select 0, m.ID, m.Item_Description, m.ID, m.Item_Description, null, null, 1, m.UOM, 0.00, m.Price, m.Group_ID From materials m
                    union all
                    select 1, m.ID, m.Item_Description, m.ID, m.Item_Description, m2.ID, m2.Item_Description, b.Qty, m2.UOM, b.Scrap, m2.Price, m2.Group_ID From Bill_Of_Materials b
                    inner join Materials m on b.Finished_Good = m.ID
                    inner join Materials m2 on b.Child = m2.ID
                    Union all
                    select 1 + n, r.FG, r.FG_Txt, m.ID, m.Item_Description, m2.ID, m2.Item_Description, b.Qty*r.Qty, m2.UOM, b.Scrap, m2.Price, m2.Group_ID From Bill_Of_Materials b
                    inner join Materials m on b.Finished_Good = m.ID
                    inner join Materials m2 on b.Child = m2.ID
                    inner join receipt r on r.Child = m.ID
                ) select * from receipt where FG = ${id}) as breakdown;
            `, (err, rows, fields) => {
                if (err) res.send(JSON.stringify(err))
                else res.send(JSON.stringify(rows));
            }
        );
        conn.end();
    }
})

app.post('/db/orderedsupply', (req, res, err) => {
    if (Object.keys(req.user).length == 0) res.send(JSON.stringify("Access Denied"));
    else if (req.user.customer) res.send(JSON.stringify("No Customers allowed"));
    else {
        let filter = req.body.filter;
        let supplyfilter = req.body.supplyfilter;
        let category = makeSqlString(filter.category, true);
        if (filter.category.length == 0) category = `m.Category`;
        let sub_category = makeSqlString(filter.sub_category, true);
        if (filter.sub_category.length == 0) sub_category = `m.Sub_Category`;
        let size = makeSqlString(filter.size, false);
        if (filter.size.length == 0) size = `m.Size`;
        let gauge = makeSqlString(filter.gauge, false);
        if (filter.gauge.length == 0) gauge = `m.Gauge`;
        let rm = makeSqlString(filter.material, true);
        if (filter.material.length == 0) rm = `m.RM_Group`;
        let groupid = makeSqlString(filter.groupID, true);
        if (filter.groupID.length == 0) groupid = `m.Group_ID`;
        let uom = makeSqlString(filter.uom, true);
        if (filter.uom.length == 0) uom = `m.UOM`;
        let ordered_by = makeSqlString(supplyfilter.ordered_by, false)
        if (supplyfilter.ordered_by.length == 0) ordered_by = `s.Ordered_By`;

        const conn = newConnection();
        conn.query(
            `
            SELECT s.ID, m.Item_Description, s.Qty, s.Cost, s.Status, s.Ordered_By FROM Supply_Orders s
            INNER JOIN Materials m on m.ID = s.Material
            WHERE (s.Ordered_By in (${ordered_by}) or s.Ordered_By IS NULL) and (s.Status = "ORDERED" or s.Status IS NULL) and
            (Category in (${category}) or Category IS NULL) and (Sub_Category in (${sub_category}) or Sub_Category IS NULL) and (Size in (${size}) or Size IS NULL) and (Gauge in (${gauge}) or Gauge IS NULL) and (RM_Group in (${rm}) or RM_Group IS NULL) and (Group_ID in (${groupid}) or Group_ID IS NULL) and (UOM in (${uom}) or UOM IS NULL)
            `, (err, rows, fields) => res.send(JSON.stringify(rows))
        );
        conn.end();
    }
})

app.post('/db/employeelist', (req, res, err) => {
    if (Object.keys(req.user).length == 0) res.send(JSON.stringify("Access Denied"));
    else if (req.user.customer) res.send(JSON.stringify("No Customers allowed"));
    else {
        const conn = newConnection();
        conn.query(
            `
            SELECT * from Employees
            `, (err, rows, fields) => {
                if (err) res.send(JSON.stringify(err))
                else res.send(JSON.stringify(rows));
            }
        );
        conn.end();
    }
})

app.post('/db/vendorlist', (req, res, err) => {
    if (Object.keys(req.user).length == 0) res.send(JSON.stringify("Access Denied"));
    else if (req.user.customer) res.send(JSON.stringify("No Customers allowed"));
    else {
        const conn = newConnection();
        conn.query(
            `
            SELECT * from Vendors
            `, (err, rows, fields) => {
                if (err) res.send(JSON.stringify(err))
                else res.send(JSON.stringify(rows));
            }
        );
        conn.end();
    }
})

app.listen(port, () => console.log(`Server is listening on port ${port}`));
