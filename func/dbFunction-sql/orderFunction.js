const { newConnectionSQL } = require("../db/dbConnectionSQL");

function rejectOrder(key){
    let query = `update Order_Item set status = 0,resolve=1 where SubOrderId = ${key};`;
    return newConnectionSQL(query);
}

module.exports = {rejectOrder};