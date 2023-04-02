const {newConnection,close} = require('./dbConnectionMONGO');


//TODO: LOW PRIORITY using callback function perform all opeartion in one function moreving repeatability
/**
 * function f(callback)
 * let db = await newConnection();
 * try{
 *  result = await callback();
 * }
 * catch(err){
 *  throw err;
 * }
 * close();
 * return result;
*/
async function findAll(collection,filter){
    let db;
    try{
        db =  await newConnection();
    }
    catch(err){
        throw err;
    }
    let result;
    try{
        result = await db.collection(collection).find(filter).toArray();
    }
    catch(err){
        await  close();
        throw err;
    }
    await close();
    return result;
}

async function findOne(collection,filter){
    let db;
    try{
        db =  await newConnection();
    }
    catch(err){
        throw err;
    }
    let result;
    try{
        result = await db.collection(collection).findOne(filter);
    }
    catch(err){
        await close();
        throw err;
    }
    await close();
    return result;
}

async function insertOne(collection,data){
    let db;   
    try{
        db =  await newConnection();
    }
    catch(err){
        throw err;
    }
    let result;
    try{
        result = await db.collection(collection).insertOne(data);
    }
    catch(err){
        await close();
        throw err;
    }
    await close();
    return result;
}

async function updateOne(collection,filter,data){
    let db;
    try{
        db =  await newConnection();
    }
    catch(err){
        throw err;
    }
    let result;
    try{
        result = await db.collection(collection).updateOne(filter,{$set: data });
    }
    catch(err){
        await close();
        throw err;
    }
    await close();
    return result;
}

async function findAllWithSkip(collection,starting,length,filter){
    let db;
    try{
        db =  await newConnection();
    }
    catch(err){
        throw err;
    }
    let result;
    try{
        result = await db.collection(collection).find(filter).skip(starting).limit(length).toArray();
    }
    catch(err){
        await close();
        throw err;
    }
    await close();
    return result;
}

async function updateMany(collection,filter,data){
    let db;
    try{
        db =  await newConnection();
    }
    catch(err){
        throw err;
    }
    let result;
    try{
        result = await db.collection(collection).updateMany(filter,{$set:data});
    }
    catch(err){
        await close();
        throw err;
    }
    await close();
    return result;
}

async function removePropertyFromAll(collection,filter,data){
    let db;
    try{
        db =  await newConnection();
    }
    catch(err){
        throw err;
    }
    let result;
    try{
        result = await db.collection(collection).updateMany(filter,{$unset:data});
    }
    catch(err){
        await close();
        throw err;
    }
    await close();
    return result;
}

async function removeProperty(collection,filter,data){
    let db;
    try{
        db =  await newConnection();
    }
    catch(err){
        throw err;
    }
    let result;
    try{
        result = await db.collection(collection).updateOne(filter,{$unset:data});
    }
    catch(err){
        await close();
        throw err;
    }
    await close();
    return result;
}

async function deleteOne(collection,filter){
    let db;
    try{
        db =  await newConnection();
    }
    catch(err){
        throw err;
    }
    let result;
    try{
        result = await db.collection(collection).deleteOne(filter); ;
    }
    catch(err){
        await close();
        throw err;
    }
    await close();
    return result;
}


async function deleteMany(collection,filter){
    let db;
    try{
        db =  await newConnection();
    }
    catch(err){
        throw err;
    }
    let result;
    try{
        result = await db.collection(collection).deleteMany(filter); ;
    }
    catch(err){
        await close();
        throw err;
    }
    await close();
    return result;
}



module.exports = {findAll,findOne,insertOne,updateOne,findAllWithSkip,updateMany,removePropertyFromAll,deleteOne,removeProperty,deleteMany};