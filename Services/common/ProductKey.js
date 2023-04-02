const mongo = require('../dbFunction/ProductKey');
const sql   = require('../dbFunction-sql/ProductKey')

function insertProductKeys(key,ProductKey){
    let result;
    if(process.env.USESQL == 'true'){
        result = sql.insertProductKeys(key,ProductKey);
    }else{
        result = mongo.insertProductKeys(key,ProductKey);
    }
    return result;
}

module.exports = {insertProductKeys};