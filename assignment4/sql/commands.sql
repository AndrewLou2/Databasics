-- Filter using group by and exists

SELECT m.Category, sum(EXISTS(SELECT * FROM Materials m2
WHERE m2.Category in (m2.Category) and m2.Sub_Category in ("Chain") and m2.Size in (m2.Size) and m2.Gauge in (m2.Gauge) and m2.RM_Group in (m2.RM_Group) and m2.Group_ID in (m2.Group_ID) and m2.UOM in (m2.UOM))) as Available FROM Materials m
Where m.Group_ID = "FG"
Group by m.Category;

-- Return top 10 products by order qty
SELECT m.ID, m.Item_Description, SUM(d.Qty) Total_Qty from Demand_Orders d 
INNER JOIN Materials m on d.Material = m.ID
GROUP BY m.ID, m.Item_Description
LIMIT 10

-- Return total weight of rare-metals in stock (weight of chains, rings, wires, etc...)
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

-- Check the availability of resources required to make a material
select m.ID, m.Item_Description, m.Stock in_stock, b.Qty*s.Qty required from supply_orders s
            left join bill_of_materials b on s.Material = b.Finished_Good
            inner join materials m on b.Child
            where b.Qty*s.Qty > m.Stock and s.ID = 1

-- Create supply order
SET @VENDORID=null,@EMPLOYEEID=1,@MATERIAL=1819,@QTY=50;
insert into supply_orders (
	Material
	, Qty
	, Vendor
	, Ordered_By
	, Order_Date
) select
ID
, @QTY
, @VENDORID
, @EMPLOYEEID
, curdate()
from Materials where ID = @MATERIAL;   

-- Approve supply order
UPDATE Supply_Orders 
SET Status="OPEN", 
where ID = 1
and Status="NEW" and (SELECT approve_supply from Employees INNER JOIN User_Rights on User_Rights.ID = Employees.User_Rights where Employees.ID = 1);

-- Produce supply order
UPDATE Supply_Orders as s
INNER JOIN materials m on s.Material = m.ID
SET Status="PRODUCTION"
WHERE s.ID = 1 and Status="OPEN" 
and m.Group_ID <> "RM"
and (SELECT produce_supply FROM Employees 
INNER JOIN User_Rights on User_Rights.ID = Employees.User_Rights WHERE Employees.ID = 1)
and not exists (
    SELECT * FROM bill_of_materials b
    INNER JOIN materials m2 on b.Child
    WHERE b.Qty*s.Qty > m2.Stock and s.Material = b.Finished_Good);