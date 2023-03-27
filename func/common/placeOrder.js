const mongoOrderPlace = require('../dbFunction/placeOrder');
const sqlOrderPlace = require('../dbFunction-sql/placeOrder');

function placeOrder(productQuantity,userName){
    let result;
    if(process.env.USESQL == 'true'){
        result = sqlOrderPlace.placeOrder(productQuantity,userName);
    }else{
        result = mongoOrderPlace.placeOrder(productQuantity,userName);
    }
    return result;
}

module.exports = {placeOrder};