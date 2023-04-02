const { insertOne, findOne } = require("../db/dbFunction");

let collection = 'product_key';

function insertProductKeys(key,ProductKey){
    let productKey = ProductKey.join(',');
    return insertOne(collection,{"SubOrderId":key,'ProductKey':productKey});
}

function getProdutKey(SubOrderId){
    return findOne(collection,{SubOrderId});
}

module.exports = {insertProductKeys,getProdutKey};
