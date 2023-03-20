const {findOne, updateOne} = require('../db/dbFunction');

let collection = 'order';

function getOrderFromOrderId(orderId){
    return findOne(collection,{orderId});
}

function rejectOrder(orderId){
    console.log(orderId);
    return updateOne(collection,{orderId},{resolve:true,status:false});
}

module.exports ={getOrderFromOrderId,rejectOrder};