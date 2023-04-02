const { newConnectionSQL } = require("../db/dbConnectionSQL");

function insertProductKeys(key,ProductKey){
    let query = `insert into Product_Key values('${key}','${ProductKey}')`;
    return newConnectionSQL(query);
}

module.exports = {insertProductKeys};