const {findAll,findOne, insertOne,updateOne, deleteOne}  = require('../db/dbFunction');
const crypto  = require('crypto');

const { updateProduct, deleteMultipleProduct, getAllProduct } = require('./productFunc');

const collection = 'sellers';

function getAllSellers(){
    //return db.collection('sellers').find({}).toArray(); 
    return findAll(collection,{active:true});
}

function getOneSeller(filter){
    // db.collection(collection).fidOne(filter);
    filter.active = true;
    return findOne(collection,filter);
}

async function createNewSeller(email){
    try{
        if(await findOne(collection,{email}) != null){
            throw new Error("User Already Exists");
        }
        let data ={email};
        data.userId = crypto.randomBytes(4).toString('hex');
        data.userCreateKey = crypto.randomBytes(6).toString('hex');
        data.active = true;
        await insertOne(collection,data);
        return data.userCreateKey;
    }
    catch(err){
        throw err;
    }
}


function updateSeller(filter,data){
    // return db.collection('sellers').updateOne(filter,{$set:data});
    return updateOne(collection,filter,data);
}

async function deleteOneSeller(filter){
    //db.collection().deleteOne((filter))
    await deleteMultipleProduct({sellerName:filter},{'active':false});
    return updateOne(collection,{userName:filter},{'active':false});
}

function createNewSellerFinal(key,data){
        return updateSeller(key,data);
}

async function updatePasswordChangeToken(email){
    let passwordChange = crypto.randomBytes(6).toString('hex');
    await  updateSeller({email},{passwordChange});
    return passwordChange;
}

async function removePasswordChangeToken(email){
    await updateSeller({email},{passwordChange:null});
}

function changePassword(userName,password){
    return updateSeller({userName},{password});
}


function getOneSellerUserNameOnly(userName){
    return findOne(collection,{userName});
}


module.exports = {getAllSellers,getOneSeller,createNewSeller,updateSeller,deleteOneSeller,createNewSellerFinal,updatePasswordChangeToken,removePasswordChangeToken,changePassword,getOneSellerUserNameOnly};