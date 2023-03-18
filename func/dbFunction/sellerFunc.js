const {findAll,findOne, insertOne,updateOne, deleteOne}  = require('../db/dbFunction');
const crypto  = require('crypto');
const { updateProduct, deleteMultipleProduct } = require('./productFunc');

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
        data.id = crypto.randomBytes(4).toString('hex');
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
    await deleteMultipleProduct({sellerId:filter},{'active':false});
    return updateOne(collection,filter,{'active':false});
}


module.exports = {getAllSellers,getOneSeller,createNewSeller,updateSeller,deleteOneSeller};