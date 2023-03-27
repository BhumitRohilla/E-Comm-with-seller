const mongo = require('../dbFunction/sellerOrderList');
const sql   = require('../dbFunction-sql/sellerOrderList');


function getSellerOrder(userName){
    let result;
    if(process.env.USESQL == 'true'){
        result = sql.getSellerOrder(userName);
    }else{
        result = mongo.getSellerOrder(userName);
    }
    return result;
}

module.exports = {getSellerOrder};