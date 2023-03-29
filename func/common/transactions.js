const mongo = require('../dbFunction/transactions');
const sql   = require('../dbFunction-sql/transactions');

function addToCartAndRemoveStock(userName,pid){
    let result;
    if(process.env.USESQL == 'true'){
        result = sql.addToCartAndRemoveStock(userName,pid)
    }else{
        result = mongo.addToCartAndRemoveStock(userName,pid);
    }
    return result;
}

module.exports = {addToCartAndRemoveStock};