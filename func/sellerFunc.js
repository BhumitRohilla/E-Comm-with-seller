const {findAll,findOne, insertOne,updateOne, deleteOne}  = require('./dbFunction');
const crypto  = require('crypto');

const collection = 'sellers';

function getAllSellers(){
    //return db.collection('sellers').find({}).toArray(); 
    return findAll(collection,{});
}

function getOneSeller(filter){
    // db.collection(collection).fidOne(filter);
    return findOne(collection,filter);
}

function createNewSeller(email,userCreateKey){
    let data ={email};
    data.id = crypto.randomBytes(4).toString('hex');
    data.userCreateKey = userCreateKey;
    return insertOne(collection,data);
}


function updateSeller(filter,data){
    // return db.collection('sellers').updateOne(filter,{$set:data});
    return updateOne(collection,filter,data);
}

function deleteOneSeller(filter,db){
    //db.collection().deleteOne((filter))
    return deleteOne(collection,filter);
}


module.exports = {getAllSellers,getOneSeller,createNewSeller,updateSeller,deleteOneSeller};