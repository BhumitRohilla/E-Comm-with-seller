const { addToCart, removeFromCart } = require("./cartFunction");
const { getSingleProduct, decreaseOneStock } = require("./productFunc");


async function addToCartAndRemoveStock(userName,pid){
    let stock
    try{
        let product = await getSingleProduct(pid);
        stock = product.stock;
    }
    catch(err){
        throw err;
    }
    if(stock > 0){
        try{
            await addToCart(pid,userName);
        }
        catch(err){
            throw 404;
        }
        try{
            await decreaseOneStock(pid);
        }
        catch(err){
            removeFromCart(pid,userName);
            throw 404;
        }
    }else{
        throw 204;
    }
}


module.exports = {addToCartAndRemoveStock};