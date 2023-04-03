const { findOne } = require("../db/dbFunction");

const collection = 'order';

async function isPayed(OrderId){
    let orderObj = await findOne(collection,{OrderId});
    if(orderObj.PaymentStatus == 1){
        return true;
    }else{
        return false;
    }
}

module.exports ={isPayed};