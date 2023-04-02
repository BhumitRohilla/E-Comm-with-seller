const mongo = require('../dbFunction/orderFunction');
const sql   = require('../dbFunction-sql/orderFunction');

function getUserOrder(userName){
    let result;
    if(process.env.USESQL == 'true'){
        result = sql.getUserOrder(userName);
    }else{
        result = mongo.getUserOrder(userName);
    }
    return result;
}

module.exports = {getUserOrder};