const { newConnectionSQL } = require("../db/dbConnectionSQL");
const crypt = require('crypto');

async function placeOrder(product,userName){
    let orderId = await getOrderId(userName);
    orderId = orderId[0][''];
    let failedItem = [];
    for(key in product){
        try{
            let query = `exec insertIntoOrderItem ${orderId},${key},${product[key].quantity},'${userName}'`;
            await newConnectionSQL(query);
        }
        catch(err){
            failedItem.push(key);
        }
    }

    let paymentKey = crypt.randomBytes(20).toString('hex');
    console.log(paymentKey);
    let query = `update Orders set paymentKey = '${paymentKey}' where OrderId = ${orderId}`;
    await newConnectionSQL(query);

    query = `exec getPriceOfOrder ${orderId}`;
    let price = await newConnectionSQL(query);
    return {"orderId":paymentKey,price:price[0][""],failedItem};
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