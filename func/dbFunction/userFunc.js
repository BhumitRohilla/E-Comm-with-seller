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
    let oldUser = {userName,email}
    
    try{
        oldUser = await getUser(oldUser);
    }
    catch(err){
        throw err;
    }

    if(oldUser != null){
        throw 401;
    }
    return dbFunc.insertOne(collection,user);
}


async function updateUser(filter,output){
    return  dbFunc.updateOne(collection,filter,output)
}

function verifyUser(filter){
    return updateUser(filter,{'isVarified':true});
}

async function updatePasswordChangeToken(email){
    let passwordChange = crypto.randomBytes(6).toString('hex');
    await  updateUser({email},{passwordChange});
    return passwordChange;
}

async function removePasswordChangeToken(email){
    await updateUser({email},{passwordChange:NULL});
}

module.exports = {checkUser,getUser,insertUser,updateUser,verifyUser,updatePasswordChangeToken};