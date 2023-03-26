const mongo = require('../dbFunction/userFunc');
const sql = require('../dbFunction-sql/userFunc');

function getUser({userName,password}){
    let result;
    if(process.env.USESQL == 'true'){
        result=sql.getUser({userName,password});
    }else{
        result=mongo.getUser({userName,password});
    }
    return result;
}

function insertUser(user){
    let result;
    if(process.env.USESQL == 'true'){
        result = sql.insertUser(user);
    }else{
        result = mongo.insertUser(user);
    }
    return result;
}

function verifyUser(filter){
    let result;
    if(process.env.USESQL == 'true'){
        result = sql.verifyUser(filter);
    }else{
        result = mongo.verifyUser(filter);
    }
    return result;
}

function changePassword(userName,password){
    let result;
    if(process.env.USESQL == 'true'){
        result = sql.changePassword(userName,password);
    }else{
        result = mongo.changePassword(userName,password);
    }
    return result;
}

function updatePasswordChangeToken(email){
    let result;
    if(process.env.USESQL = "true"){
        result = sql.updatePasswordChangeToken(email);
    }else{
        result = mongo.updatePasswordChangeToken(email);
    }
    return result;
}

module.exports = {getUser,insertUser,verifyUser,changePassword,updatePasswordChangeToken};