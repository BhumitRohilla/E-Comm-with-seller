// const mongo = require('../dbFunction/sellerOrderList');
// const sql   = require('../dbFunction-sql/sellerOrderList');
const mongoOrderItem = require('../dbFunction/orderItemFunction');
const sqlOrderItem   = require('../dbFunction-sql/orderFunction');


function getSellerOrder(sellerName){
    let result;
    if(process.env.USESQL == 'true'){
        result = sqlOrderItem.getSellerOrder(sellerName);
    }else{
        result = mongoOrderItem.getSellerOrder(sellerName);
    }
    return result;
}

module.exports = {getSellerOrder};