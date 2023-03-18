const {findOne,updateOne,insertOne} = require('../db/dbFunction');
const { getOrderFromOrderId } = require('./orderFunction');
const { getSingleProduct } = require('./productFunc');


const collection = 'userOrderList';

async function addOrderUserList(userName,orderId){
    let data ;
    try{
        data = await findOne(collection,{userName});
        if(data == null){
            let data = {
                userName,
                "order":{
                    [orderId]:orderId
                }
            }
            await insertOne(collection,data);
        }else{
            await updateOne(collection,{userName},{['order.'+orderId]:orderId});
        }
    }
    catch(err){
        console.log(err);
        throw err;
    }
}

async function getUserOrder(userName){
    let data = await findOne(collection,{userName});
    console.log(data);
    let order = data.order;
    for(key in order){
        order[key] = await getOrderFromOrderId(key);
        console.log(order[key]);
        if(order[key] == null){
           delete order[key];
        }else{
            Object.assign(order[key].product,await getSingleProduct(order[key].product.productID));
        }
    }
    return order;
}

module.exports = {addOrderUserList,getUserOrder};