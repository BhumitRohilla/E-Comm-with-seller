const dbFunc = require('../db/dbFunction');
const crypto = require('crypto');


const collection = 'users';

// ! Depricated:-
function checkUser(user){
    return dbFunc.findAll(collection,user)
}


function getUser(user){
    return dbFunc.findOne(collection,user);
}


async function insertUser(user){
    let userName = user.userName;
    let email = user.email;
    let oldUser ;
    let oldEmail;
    
    try{
        oldUser  = await getUser({userName});
        oldEmail = await getUser({email});
    }
    catch(err){
        throw err;
    }

    if(oldUser != null){
        throw 401;
    }
    if(oldEmail != null){
        throw 402;
    }
    return dbFunc.insertOne(collection,user);
}


async function updateUser(filter,output){
    return  dbFunc.updateOne(collection,filter,output)
}

function verifyUser(filter){
    return updateUser(filter,{'isVarified':true,'key':null});
}

async function updatePasswordChangeToken(email){
    let passwordChange = crypto.randomBytes(6).toString('hex');
    await  updateUser({email},{passwordChange});
    return passwordChange;
}

async function removePasswordChangeToken(email){
    await updateUser({email},{passwordChange:null});
}

function changePassword(userName,password){
    return updateUser({userName},{password});
}


module.exports = {checkUser,getUser,insertUser,updateUser,verifyUser,updatePasswordChangeToken,changePassword,removePasswordChangeToken};