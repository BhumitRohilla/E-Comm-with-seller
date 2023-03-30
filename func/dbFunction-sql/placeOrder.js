const { newConnectionSQL } = require("../db/dbConnectionSQL");

async function placeOrder(product,userName){
    let orderId = await getOrderId(userName);
    orderId = orderId[0][''];
    // let query = 'begin transaction';
    // query += `begin try`;
    // query += `insert into Order_Item(sellerName,OrderId,ProductId,quantity,resolve,status,price) values`;
    for(key in product){
        // query += `((select sellerName from Product where ProductId = ${key}),${orderId},${key},${product[key].quantity},0,0,0),`; 
        console.log(product[key]);
        let query = `exec insertIntoOrderHolder ${orderId},${key},${product[key].quantity},'${userName}'`;
        await newConnectionSQL(query);
    }
    // query = query.substring(0,query.length-1);
    // query += `DeleteCartForSpecificUser ${userName}`;
    // query += `commit`;
}


async function getOrderId(userName){
    try{
        let query = `insert into Orders(userName) values('${userName}')`;
        return newConnectionSQL(query);   
    }
    catch(err){
        console.log(err);
        throw err;
        
    }
}

module.exports = {placeOrder};