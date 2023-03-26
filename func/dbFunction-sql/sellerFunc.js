let crypto = require('crypto');

const { newConnectionSQL } = require("../db/dbConnectionSQL");

const {updatePasswordChangeToken,removePasswordChangeToken} = require("../dbFunction-sql/userFunc");


async function getOneSeller(user){
    let query;
    if(user.userName){
        query = `select * from users where userName = '${user.userName}' and password = '${user.password}' and role='seller'`;
    }
    if(user.email){
        query = `select * from users where email = '${user.email}' and role='seller'`;
    }
    if(user.passwordChange){
        query = `select * from users where passwordChange = '${user.passwordChange}' and role='seller'`;
    }
    if(user.userCreateKey){
        query = `select * from SellerToCreate where userCreation = '${user.userCreateKey}'`;
    }
    console.log(query);
    let result = await newConnectionSQL(query);
    console.log(result);
    return result[0];
}

async function createNewSellerFinal(key,data,email){
    console.log(data);
    let query = `exec createNewSellerFinal '${data.userName}','${data.password}','${email}','${data.name}'`
    return newConnectionSQL(query);
}

async function getAllSellers(){
    // let query = `select * from dbo.getAllProduct()`;
    let query = `select * from users where role = 'seller' and active = '1'`;
    let result = await newConnectionSQL(query);
    return result;
}

async function getOneSellerUserNameOnly(userName){
    let query = `select * from users where userName = '${userName}' and role = 'seller'`;
    let result = await newConnectionSQL(query);
    return result[0];
}

async function deleteOneSeller(userName){
    let query = `exec deactivateSeller '${userName}'`;
    await newConnectionSQL(query);
}

async function createNewSeller(email){
    let key = crypto.randomBytes(8).toString('hex');
    let query = `exec createNewSeller '${email}','${key}'`;
    let result ;
    try{
        result = await newConnectionSQL(query);
    }
    catch(err){
        throw err;
    }
    console.log(result);
    return key;
}



module.exports = {getOneSeller,updatePasswordChangeToken,removePasswordChangeToken,getAllSellers,getOneSellerUserNameOnly,deleteOneSeller,createNewSeller,createNewSellerFinal};