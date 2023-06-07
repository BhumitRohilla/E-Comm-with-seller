const { newConnectionSQL } = require("./dbConnectionSQL");

async function findAll(collection,filter){
    let filterString  = toStringOfObject(filter);
    let query;
    if(filterString === ''){
        query = `select * from ${collection}`;
    }else{
        query = `select * from ${collection} where ${filterString}`;
    }
    return newConnectionSQL(query);
}

async function findOne(collection,filter){
    let filterString = toStringOfObject(filter);
    let query;
    if(filterString === ''){
        query = `select TOP(1) * from ${collection}`;
    }else{
        query = `select TOP(1) * from ${collection} where ${filterString}`;
    }
    return newConnectionSQL(query);
}


async function insertOne(collection,data){
    let keysToAdd = getKeys(data);
    let valuesToAdd = getData(data);
    let query = `insert into ${collection}${keysToAdd} values${valuesToAdd}`;
    return newConnectionSQL(query);
}

function toStringOfObject(obj){
    let result = '';
    for(key in obj){
        result+=key+" = '" +obj[key]+"' ";
    }
    return result;
}

function getKeys(obj){
    let result = '(';
    for(key in obj){
        result+=key+',';
    }
    result = result.slice(0,-1);
    result+=')';
    return result;
}

function getData(obj){
    let result ='';
    result+='(';
    for(key in obj){
        result+=obj[key]+',';
    }
    result = result.slice(0,-1);
    result+=')';
    return result;
}

module.exports = {findAll,findOne,insertOne};