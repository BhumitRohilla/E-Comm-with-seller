const mongoCart    = require('../dbFunction/cartFunction');
const sqlCart      = require('../dbFunction-sql/cartFunction');


function getQuantity(id,userName){
    let result;
    if(process.env.USESQL == 'true'){
        result = sqlCart.getQuantity(id,userName);
    }else{
        result = mongoCart.getQuantity(id,userName);
    }
    return result;
}

function addToCart(pid,userName){
    let result;
    if(process.env.USESQL == 'true'){
        result = sqlCart.addToCart(pid,userName);
    }else{
        result = mongoCart.addToCart(pid,userName)
    }
    return result;
}

function getUserCart(userName){
    let result;
    if(process.env.USESQL == 'true'){
        result = sqlCart.getUserCart(userName);
    }else{
        result = mongoCart.getUserCart(userName);
    }
    return result;
}

function getUserCartItem(cart){
    let result;
    if(process.env.USESQL == 'true' ){
        result = sqlCart.getUserCartItem(cart);
    }else{
        result = mongoCart.getUserCartItem(cart);
    }
    return result;
}

function removeFromCart(pid,userName){
    let result;
    if(process.env.USESQL == 'true'){
        result = sqlCart.removeFromCart(pid,userName);
    }else{
        result = mongoCart.removeFromCart(pid,userName);
    }
    return result;
}

function deleteFromCart(pid,userName){
    let result;
    if(process.env.USESQL == 'true'){
        result = sqlCart.deleteFromCart(pid,userName);
    }else{
        result = mongoCart.deleteFromCart(pid,userName);
    }
    return result;
}

module.exports = {getQuantity,addToCart,getUserCart,getUserCartItem,removeFromCart,deleteFromCart};