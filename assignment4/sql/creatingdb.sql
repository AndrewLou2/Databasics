
use databasics;

drop table if exists Demand_Orders;
drop table if exists Supply_Orders;
drop table if exists Vendor_Items;
drop table if exists Customers;
drop table if exists Employees;
drop table if exists User_Rights;
drop table if exists Vendors;
drop table if exists Bill_Of_Materials;
drop table if exists Materials;

create table Materials (
	ID int auto_increment
    ,Item_Description varchar(255)
    ,Group_ID varchar(10)
    ,Category varchar(100) default null
    ,Sub_Category varchar(100) default null
    ,Size double default null
    ,Gauge double default null
    ,UOM varchar(10)
    ,RM_Group varchar(255) default null
    ,Price double default null
    -- Inventory Related
    ,Stock double default 500
    ,WIP double default 0
    ,Staged double default 0
    --
    ,PRIMARY KEY (ID)
    ,FOREIGN KEY (RM_Group) REFERENCES Materials(Item_Description)
    ,Unique(Item_Description)
);

create table Bill_Of_Materials (
	Finished_Good int
    ,Child int
    ,Qty double
    ,Scrap double
	,PRIMARY KEY (Finished_Good, Child)
    ,FOREIGN KEY (Finished_Good) REFERENCES Materials(ID)
    ,FOREIGN KEY (Child) REFERENCES Materials(ID)
);

create table User_Rights (
	ID int auto_increment
    ,`description` varchar(255)
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
    ,order_supply bool default false
    ,complete_supply bool default false
    ,PRIMARY KEY (ID)
    ,UNIQUE(`description`)
);

create table Employees (
	ID int auto_increment
    ,`Name` varchar(255)
    ,username varchar(255)
    ,`password` varchar(255)
    ,Salary double
    ,Birthday date
    ,Contact varchar(255)
    ,User_Rights int
    ,PRIMARY KEY (ID)
    ,FOREIGN KEY (User_Rights) REFERENCES User_Rights(ID)
    ,UNIQUE(username)
);

create table Customers (
	ID int auto_increment
    ,`Name` varchar(255)
	,username varchar(255)
    ,`password` varchar(255)
    ,Address varchar(255)
    ,Contact varchar(255)
    ,User_Rights int default 1
    ,PRIMARY KEY (ID)
	,FOREIGN KEY (User_Rights) REFERENCES User_Rights(ID)
    ,UNIQUE(username)
);

create table Vendors (
	ID int auto_increment
	,`Name` varchar(255)
    ,Address varchar(255)
    ,Contact varchar(255)
    ,PRIMARY KEY (ID)
);

create table Vendor_Items (
	Vendor int
    ,Item int
    ,Cost double
    ,PRIMARY KEY (Vendor, Item)
    ,FOREIGN KEY (Vendor) REFERENCES Vendors(ID)
    ,FOREIGN KEY (Item) REFERENCES Materials(ID)
);

create table Supply_Orders (
	ID int auto_increment
	,Material int
    ,Qty double
    ,Cost double default null
	,Vendor int default null
    ,Ordered_By int
    ,Approved_By int default null
    ,`Status` varchar(10) default 'NEW'
    ,Order_Date date
    ,Start_Date date default null
    ,Completion_Date date default null
    ,PRIMARY KEY (ID)
    ,FOREIGN KEY (Ordered_By) REFERENCES Employees(ID)
    ,FOREIGN KEY (Approved_By) REFERENCES Employees(ID)
);

create table Demand_Orders (
	ID int auto_increment
    ,Material int
    ,Qty double
    ,Price double default null
    ,Customer int default null
    ,Order_Date date
    ,Ordered_By int default null
	,Approved_By int default null
    ,`Status` varchar(10) default 'NEW'
    ,Completion_Date date default null
    ,PRIMARY KEY (ID)
    ,FOREIGN KEY (Customer) REFERENCES Customers (ID)
    ,FOREIGN KEY (Ordered_By) REFERENCES Employees (ID)
    ,FOREIGN KEY (Material) REFERENCES Materials (ID)
    ,FOREIGN KEY (Approved_By) REFERENCES Employees (ID)
);
