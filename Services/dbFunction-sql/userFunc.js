const { newConnectionSQL } = require("../db/dbConnectionSQL");
const crypto = require('crypto');

async function getUser(user){
    let query;
    if(user.userName){
        query = `select * from users where userName = '${user.userName}' and password = '${user.password}' and role = 'user'`;
    }
    if(user.email){
        query = `select * from users where email = '${user.email}' and role = 'user'`;
    }
    if(user.passwordChange){
        query = `select * from users where passwordChange = '${user.passwordChange}'  and role = 'user'`;
    }
    let result = await newConnectionSQL(query);
    return result[0];
}

async function insertUser(user){
    let query = `insert into users([name],userName,password,email,isVarified,[key],role,active) values('${user.name}','${user.userName}','${user.password}','${user.email}',0,'${user.key}','user',1)`;
    try{
        await newConnectionSQL(query);
    }
    catch(err){
        if(err.number){
            throw 401;
        }else{
            throw 500;
        }
    }
}

async function verifyUser(filter){
    let query = `update users set isVarified = 1,[key] = null where [key] = '${filter.key}'`;
    return newConnectionSQL(query);
}

async function updatePasswordChangeToken(email){
    let passwordChange = crypto.randomBytes(6).toString('hex');
    let query = `update users set passwordChange = '${passwordChange}' where email = '${email}'  and role = 'user'`
    await newConnectionSQL(query);
    return passwordChange;
}

async function removePasswordChangeToken(email){
    let query = `update users set passwordChange = NULL where email = '${email}'`;
    return newConnectionSQL(query);
}


async function changePassword(userName,password){
    let query = `update users set password = '${password}' where userName = '${userName}'  and role = 'user'`;
    return newConnectionSQL(query);
}

module.exports = {getUser,insertUser,verifyUser,updatePasswordChangeToken,removePasswordChangeToken,changePassword};