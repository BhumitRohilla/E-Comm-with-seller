const  crypto = require('crypto');

const { insertOne, findAll, updateOne, findOne } = require("../db/dbFunction");
const { deleteFromCart } = require("./cartFunction");
const { getSingleProduct } = require("./productFunc");
const {isPayed} = require('./helperOrderFunction');

const collection = 'order_item';



async function insertOrderItem(OrderId,ProductId,quantity,userName){
    let productDetails = await getSingleProduct(key);
    let sellerName = productDetails.sellerName;
    let price = quantity*productDetails.price;
    await insertOne(collection,{sellerName,OrderId,ProductId,quantity,'resolve':false,'status':false,price,SubOrderId:crypto.randomBytes(4).toString('hex')});   
    await deleteFromCart(ProductId,userName);
    return price;
}

async function getAllOrderItem(OrderId){
    return findAll(collection,{OrderId});
}

async function getSellerOrder(sellerName){
    let orderItem = await findAll(collection,{sellerName,resolve:false});
    let length = (orderItem).length;

    for(let i=0;i<length;++i){
        let paymentStatus = await isPayed(orderItem[i].OrderId);
        if(paymentStatus){
            let product = await getSingleProduct(orderItem[i].ProductId);
            orderItem[i].img = product.img;
            orderItem[i].title = product.title;
        }else{
            delete orderItem[i];
        }
    }
    return orderItem;
}

async function getSubOrderFromSubOrderId(SubOrderId){
    return findOne(collection,{SubOrderId});
}


function rejectOrder(SubOrderId){
    return updateOne(collection,{SubOrderId},{resolve:true,status:false});
}


function resolvePositive(SubOrderId){
    return updateOne(collection,{SubOrderId},{resolve:true,status:true});
}

module.exports = {insertOrderItem,getAllOrderItem,getSellerOrder,rejectOrder,getSubOrderFromSubOrderId,resolvePositive};