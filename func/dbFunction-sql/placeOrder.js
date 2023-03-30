const { newConnectionSQL } = require("../db/dbConnectionSQL");
const crypt = require('crypto');

async function placeOrder(product,userName){
    let orderId = await getOrderId(userName);
    orderId = orderId[0][''];
    for(key in product){
        console.log(product[key]);
        let query = `exec insertIntoOrderHolder ${orderId},${key},${product[key].quantity},'${userName}'`;
        await newConnectionSQL(query);
    }

    let paymentKey = crypt.randomBytes(20).toString('hex');
    console.log(paymentKey);
    let query = `update Orders set paymentKey = '${paymentKey}' where OrderId = ${orderId}`;
    await newConnectionSQL(query);

    query = `exec getPriceOfOrder ${orderId}`;
    let price = await newConnectionSQL(query);
    return {"orderId":paymentKey,price:price[0][""]};
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