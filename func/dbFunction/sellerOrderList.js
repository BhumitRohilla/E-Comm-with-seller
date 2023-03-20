const {findOne,updateOne,insertOne} = require('../db/dbFunction');
const { getOrderFromOrderId } = require('./orderFunction');
const { getSingleProduct } = require('./productFunc');

const collection = 'sellerOrderList';

async function addOrderSellerList(pid,orderId){
    try{
        let product = await getSingleProduct(pid);
        let sellerId = product.sellerId;
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

async function getSellerOrder(id){
    try{
        let data = await findOne(collection,{sellerId:id});
        if(data == null){
            return null;
        }
        let order = data.order;
        for(key in order){
            order[key] = await getOrderFromOrderId(key);
            console.log(order[key]);
            if(order[key] == null || order[key].resolved == true){
                delete order[key];
            }else{
                Object.assign(order[key].product,await getSingleProduct(order[key].product.productID));
            }
        }
        return order;
    }
    catch(err){
        throw err;
    }
}


module.exports = {addOrderSellerList,getSellerOrder};