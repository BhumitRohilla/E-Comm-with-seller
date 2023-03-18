const {findOne} = require('../db/dbFunction');

let collection = 'order';

function getOrderFromOrderId(orderId){
    return findOne(collection,{orderId});
}

module.exports ={getOrderFromOrderId};