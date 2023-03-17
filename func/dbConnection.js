require('dotenv').config();
const {MongoClient} = require('mongodb');

let client = new MongoClient(process.env.MONGO);

async function newConnection(){
    const databaseName = 'e-comm';
    try{
        await client.connect(databaseName);
        console.log('connected');
        return client.db(databaseName);
    }
    catch(err){
        console.log(err);
        return null;
    }
}

async function close(){
    console.log('disconnected');
    try{
        await client.close();
    }
    catch(err){
        console.log(err);
        throw err;
    }
}


module.exports = {newConnection,close};