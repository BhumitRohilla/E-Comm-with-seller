const { newConnectionSQL } = require("../db/dbConnectionSQL");

function rejectOrder(key){
    let query = `update Order_Item set status = 0,resolve=1 where SubOrderId = ${key};`;
    return newConnectionSQL(query);
}

async function paymentSuccess(key){
    let query = `exec paymentSuccess '${key}'`;
    let result = await newConnectionSQL(query);
    return result[0][''];
}

async function paymentFail(key){
    let query = `exec paymentFail '${key}'`;
    return newConnectionSQL(query);
}

async function getUserOrder(userName){
    let query = `select img,title,c1.* from ( select Order_Item.*,ProductKey from Order_Item left join Product_Key on Order_Item.SubOrderId = Product_Key.SubOrderId ) as c1 join Product on c1.ProductId = Product.ProductId where (c1.OrderId in (select OrderId from Orders where userName = '${userName}' and PaymentStatus = 1) );`;
    let result = await newConnectionSQL(query);
    result.forEach((element)=>{
        if(element.ProductKey!=null)
            element.ProductKey = element.ProductKey.split(',');
    })
        // result.ProductKey = result.ProductKey.split(',');
    return result;
}

async function getSellerOrder(sellerName){
    let query =  `select Order_Item.*,Product.img,Product.title from Order_Item join Product on Product.ProductId = Order_Item.ProductId where Order_Item.sellerName = '${sellerName}' and resolve = 0 and OrderId in (select OrderId from Orders where PaymentStatus = 1);`; 
    return newConnectionSQL(query);
}

async function getSubOrderFromSubOrderId(SubOrderId){
    let query = `select * from Order_Item where SubOrderId = '${SubOrderId}'`;
    let result = await newConnectionSQL(query);
    return result[0];
}

async function resolvePositive(SubOrderId){
    let query = `update Order_Item set resolve = 1, status = 1 where SubOrderId = '${SubOrderId}' ;`;
    return newConnectionSQL(query);
}

module.exports = {rejectOrder,paymentSuccess,paymentFail,getUserOrder,getSellerOrder,getSubOrderFromSubOrderId,resolvePositive};