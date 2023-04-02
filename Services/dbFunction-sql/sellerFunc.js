let crypto = require('crypto');

const { newConnectionSQL } = require("../db/dbConnectionSQL");

const {removePasswordChangeToken} = require("../dbFunction-sql/userFunc");

async function updatePasswordChangeToken(email){
    let passwordChange = crypto.randomBytes(6).toString('hex');
    let query = `update users set passwordChange = '${passwordChange}' where email = '${email}' and role = 'seller' `;
    await newConnectionSQL(query);
    return passwordChange;
}

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
    let result = await newConnectionSQL(query);
    return result[0];
}

function changePassword(userName,password){
    let query = `update Users set password = '${password}' where userName = '${userName}'`;
    return newConnectionSQL(query);
}

async function createNewSellerFinal(key,data,email){
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
    return key;
}


module.exports = {getOneSeller,updatePasswordChangeToken,removePasswordChangeToken,getAllSellers,getOneSellerUserNameOnly,deleteOneSeller,createNewSeller,createNewSellerFinal,changePassword};