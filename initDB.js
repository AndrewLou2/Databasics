const newConnection = require("./connectDB");
const conn = newConnection();


conn.query(
    `
    drop table if exists Demand_Orders;
    `
);
conn.query(
    `
    drop table if exists Supply_Orders;
    `
);
conn.query(
    `
    drop table if exists Vendor_Items;
    `
);
conn.query(
    `
    drop table if exists Customers;
    `
);
conn.query(
    `
    drop table if exists Employees;
    `
);
conn.query(
    `
    drop table if exists User_Rights;
    `
);
conn.query(
    `
    drop table if exists Vendors;
    `
);
conn.query(
    `
    drop table if exists Bill_Of_Materials;
    `
);
conn.query(
    `
    drop table if exists Materials;
    `
);

conn.query(
    `
    create table Materials (
        ID int auto_increment
        ,Item_Description varchar(255)
        ,Group_ID varchar(10)
        ,Category varchar(100) default null
        ,Sub_Category varchar(100) default null
        ,Size double default null
        ,UOM varchar(10)
        ,RM_Group varchar(255) default null
        ,Price double default null
        ,Stock double default 500
        ,WIP double default 0
        ,Staged double default 0
        ,PRIMARY KEY (ID)
        ,FOREIGN KEY (RM_Group) REFERENCES Materials(Item_Description)
        ,Unique(Item_Description)
    );
    `, (err) => {
        if (err) 
            console.log(err);
        else 
            console.log("Materials Table Created!");
    }
);

conn.query(
    `
    create table Bill_Of_Materials (
        Finished_Good int
        ,Child int
        ,Qty double
        ,Scrap double
        ,PRIMARY KEY (Finished_Good, Child)
        ,FOREIGN KEY (Finished_Good) REFERENCES Materials(ID)
        ,FOREIGN KEY (Child) REFERENCES Materials(ID)
    );
    `, (err) => {
        if (err) 
            console.log(err);
        else 
            console.log("BOM Table Created!");
    }
);

conn.query(
    `
    create table User_Rights (
        ID int auto_increment
        ,description varchar(255)
        ,customer bool default true
        ,create_demand bool default false
        ,approve_demand bool default false
        ,approve_supply bool default false
        ,create_supply bool default false
        ,view_inventory bool default false
        ,create_material bool default false
        ,view_bom bool default false
        ,create_employee bool default false
        ,stage_demand bool default false
        ,complete_demand bool default false
        ,produce_supply bool default false
        ,complete_supply bool default false
        ,PRIMARY KEY (ID)
        ,UNIQUE(description)
    );
    `, (err) => {
        if (err) 
            console.log(err);
        else 
            console.log("User Rights Table Created!");
    }
);

conn.query(
    `
    create table Employees (
        ID int auto_increment
        ,Name varchar(255)
        ,username varchar(255)
        ,password varchar(255)
        ,Salary double
        ,Birthday date
        ,Contact varchar(255)
        ,User_Rights int
        ,PRIMARY KEY (ID)
        ,FOREIGN KEY (User_Rights) REFERENCES User_Rights(ID)
        ,UNIQUE(username)
    );
    `, (err) => {
        if (err) 
            console.log(err);
        else 
            console.log("Employees Table Created!");
    }
);

conn.query(
    `
    create table Customers (
        ID int auto_increment
        ,Name varchar(255)
        ,username varchar(255)
        ,password varchar(255)
        ,Address varchar(255)
        ,Contact varchar(255)
        ,User_Rights int default 1
        ,PRIMARY KEY (ID)
        ,FOREIGN KEY (User_Rights) REFERENCES User_Rights(ID)
        ,UNIQUE(username)
    );
    `, (err) => {
        if (err) 
            console.log(err);
        else 
            console.log("Customers Table Created!");
    }
);

conn.query(
    `
    create table Vendors (
        ID int auto_increment
        ,Name varchar(255)
        ,Address varchar(255)
        ,Contact varchar(255)
        ,PRIMARY KEY (ID)
    );
    `, (err) => {
        if (err) 
            console.log(err);
        else 
            console.log("Vendors Table Created!");
    }
);

conn.query(
    `
    create table Vendor_Items (
        Vendor int
        ,Item int
        ,Cost double
        ,PRIMARY KEY (Vendor, Item)
        ,FOREIGN KEY (Vendor) REFERENCES Vendors(ID)
        ,FOREIGN KEY (Item) REFERENCES Materials(ID)
    );
    `, (err) => {
        if (err) 
            console.log(err);
        else 
            console.log("Vendor_Items Table Created!");
    }
);

conn.query(
    `
    create table Supply_Orders (
        ID int auto_increment
        ,Material int
        ,Qty double
        ,Cost double default null
        ,Vendor int default null
        ,Ordered_By int
        ,Approved_By int default null
        ,Status varchar(10) default 'NEW'
        ,Order_Date date
        ,Start_Date date default null
        ,Completion_Date date default null
        ,PRIMARY KEY (ID)
        ,FOREIGN KEY (Ordered_By) REFERENCES Employees(ID)
        ,FOREIGN KEY (Approved_By) REFERENCES Employees(ID)
    );
    `, (err) => {
        if (err) 
            console.log(err);
        else 
            console.log("Supply_Orders Table Created!");
    }
);

conn.query(
    `
    create table Demand_Orders (
        ID int auto_increment
        ,Material int
        ,Qty double
        ,Price double default null
        ,Customer int default null
        ,Order_Date date
        ,Ordered_By int default null
        ,Approved_By int default null
        ,Status varchar(10) default 'NEW'
        ,Completion_Date date default null
        ,PRIMARY KEY (ID)
        ,FOREIGN KEY (Customer) REFERENCES Customers (ID)
        ,FOREIGN KEY (Ordered_By) REFERENCES Employees (ID)
        ,FOREIGN KEY (Material) REFERENCES Materials (ID)
        ,FOREIGN KEY (Approved_By) REFERENCES Employees (ID)
    );
    `, (err) => {
        if (err) 
            console.log(err);
        else 
            console.log("Demand_Orders Table Created!");
    }
);

conn.query(
    `
    create table wire_gauges (gauge varchar(255));
    `, (err) => {
        if (err) 
            console.log(err);
        else 
            console.log("wire_gauges Table Created!");
    }
);

conn.query(
    `
    create table ring_sizes (size varchar(255));
    `, (err) => {
        if (err) 
            console.log(err);
        else 
            console.log("ring_sizes Table Created!");
    }
);

conn.query(
    `
    create table chain_types (cType varchar(255));
    `, (err) => {
        if (err) 
            console.log(err);
        else 
            console.log("chain_types Table Created!");
    }
);

conn.query(
    `
    create table chain_lengths (len double);
    `, (err) => {
        if (err) 
            console.log(err);
        else 
            console.log("chain_lengths Table Created!");
    }
);

conn.query(
    `
    insert into Materials (Item_Description, Group_ID, Category, Sub_Category, Size, UOM, RM_Group) values 
    ("Sterling Silver", "RM", "Metal", "Silver", 1, "g", "Sterling Silver")
    , ("Mexican Silver", "RM", "Metal", "Silver", 1, "g", "Mexican Silver")
    , ("Silver", "RM", "Metal", "Silver", 1, "g", "Silver")
    , ("Palladium", "RM", "Metal", "Palladium", 1, "g", "Palladium")
    , ("Rhodium", "RM", "Metal", "Rhodium", 1, "g", "Rhodium")
    , ("Platinum", "RM", "Metal", "Platinum", 1, "g", "Platinum")
    , ("14K Rose Gold", "RM", "Metal", "Rose Gold", 1, "g", "14K Rose Gold")
    , ("18K Rose Gold", "RM", "Metal", "Rose Gold", 1, "g", "18K Rose Gold")
    , ("14K Nickel White Gold", "RM", "Metal", "White Gold", 1, "g", "14K Nickel White Gold")
    , ("14K Palladium White Gold", "RM", "Metal", "White Gold", 1, "g", "14K Palladium White Gold")
    , ("18K Palladium White Gold", "RM", "Metal", "White Gold", 1, "g", "18K Palladium White Gold")
    , ("14K Yellow Gold", "RM", "Metal", "Yellow Gold", 1, "g", "14K Yellow Gold")
    , ("18K Yellow Gold", "RM", "Metal", "Yellow Gold", 1, "g", "18K Yellow Gold")
    , ("22K Yellow Gold", "RM", "Metal", "Yellow Gold", 1, "g", "22K Yellow Gold");
    `, (err) => {
        if (err) 
            console.log(err);
    }
);

conn.query(
    `
    insert into wire_gauges (gauge) values 
    ("24 gauge")
    , ("22 gauge")
    , ("21 gauge")
    , ("20 gauge")
    , ("18 gauge")
    , ("16 gauge")
    , ("14 gauge")
    , ("12 gauge")
    , ("10 gauge");
    `, (err) => {
        if (err) 
            console.log(err);
    }
);

conn.query(
    `
    insert into Materials (Item_Description, Group_ID, Category, Sub_Category, Size, UOM, RM_Group)
    select concat(g.gauge, " ", m.Item_Description, " wire")
    , "WIP"
    , "Wire"
    , g.gauge
    , ROUND(CAST(LEFT(g.gauge, 2) as DECIMAL),2)
    , "m"
    , m.RM_Group 
    from Materials m
    join wire_gauges g on 1
    where m.Group_ID = "RM";
    `, (err) => {
        if (err) 
            console.log(err);
    }
);

conn.query(
    `
    insert into Bill_Of_Materials (Finished_Good, Child, Qty, Scrap)
    select 
    m.ID
    , c.ID
    , ROUND(1000 / POWER(CAST(LEFT(m.Item_Description, 2) as DECIMAL),2),2)
    , 0
    from Materials m
    inner join Materials c on m.RM_Group = c.Item_Description
    where m.Group_ID = "WIP"; 
    `, (err) => {
        if (err) 
            console.log(err);
    }
);

conn.query(
    `
    insert into ring_sizes(size) values 
    ("3")
    , ("3.5")
    , ("4")
    , ("4.5")
    , ("5")
    , ("5.5")
    , ("6")
    , ("6.5")
    , ("7")
    , ("7.5")
    , ("8")
    , ("8.5")
    , ("9")
    , ("9.5")
    , ("10")
    , ("10.5")
    , ("11")
    , ("11.5")
    , ("12")
    , ("12.5")
    , ("13")
    , ("13.5");
    `, (err) => {
        if (err) 
            console.log(err);
    }
);

conn.query(
    `
    insert into Materials (Item_Description, Group_ID, Category, Sub_Category, Size, UOM, RM_Group, Price)
    select concat("Ring ", LEFT(m.Item_Description,LENGTH(m.Item_Description)-5), " Size: ", r.size)
    , "FG"
    , "Ring"
    , m.RM_Group
    , CAST(r.size as DECIMAL)
    , "EA"
    , m.RM_Group
    , ROUND(CAST(if(LEFT(m.RM_Group, 2) REGEXP '[0-9]', LEFT(m.RM_Group, 2), 12.00) as DECIMAL) / 24.00 * 500.00 * POWER(r.size / 15, 0.5) * POWER(10/LEFT(m.Item_Description, 2), 0.5), 2)
    from Materials m
    join ring_sizes r on LEFT(m.Item_Description, 2) < 15
    where m.Group_ID = "WIP";
    `, (err) => {
        if (err) 
            console.log(err);
    }
);

conn.query(
    `
    insert into Bill_Of_Materials (Finished_Good, Child, Qty, Scrap)
    select 
    m.ID
    , c.ID
    , ROUND(0.05 * CAST(RIGHT(RIGHT(m.Item_Description, 4), 4 - POSITION(" " IN RIGHT(m.Item_Description, 4))) as DECIMAL),2)
    , 0.3
    from Materials m
    inner join Materials c on m.RM_Group = c.RM_Group and RIGHT(LEFT(m.Item_Description, 7),2) = LEFT(c.Item_Description,2)
    where m.Group_ID = "FG" and c.Group_ID = "WIP"; 
    `, (err) => {
        if (err) 
            console.log(err);
    }
);

conn.query(
    `
    insert into chain_types(cType) values 
    ("Figaro")
    , ("Box")
    , ("Rope")
    , ("Cuban Link")
    , ("Herringbone")
    , ("Double Rope")
    , ("Cable")
    , ("Snake");
    `, (err) => {
        if (err) 
            console.log(err);
    }
);

conn.query(
    `
    insert into Materials (Item_Description, Group_ID, Category, Sub_Category, Size, UOM, RM_Group)
    select concat(LEFT(m.Item_Description,LENGTH(m.Item_Description)-5), " ", c.cType, " Chain")
    , "WIP"
    , "RAW Chain"
    , c.cType
    , CAST(LEFT(m.Item_Description, 2) as DECIMAL)
    , "m"
    , m.RM_Group 
    from Materials m
    join chain_types c on LEFT(m.Item_Description, 2) > 15
    where m.Group_ID = "WIP" and RIGHT(m.Item_Description, 4) = "wire";
    `, (err) => {
        if (err) 
            console.log(err);
    }
);

conn.query(
    `
    insert into Bill_Of_Materials (Finished_Good, Child, Qty, Scrap)
    select 
    m.ID
    , c.ID
    , ROUND(LENGTH(m.Item_Description) / 10, 2)
    , 0.25
    from Materials m
    inner join Materials c on LEFT(m.Item_Description, LENGTH(c.Item_Description) - 5) = LEFT(c.Item_Description, LENGTH(c.Item_Description)-5)
    where m.Group_ID = "WIP" and c.Group_ID = "WIP" and m.ID <> c.ID; 
    `, (err) => {
        if (err) 
            console.log(err);
    }
);

conn.query(
    `
    insert into chain_lengths(len) values 
    (16)
    , (18)
    , (20)
    , (22)
    , (24);
    `, (err) => {
        if (err) 
            console.log(err);
    }
);

conn.query(
    `
    insert into Materials (Item_Description, Group_ID, Category, Sub_Category, Size, UOM, RM_Group, Price)
    select concat(c.len, '" ', m.Item_Description)
    , "FG"
    , "Chain"
    , m.Sub_Category
    , c.len
    , "EA"
    , m.RM_Group 
    , ROUND(CAST(if(LEFT(m.RM_Group, 2) REGEXP '[0-9]',LEFT(m.RM_Group, 2),12) as DECIMAL) / 24.00 * c.len * 50 * POWER(10/LEFT(m.Item_Description,2), 0.5), 2)
    from Materials m
    join chain_lengths c on RIGHT(m.Item_Description, 5) = "Chain"
    where m.Group_ID = "WIP";
    `, (err) => {
        if (err) 
            console.log(err);
    }
);

conn.query(
    `
    insert into Bill_Of_Materials (Finished_Good, Child, Qty, Scrap)
    select 
    m.ID
    , c.ID
    , ROUND(3 * CAST(LEFT(m.Item_Description, 2) as DECIMAL) / 100, 2)
    , 0.2
    from Materials m
    inner join Materials c on RIGHT(m.Item_Description, LENGTH(m.Item_Description) - 4) = c.Item_Description and c.Group_ID = "WIP"
    where m.Group_ID = "FG" and RIGHT(m.Item_Description, 5) = "Chain"; 
    `, (err) => {
        if (err) 
            console.log(err);
    }
);

conn.query(
    `
    insert into Materials (Item_Description, Group_ID, Category, UOM, RM_Group)
    select concat(m.Item_Description, " clasp")
    , "WIP"
    , "Clasp"
    , "EA"
    , m.RM_Group 
    from Materials m
    where m.Group_ID = "RM";
    `, (err) => {
        if (err) 
            console.log(err);
    }
);

conn.query(
    `
    insert into Bill_Of_Materials (Finished_Good, Child, Qty, Scrap) 
    select
    m.ID
    , c.ID
    , 0.5
    , 0.01
    from Materials m 
    inner join Materials c on c.Item_Description = m.RM_Group
    where RIGHT(m.Item_Description, 5) = "clasp";
    `, (err) => {
        if (err) 
            console.log(err);
    }
);

conn.query(
    `
    insert into Bill_Of_Materials (Finished_Good, Child, Qty, Scrap)
    select
    m.ID
    , c.ID
    , 1 
    , 0
    from Materials m
    inner join Materials c on c.RM_Group = m.RM_Group and RIGHT(c.Item_Description, 5) = "clasp"
    where m.Group_ID = "FG" and RIGHT(LEFT(m.Item_Description, 3), 1) = '"';
    `, (err) => {
        if (err) 
            console.log(err);
    }
);

conn.query(
    `
    insert into Materials (Item_Description, Group_ID, Category, Sub_Category, Size, UOM) values ("Machining Oil", "RM", "Manufacturing", "Oil", 1, "L");
    `, (err) => {
        if (err) 
            console.log(err);
    }
);

conn.query(
    `
    insert into Bill_Of_Materials (Finished_Good, Child, Qty, Scrap) 
    select
    m.ID
    , c.ID
    , 0.01
    , 0
    from Materials m 
    join Materials c on c.Item_Description = "Machining Oil"
    where RIGHT(m.Item_Description, 4) = "wire";
    `, (err) => {
        if (err) 
            console.log(err);
    }
);

conn.query(
    `
    insert into Materials (Item_Description, Group_ID, Category, Sub_Category, Size, UOM) values ("Grit Polish", "RM", "Manufacturing", "Polish", 1, "L");
    `, (err) => {
        if (err) 
            console.log(err);
    }
);

conn.query(
    `
    insert into Bill_Of_Materials (Finished_Good, Child, Qty, Scrap) 
    select
    m.ID
    , c.ID
    , 0.02
    , 0.1
    from Materials m 
    join Materials c on c.Item_Description = "Grit Polish"
    where RIGHT(m.Item_Description, 5) = "Chain" and m.Group_ID = "WIP";
    `, (err) => {
        if (err) 
            console.log(err);
    }
);

conn.query(
    `
    insert into Materials (Item_Description, Group_ID, Category, Sub_Category, Size, UOM) values ("Fine Polish", "RM", "Manufacturing", "Polish", 1, "L");
    `, (err) => {
        if (err) 
            console.log(err);
    }
);

conn.query(
    `
    insert into Bill_Of_Materials (Finished_Good, Child, Qty, Scrap) 
    select
    m.ID
    , c.ID
    , 0.005
    , 0.02
    from Materials m 
    join Materials c on c.Item_Description = "Fine Polish"
    where RIGHT(m.Item_Description, 5) = "Chain" and m.Group_ID = "FG";
    `, (err) => {
        if (err) 
            console.log(err);
    }
);

conn.query(
    `
    drop table IF EXISTS wire_gauges;
    `, (err) => {
        if (err) 
            console.log(err);
        else 
            console.log("wire_gauges dropped!")
    }
);

conn.query(
    `
    drop table IF EXISTS ring_sizes;
    `, (err) => {
        if (err) 
            console.log(err);
        else 
            console.log("ring_sizes dropped!")
    }
);

conn.query(
    `
    drop table IF EXISTS chain_types;
    `, (err) => {
        if (err) 
            console.log(err);
        else 
            console.log("chain_types dropped!")
    }
);

conn.query(
    `
    drop table IF EXISTS chain_lengths;
    `, (err) => {
        if (err) 
            console.log(err);
        else 
            console.log("chain_lengths dropped!")
    }
);


conn.end();