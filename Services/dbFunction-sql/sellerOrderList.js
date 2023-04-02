const { newConnectionSQL } = require("../db/dbConnectionSQL");
const { getSingleProduct } = require("./productFunc");

async function getSellerOrder(sellerName){
    let query = `select * from Order_Item where sellerName = '${sellerName}'`;
    let result = await newConnectionSQL(query);
    let length = result.length;
    let order = {};
    for(let i=0;i<length;++i){
        let key =result[i].SubOrderId; 
        order[key] = result[i];
        order[key].product = {};
        if(order[key] == null || order[key].resolve == true){
            delete order[key];
        }else{
            Object.assign(order[key].product,await getSingleProduct(result[i].ProductId));
        }
    }
    return order;
}

module.exports ={getSellerOrder};