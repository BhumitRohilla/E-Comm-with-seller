const { newConnectionSQL } = require("../db/dbConnectionSQL");
const crypto = require('crypto');

async function getUser(user){
    let query;
    if(user.userName){
        query = `select * from users where userName = '${user.userName}' and password = '${user.password}'`;
    }
    if(user.email){
        query = `select * from users where email = '${user.email}'`;
    }
    if(user.passwordChange){
        query = `select * from users where passwordChange = '${user.passwordChange}'`;
    }
    console.log(query);
    let result = await newConnectionSQL(query);
    console.log(result);
    return result[0];
}

async function insertUser(user){
    console.log(user);
    let query = `insert into users([name],userName,password,email,isVarified,[key]) values('${user.name}','${user.userName}','${user.password}','${user.email}',${(user.isVarified)===true?1:0},'${user.key}')`;
    try{
        await newConnectionSQL(query);
    }
    catch(err){
        console.log(err);
        if(err.number){
            throw 401;
        }else{
            throw 500;
        }
    }
}

async function verifyUser(filter){
    let query = `update users set isVarified = 1 where [key] = '${filter.key}'`;
    return newConnectionSQL(query);
}

async function updatePasswordChangeToken(email){
    let passwordChange = crypto.randomBytes(6).toString('hex');
    let query = `update users set passwordChange = '${passwordChange}' where email = '${email}'`
    await newConnectionSQL(query);
    return passwordChange;
}

async function removePasswordChangeToken(email){
    let query = `update users set passwordChange = NULL where email = '${email}'`;
    return newConnectionSQL(query);
}

module.exports = {getUser,insertUser,verifyUser,updatePasswordChangeToken,removePasswordChangeToken};