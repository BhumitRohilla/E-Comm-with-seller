const {insertOne} = require('../db/dbFunction');
const crypt = require('crypto');
const { insertOrderItem } = require('./orderItemFunction');

let collection = 'order';

async function placeOrder(product,userName){
    let {OrderId,paymentKey} = await getOrderId(userName);
    let price = 0;
    let failedItem = [];
    for(key in product){
        try{
            price += await insertOrderItem(OrderId,key,product[key].quantity,userName);
        }
        catch(err){
            failedItem.push(key);
        }
    }
    return {orderId:paymentKey,price,failedItem};
}

async function getOrderId(userName){
    let OrderId = crypt.randomBytes(15).toString('hex');
    let TimeOfPurchase = new Date();
    let PaymentStatus = 0;
    let paymentKey = crypt.randomBytes(20).toString('hex');
    try{
        await insertOne(collection,{userName,OrderId,TimeOfPurchase,PaymentStatus,paymentKey});
    }
    catch(err){
        throw 'Transaction Error';
    }
    return {OrderId,paymentKey};
}

module.exports = {placeOrder};
