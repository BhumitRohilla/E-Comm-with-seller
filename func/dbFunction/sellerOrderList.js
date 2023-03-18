const {findOne,updateOne,insertOne} = require('../db/dbFunction');
const { getSingleProduct } = require('./productFunc');

const collection = 'sellerOrderList';

async function addOrderSellerList(pid,orderId){
    try{
        let product = await getSingleProduct(pid);
        let sellerId = product.sellerid;
        let data = (await findOne(collection,{sellerId}));
        if(data === null){
            data = {
                sellerId,
                "order":{
                    [orderId]:orderId
                }
            } 
            await insertOne(collection,data);
        }
        else{
            await updateOne(collection,{sellerId},{['order.'+orderId]:orderId});
        }
    }
    catch(er){
    console.log(err);
    throw err;
    }
}



module.exports = {addOrderSellerList};