const mongo = require('../dbFunction/userOrderList');
const sql   = require('../dbFunction-sql/userOrderList');

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