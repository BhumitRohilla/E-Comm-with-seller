const { newConnectionSQL } = require("../db/dbConnectionSQL");

async function addToCartAndRemoveStock(userName,pid){
    let query = `exec addToCartAndRemoveStock '${userName}',${pid};`;
    try{
        await newConnectionSQL(query);
    }
    catch(err){
        if(err.message == 'Out Of Stock')
            throw 204;
        else
            throw 404;
    }
}

module.exports = {addToCartAndRemoveStock};