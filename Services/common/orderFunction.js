const mongoOrderFunction = require('../dbFunction/orderFunction');
const sqlOrderFunction   = require('../dbFunction-sql/orderFunction')
const mongoOrderItemFunction = require('../dbFunction/orderItemFunction');


function getSubOrderFromSubOrderId(SubOrderId){
    let result;
    if(process.env.USESQL == 'true' ){
        result = sqlProduct.getSubOrderFromSubOrderId(SubOrderId);
    }else{
        result = mongoOrderItemFunction.getSubOrderFromSubOrderId(SubOrderId);
    }
    return result;
}


function rejectOrder(key){
    let result;
    if(process.env.USESQL == 'true'){
        result = sqlOrderFunction.rejectOrder(key);
    }else{
        result = mongoOrderItemFunction.rejectOrder(key);
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

function paymentFail(key){
    let result;
    if(process.env.USESQL == 'true' ){
        result = sqlOrderFunction.paymentFail(key);
    }else{
        result = mongoOrderFunction.paymentFail(key);
    }
    return result;
}

module.exports = {rejectOrder,paymentSuccess,paymentFail,getSubOrderFromSubOrderId};