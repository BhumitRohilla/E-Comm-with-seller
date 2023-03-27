const { newConnectionSQL } = require("../db/dbConnectionSQL");

async function placeOrder(product,userName){
    let orderId = await getOrderId(userName);
    orderId = orderId[0][''];
    for(key in product){
        let query = `insert into Order_Item(sellerName,OrderId,ProductId,quantity,resolve,status,price) values((select sellerName from Product where ProductId = ${key}),${orderId},${key},${product[key].quantity},0,0,0)`; 
        await newConnectionSQL(query);
    }
}


async function getOrderId(userName){
    try{
        let query = `insert into Orders(userName) values(${userName})`;
        return newConnectionSQL(query);   
    }
    catch(err){
        console.log(err);
        throw err;
    }
}

module.exports = {placeOrder};