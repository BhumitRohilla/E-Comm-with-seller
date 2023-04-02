const mongoUser = require('../dbFunction/userFunc');
const sqlUser = require('../dbFunction-sql/userFunc');

const sqlSeller = require('../dbFunction-sql/sellerFunc');
const mongoSeller = require('../dbFunction/sellerFunc');

function getUser(user){
    let result;
    if(process.env.USESQL == 'true'){
        result=sqlUser.getUser(user);
    }else{
        result=mongoUser.getUser(user);
    }
    return result;
}

function insertUser(user){
    let result;
    if(process.env.USESQL == 'true'){
        result = sqlUser.insertUser(user);
    }else{
        result = mongoUser.insertUser(user);
    }
    return result;
}

function verifyUser(filter){
    let result;
    if(process.env.USESQL == 'true'){
        result = sqlUser.verifyUser(filter);
    }else{
        result = mongoUser.verifyUser(filter);
    }
    return result;
}

function changePassword(userName,password,userType){
    let result;
    if(userType == 'user'){
        if(process.env.USESQL == 'true'){
            result = sqlUser.changePassword(userName,password);
        }else{
            result = mongoUser.changePassword(userName,password);
        }
    }else if(userType === 'seller'){
        if(process.env.USESQL == 'true'){
            result = sqlSeller.changePassword(userName,password);
        }else{
            result = mongoSeller.changePassword(userName,password);
        }
    }
    return result;
}

function updatePasswordChangeToken(email){
    let result;
    if(process.env.USESQL == "true"){
        result = sqlUser.updatePasswordChangeToken(email);
    }else{
        result = mongoUser.updatePasswordChangeToken(email);
    }
    return result;
}

function removePasswordChangeToken(email){
    let result;
    if(process.env.USESQL == 'true'){
        result = sqlUser.removePasswordChangeToken(email);
    }else{
        result = mongoUser.removePasswordChangeToken(email);
    }
    return result;
}

module.exports = {getUser,insertUser,verifyUser,changePassword,updatePasswordChangeToken,removePasswordChangeToken};