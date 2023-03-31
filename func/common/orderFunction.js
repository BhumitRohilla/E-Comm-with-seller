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

function paymentSuccess(key){
    let result;
    if(process.env.USESQL == 'true' ){
        result = sqlOrderFunction.paymentSuccess(key);
    }else{
        result = mongoOrderFunction.paymentSuccess(key);
    }
    return result;
}

module.exports = {rejectOrder,paymentSuccess};