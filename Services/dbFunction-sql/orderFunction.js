const { newConnectionSQL } = require("../db/dbConnectionSQL");

function rejectOrder(key){
    let query = `update Order_Item set status = 0,resolve=1 where SubOrderId = ${key};`;
    return newConnectionSQL(query);
}

async function paymentSuccess(key){
    let query = `exec paymentSuccess '${key}'`;
    let result = await newConnectionSQL(query);
    return result[0][''];
}

async function paymentFail(key){
    let query = `exec paymentFail '${key}'`;
    let result = await newConnectionSQL(query);
    return  result[0][''];
}

module.exports = {rejectOrder,paymentSuccess,paymentFail};