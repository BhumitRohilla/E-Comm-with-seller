const {findAll,findOne, insertOne,updateOne}  = require('./dbFunction');
const crypto  = require('crypto');

const collection = 'sellers';

function getAllSellers(db){
    //return db.collection('sellers').find({}).toArray(); 
    return findAll(db,collection,{});
}

function getOneSeller(filter,db){
    // db.collection(collection).fidOne(filter);
    return findOne(db,collection,filter);
}

function createNewSeller(email,userCreateKey,db){
    let data ={email};
    data.id = crypto.randomBytes(4).toString('hex');
    data.userCreateKey = userCreateKey;
    return insertOne(db,collection,data);
}


function updateSeller(filter,data,db){
    // return db.collection('sellers').updateOne(filter,{$set:data});
    return updateOne(db,collection,filter,data);
}

module.exports = {getAllSellers,getOneSeller,createNewSeller,updateSeller};