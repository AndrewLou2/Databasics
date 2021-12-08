import React, { useEffect, useState } from "react";

export const EmployeeOrders = () => {
    let user = {user:"admin", password:"root", customer: false, id:1}
    let [dtable, setdTable] = useState([]);
    let [stable, setsTable] = useState([]);
    let [smaterial, setsMaterial] = useState("");
    let [sqty, setsQty] = useState("");
    let [dmaterial, setdMaterial] = useState("");
    let [dqty, setdQty] = useState("");
    let [filter, setFilter] = useState({category:[], sub_category:[], size:[], gauge:[], material:[],groupID:[],uom:[]});
    let [demandfilter, setDemandFilter] = useState({ordered_by:[], customer:[], status:[]});
    let [supplyfilter, setSupplyFilter] = useState({ordered_by:[], vendor:[], status:[]});
    let [materialList, setMaterialList] = useState([]);
    let [receipt, setReceipt] = useState([]);

    let [categories, setCategories] = useState([]);
    let [subcategories, setSubCategories] = useState([]);
    let [sizes, setSizes] = useState([]);
    let [gauges, setGauges] = useState([]);
    let [materials, setMaterials] = useState([]);
    let [groupIDs, setGroupIDs] = useState([]);
    let [uoms, setUOMS] = useState([]);

    useEffect(() => {
        fetch('/db/demandlist', {
            method:'POST',
            body:JSON.stringify({user:user, filter:filter, demandfilter:demandfilter}),
            headers: { 'Content-Type' : 'application/json'}
        })
        .then(res => res.json())
        .then(json => setdTable(json))
        .catch(err => console.log(err));

        fetch('/db/supplylist', {
            method:'POST',
            body:JSON.stringify({user:user, filter:filter, supplyfilter:supplyfilter}),
            headers: { 'Content-Type' : 'application/json'}
        })
        .then(res => res.json())
        .then(json => setsTable(json))
        .catch(err => console.log(err));

        fetch('/db/listcategory', {
            method:'POST',
            body:JSON.stringify({user:user, filter:filter, demandfilter:demandfilter}),
            headers: { 'Content-Type' : 'application/json'}
        })
        .then(res => res.json())
        .then(json => setCategories(json))
        .catch(err => console.log(err));

        fetch('/db/listsubcategory', {
            method:'POST',
            body:JSON.stringify({user:user, filter:filter}),
            headers: { 'Content-Type' : 'application/json'}
        })
        .then(res => res.json())
        .then(json => setSubCategories(json))
        .catch(err => console.log(err));

        fetch('/db/listsize', {
            method:'POST',
            body:JSON.stringify({user:user, filter:filter}),
            headers: { 'Content-Type' : 'application/json'}
        })
        .then(res => res.json())
        .then(json => setSizes(json))
        .catch(err => console.log(err));

        fetch('/db/listgauge', {
            method:'POST',
            body:JSON.stringify({user:user, filter:filter}),
            headers: { 'Content-Type' : 'application/json'}
        })
        .then(res => res.json())
        .then(json => setGauges(json))
        .catch(err => console.log(err));

        fetch('/db/listproductrm', {
            method:'POST',
            body:JSON.stringify({user:user, filter:filter}),
            headers: { 'Content-Type' : 'application/json'}
        })
        .then(res => res.json())
        .then(json => setMaterials(json))
        .catch(err => console.log(err));

        fetch('/db/listgroupids', {
            method:'POST',
            body:JSON.stringify({user:user, filter:filter}),
            headers: { 'Content-Type' : 'application/json'}
        })
        .then(res => res.json())
        .then(json => setGroupIDs(json))
        .catch(err => console.log(err));

        fetch('/db/listuom', {
            method:'POST',
            body:JSON.stringify({user:user, filter:filter}),
            headers: { 'Content-Type' : 'application/json'}
        })
        .then(res => res.json())
        .then(json => setUOMS(json))
        .catch(err => console.log(err));

        fetch('/db/materials', {
            method:'POST',
            body:JSON.stringify({user:user, filter:filter}),
            headers: { 'Content-Type' : 'application/json'}
        })
        .then(res => res.json())
        .then(json => setMaterialList(json))
        .catch(err => console.log(err));
    },[filter]);

    const toggleDemands = (id, status) => {
        if (status == "NEW") {
            fetch('/db/approvedemand', {
                method:'POST',
                body:JSON.stringify({user:user, demandID:id}),
                headers: { 'Content-Type' : 'application/json'}
            })
            .then(res => res.json())
            .then(json => console.log(json))
            .catch(err => console.log(err));
        } else if (status == "OPEN") {
            fetch('/db/stagedemand', {
                method:'POST',
                body:JSON.stringify({user:user, demandID:id}),
                headers: { 'Content-Type' : 'application/json'}
            })
            .then(res => res.json())
            .then(json => console.log(json))
            .catch(err => console.log(err));
        } else if (status === "STAGED") {
            fetch('/db/completedemand', {
                method:'POST',
                body:JSON.stringify({user:user, demandID:id}),
                headers: { 'Content-Type' : 'application/json'}
            })
            .then(res => res.json())
            .then(json => console.log(json))
            .catch(err => console.log(err));
        }
        setFilter(filter);
    }

    const toggleSupply = (id, status, group) => {
        if (status == "NEW") {
            fetch('/db/approvesupply', {
                method:'POST',
                body:JSON.stringify({user:user, supplyID:id}),
                headers: { 'Content-Type' : 'application/json'}
            })
            .then(res => res.json())
            .then(json => console.log(json))
            .catch(err => console.log(err));
        } else if (status == "OPEN") {
            if (group == "RM") {
                fetch('/db/ordersupply', {
                    method:'POST',
                    body:JSON.stringify({user:user, supplyID:id}),
                    headers: { 'Content-Type' : 'application/json'}
                })
                .then(res => res.json())
                .then(json => console.log(json))
                .catch(err => console.log(err));
            } else {
                fetch('/db/producesupply', {
                    method:'POST',
                    body:JSON.stringify({user:user, supplyID:id}),
                    headers: { 'Content-Type' : 'application/json'}
                })
                .then(res => res.json())
                .then(json => console.log(json))
                .catch(err => console.log(err));
            }
        } else if (status == "PRODUCTION" || status == "ORDERED") {
            fetch('/db/completesupply', {
                method:'POST',
                body:JSON.stringify({user:user, supplyID:id}),
                headers: { 'Content-Type' : 'application/json'}
            })
            .then(res => res.json())
            .then(json => console.log(json))
            .catch(err => console.log(err));
        }
    }

    const demandButton = (status) => {
        if (status == "NEW")
            return "APPROVE";
        else if (status == "OPEN") 
            return "STAGE";
        else if (status == "STAGED")
            return "COMPLETE";
        return "COMPLETED";
    }

    const supplyButton = (status, group) => {
        if (status == "NEW")
            return "APPROVE";
        else if (status == "OPEN") {
            if (group == "RM")
                return "ORDER";
            else
                return "PRODUCE";
        }
        else if (status == "PRODUCTION" || status == "ORDERED")
            return "COMPLETE";
        return "COMPLETED";
    }

    const getsMaterial = (e) => {
        setsMaterial(e.target.value);
    }

    const getsQty = (e) => {
        setsQty(e.target.value);
    }

    const getdMaterial = (e) => {
        setdMaterial(e.target.value);
    }

    const getdQty = (e) => {
        setdQty(e.target.value);
    }

    const toggleArray = (arr, val) => {
        let out = [];
        let removed = false;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] == val) {
                removed = true;
            } else {
                out.push(arr[i]);
            }
        }
        if (!removed) {
            out.push(val);
        }
        return out;
    }

    const filterArray = (cat, val) => {
        let out = {...filter};
        switch(cat){
            case 1:
                out.category = toggleArray(out.category, val)
                break;
            case 2:
                out.sub_category = toggleArray(out.sub_category, val)
                break;
            case 3:
                out.size = toggleArray(out.size, val)
                break;
            case 4:
                out.gauge = toggleArray(out.gauge, val)
                break;
            case 5:
                out.groupID = toggleArray(out.groupID, val)
                break;
            case 6:
                out.material = toggleArray(out.material, val)
                break;
            case 7:
                out.uom = toggleArray(out.uom, val)
                break;
        }
        setFilter({...out});
    }

    const findInArray = (arr, val) => {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] == val) return true;
        }
        return false;
    }

    const checkSelected = (cat, val) => {
        let selected = false;
        let out = {...filter};
        switch(cat){
            case 1:
                selected = findInArray(out.category, val)
                break;
            case 2:
                selected = findInArray(out.sub_category, val)
                break;
            case 3:
                selected = findInArray(out.size, val)
                break;
            case 4:
                selected = findInArray(out.gauge, val)
                break;
            case 5:
                selected = findInArray(out.groupID, val)
                break;
            case 6:
                selected = findInArray(out.material, val)
                break;
            case 7:
                selected = findInArray(out.uom, val)
                break;
        }
        return selected;
    }

    const mapFilters = () => {
        return (
            <div style={{display:"table", margin:"auto"}}>
            <div style={{display: "table-row"}}>
            <div style={{display: "table-cell"}}>
                {categories.map(c => 
                <div>{c.Category +": " + c.Available}
                    <input 
                        type="checkbox" checked={checkSelected(1, c.Category)} disabled={c.Available==0} onChange={() => filterArray(1, c.Category)}>
                    </input>
                </div>
                )}
            </div>
            <div style={{display: "table-cell"}}>
                {subcategories.map(c => 
                <div>{c.Sub_Category +": " + c.Available}
                    <input 
                        type="checkbox" checked={checkSelected(2, c.Sub_Category)} disabled={c.Available==0} onChange={() => filterArray(2, c.Sub_Category)}>
                    </input>
                </div>
                )}
            </div>
            <div style={{display: "table-cell"}}>
                {sizes.map(c => 
                <div>{c.Size +": " + c.Available}
                    <input 
                        type="checkbox" checked={checkSelected(3, c.Size)} disabled={c.Available==0} onChange={() => filterArray(3, c.Size)}>
                    </input>
                </div>
                )}
            </div>
            <div style={{display: "table-cell"}}>
                {gauges.map(c => 
                <div>{c.Gauge +": " + c.Available}
                    <input 
                        type="checkbox" checked={checkSelected(4, c.Gauge)} disabled={c.Available==0} onChange={() => filterArray(4, c.Gauge)}>
                    </input>
                </div>
                )}
            </div>
            <div style={{display: "table-cell"}}>
                {groupIDs.map(c => 
                <div>{c.Group_ID +": " + c.Available}
                    <input 
                        type="checkbox" checked={checkSelected(5, c.Group_ID)} disabled={c.Available==0} onChange={() => filterArray(5, c.Group_ID)}>
                    </input>
                </div>
                )}
            </div>
            <div style={{display: "table-cell"}}>
                {materials.map(c => 
                <div>{c.RM_Group +": " + c.Available}
                    <input 
                        type="checkbox" checked={checkSelected(6, c.RM_Group)} disabled={c.Available==0} onChange={() => filterArray(6, c.RM_Group)}>
                    </input>
                </div>
                )}
            </div>
            <div style={{display: "table-cell"}}>
                {uoms.map(c => 
                <div>{c.UOM +": " + c.Available}
                    <input 
                        type="checkbox" checked={checkSelected(7, c.UOM)} disabled={c.Available==0} onChange={() => filterArray(7, c.UOM)}>
                    </input>
                </div>
                )}
            </div>
            </div>
            </div>
        );
    }

    const placeSupplyOrder = () => {
        fetch('/db/createsupply', {
            method:'POST',
            body:JSON.stringify({user:user, materialid:smaterial, qty:sqty}),
            headers: { 'Content-Type' : 'application/json'}
        })
        .then(res => res.json())
        .then(json => console.log(json))
        .catch(err => console.log(err));
    }

    const placeDemandOrder = () => {
        fetch('/db/placeorder', {
            method:'POST',
            body:JSON.stringify({user:user, materialid:dmaterial, qty:dqty}),
            headers: { 'Content-Type' : 'application/json'}
        })
        .then(res => res.json())
        .then(json => console.log(json))
        .catch(err => console.log(err));
    }

    const getItemReceipt = (matID) => {
        fetch('/db/breakdown', {
            method:'POST',
            body:JSON.stringify({user:user, materialID:matID}),
            headers: { 'Content-Type' : 'application/json'}
        })
        .then(res => res.json())
        .then(json => setReceipt(json))
        .catch(err => console.log(err));
        console.log(receipt)
    }

    const mapBreakDown = () => {
        return (
            receipt.map(r =>
                <div style={{border:"5px solid black", zIndex:"50"}}>
                    {
                        r.n + " | "
                        + r.FG + " | "
                        + r.FG_txt + " | "
                        + r.Parent + " | "
                        + r.Parent_txt + " | "
                        + r.Child + " | "
                        + r.Child_txt + " | "
                        + r.Qty + " | "
                        + r.UOM + " | "
                        + r.Scrap + " | "
                        + r.Price + " | "
                        + r.Group_ID 
                    }
                </div>
            )
        );
    }

    return (
        <div>
            <div>
                CREATE SUPPLY ORDER:
                <form onSubmit={() => placeSupplyOrder()}>
                    <input placeholder="Material ID" onChange={(e) => getsMaterial(e)}></input>
                    <input placeholder="Qty" onChange={(e) => getsQty(e)}></input>
                    <input type="submit" value="ORDER"></input>
                </form>
            </div>
            <div>
                CREATE DEMAND ORDER:
                <form onSubmit={() => placeDemandOrder()}>
                    <input placeholder="Material ID" onChange={(e) => getdMaterial(e)}></input>
                    <input placeholder="Qty" onChange={(e) => getdQty(e)}></input>
                    <input type="submit" value="ORDER"></input>
                </form>
            </div>
            DEMAND ORDERS:<br/>
            {dtable.map(d => 
                <div>

                {
                    d.ID + " | " + d.Item_Description + " | " + d.Group_ID + " | -> " + d.Qty + " ($" + d.Price + ") ::: " + d.Status 
                }
                <input type="submit" value={demandButton(d.Status)} disabled={d.Status === "COMPLETE"} onClick={() => toggleDemands(d.ID, d.Status)}>
                </input>
                </div>
            )}
            <br/>
            SUPPLY ORDERS:<br/>
            {stable.map(s => 
                <div>
                
                {
                    s.ID + " | " + s.Item_Description + " | " + s.Group_ID + " | -> " + s.Qty + " (-$" + s.Cost + ") ::: " + s.Status 
                }
                <input type="submit" value={supplyButton(s.Status, s.group)} disabled={s.Status === "COMPLETE"} onClick={() => toggleSupply(s.ID, s.Status, s.Group_ID)}>
                </input>
                </div>
            )}
            FILTERS:
            <button onClick={() => setFilter({category:[], sub_category:[], size:[], gauge:[], material:[],groupID:[],uom:[]})}>RESET</button>
            <br/>
            {
                mapFilters()
            } 
            <br/>
            {receipt.length > 0 &&
                <>BREAKDOWN 
                <button onClick={() => setReceipt([])}>CLEAR</button>
                {
                    mapBreakDown()
                }

                <br/>
                </>
            }
            MATERIALS: <br/>
            {
                materialList.map(r => 
                    <div>{
                        r.ID + " | " 
                        + r.Item_Description + " | " 
                        + r.Group_ID + " | "
                        + r.Category + " | "
                        + r.Sub_Category + " | "
                        + r.Size + " | "
                        + r.Gauge + " | "
                        + r.UOM + " | "
                        + r.RM_Group + " | "
                        + r.Price + " | "
                        + r.Stock + " | "
                        + r.WIP + " | "
                        +r.Staged + " | "
                    }
                    <button onClick={() => getItemReceipt(r.ID)}>BREAKDOWN</button>
                    </div>
                )
            }
        </div>
    );
}