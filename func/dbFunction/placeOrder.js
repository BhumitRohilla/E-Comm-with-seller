const {insertOne,findOne} = require('../db/dbFunction');
const crypt = require('crypto');
const {addOrderSellerList} = require('./sellerOrderList');
const { deleteFromCart } = require('./cartFunction');
const {addOrderUserList} = require('./userOrderList');


let collection = 'order';

async function placeOrder(product,userName){
    for(key in product){
        try{
            let orderId = await getOrderId(key,product[key].quantity);
            await addOrderUserList(userName,orderId);
            await addOrderSellerList(key,orderId);
            await deleteFromCart(key,userName);
        }
        catch(err){
            console.log(err);
            throw err;
        }
        
    }
}

async function getOrderId(key,quantity){
    let orderId = crypt.randomBytes(10).toString('hex');
    let obj ={orderId,"product":{"productID":key,quantity},resolve:false,status:null,'ExpectedDate':null,msg:null};
    try{
        
        await insertOne(collection,obj);
        return orderId;
    }
    catch(err){
        console.log(err);
        throw err;
    }
}

module.exports = {placeOrder};