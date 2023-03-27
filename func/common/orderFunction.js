const mongoOrderFunction = require('../dbFunction/orderFunction');
const sqlOrderFunction   = require('../dbFunction-sql/orderFunction')


function rejectOrder(key){
    let result;
    if(process.env.USESQL == 'true'){
        result = sqlOrderFunction.rejectOrder(key);
    }else{
        result = mongoOrderFunction.rejectOrder(key);
    }
    return result;
}


module.exports = {rejectOrder};