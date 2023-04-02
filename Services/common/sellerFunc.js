const mongo = require('../dbFunction/sellerFunc');
const sql   = require('../dbFunction-sql/sellerFunc');

function getOneSeller(input){
    let result;
    if(process.env.USESQL == 'true'){
        result = sql.getOneSeller(input);
    }else{
        result = mongo.getOneSeller(input);
    }
    return result;
}

function updatePasswordChangeToken(email){
    let result;
    if(process.env.USESQL == 'true'){
        result = sql.updatePasswordChangeToken(email);
    }else{
        result = mongo.updatePasswordChangeToken(email);
    }
    return result;
}

function removePasswordChangeToken(email){
    let result;
    if(process.env.USESQL == 'true'){
        result = sql.removePasswordChangeToken(email);
    }else{
        result = mongo.removePasswordChangeToken(email);
    }
    return result;
}

function getAllSellers(){
    let result;
    if(process.env.USESQL == 'true' ){
        result = sql.getAllSellers();
    }else{
        result = mongo.getAllSellers();
    }
    return result;
}

function createNewSeller(email){
    let result;
    if(process.env.USESQL == 'true'){
        result = sql.createNewSeller(email)
    }else{
        result = mongo.createNewSeller(email);
    }
    return result;
}

function createNewSellerFinal(key,data,email){
    let result;
    if(process.env.USESQL == 'true' ){
        result = sql.createNewSellerFinal(key,data,email);
    }else{
        result = mongo.createNewSellerFinal(key,data,email);
    }
    return result;
}

function getOneSellerUserNameOnly(userName){
    let result;
    if(process.env.USESQL == 'true'){
        result = sql.getOneSellerUserNameOnly(userName);
    }else{
        result = mongo.getOneSellerUserNameOnly(userName);
    }
    return result;
}

function deleteOneSeller(userName){
    let result;
    if(process.env.USESQL == 'true'){
        result = sql.deleteOneSeller(userName);
    }else{
        result = mongo.deleteOneSeller(userName);
    }
    return result;
}

module.exports = {getOneSeller,updatePasswordChangeToken,removePasswordChangeToken,getAllSellers,createNewSeller,createNewSellerFinal,getOneSellerUserNameOnly,deleteOneSeller};