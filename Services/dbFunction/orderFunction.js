const {findOne, updateOne, findAll} = require('../db/dbFunction');
const { getAllOrderItem } = require('./orderItemFunction');
const { getSingleProduct } = require('./productFunc');
const { updateProduct } = require('./productFunc');

const collection = 'order';

function getOrderFromOrderId(orderId){
    return findOne(collection,{orderId});
}


async function paymentSuccess(key){
    let result = await findAll(collection,{paymentKey:key});
    if(result.length > 0){
        await updateOne(collection,{paymentKey:key},{paymentKey:null,PaymentStatus:1})
        return true;
    }
    return false;
}

async function paymentFail(key){
    let result = await findAll(collection,{paymentKey:key});
    if(result.length > 0){
        await restockCancelOrderStock(result[0].OrderId);
        await updateOne(collection,{paymentKey:key},{paymentKey:null,PaymentStatus:-1})
        return true;
    }
    return false;
}

async function restockCancelOrderStock(orderId){
    let OrderItem = await getAllOrderItem(orderId);
    let length = OrderItem.length;
    for(let i=0;i<length;++i){
        let stock = (await getSingleProduct(OrderItem[i].ProductId));
        stock = stock.stock;
        stock += OrderItem[i].quantity;
        await updateProduct(OrderItem[i].ProductId,{stock});
    }
}

async function getUserOrder(userName){
    let allOrderIdOfUser = await findAll(collection,{userName,PaymentStatus:1});
    let length = allOrderIdOfUser.length;
    let orderItems = [];
    for(let i=0;i<length;++i){
        let orderItem = await getAllOrderItem(allOrderIdOfUser[i].OrderId);
        for(let i=0;i<orderItem.length;++i){
            orderItem[i].product = await getSingleProduct(orderItem[i].ProductId);
            orderItems.push(orderItem[i]);
        }
    }
    return orderItems;
}


module.exports ={getOrderFromOrderId,paymentSuccess,paymentFail,getUserOrder};