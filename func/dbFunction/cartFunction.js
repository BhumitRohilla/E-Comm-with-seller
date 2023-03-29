let {findOne, insertOne, updateOne, removePropertyFromAll, removeProperty} = require('../db/dbFunction');
let {increaseOneStock,getAllProduct,increaseStocks} = require('./productFunc');
let collection = 'cart';

async function getQuantity(pid,userName){
    let data ;
    try{
        // data = await findOne(db,collection,{userName});
        data = await getUserCart(userName);
        // console.log(data);
    }
    catch(err){
        throw err;
    }
    let quantity;
    if(data == null){
        quantity = 0;
    }else{
        try{
            quantity = data.product[pid].quantity;
            // console.log(quantity);
        }
        catch(err){
            console.log(err);
            quantity =  0;
        }
    }
    return quantity;
}


async function addToCart(pid, userName){
    let userCart;
    try{
        userCart = await getUserCart(userName);
    }
    catch(err){
        throw err;
    }
    try{
        userCart.product[pid].quantity++;
    }
    catch(err){
        let userExist = true;
        if(userCart == null){
            userCart = {
                userName,
                product : {}
            }
            userExist = false;
        }
        userCart.product[pid] = {};
        userCart.product[pid].quantity = 1;
        if(!userExist){
            try{
                await  insertOne(collection,userCart);
                return ;
            }
            catch(err){
                throw err;
            }
        }
    }
    try{
        await updateOne(collection,{userName},{"product":userCart.product});
    }
    catch(err){
        throw err;
    }
}


function deleteFromCart(pid,userName){
    let productToRemove = 'product.'+pid;
    // * Check for alternative
    return removeProperty(collection,{userName},{productToRemove});
}

async function removeFromCart(pid, userName){
    let quantity ;
    try{
        quantity = await getQuantity(pid,userName);
        if(quantity > 0){
            quantity--;
            let productToUpdate = "product." + pid;
            await updateOne(collection,{userName},{ [productToUpdate] : {"quantity":quantity}});
        }
        await increaseOneStock(pid);
    }
    catch(err){
        console.log(err);
        throw err;
    }

        // updateOne(db,collection,{userName},{"product":userCart.product});
        // let data = await getSingleProduct(pid,db);
        // // let data = await db.collection('product').findOne({'id':pid});
        // data.stock++;
        // updateOne(db,collection,{'id':pid},{"stock":data.stock});
        // // db.collection('product').updateOne({'id':pid},{$set:{"stock":data.stock}});
}

async function getUserCart(userName){
    return findOne(collection,{userName});
    // * return db.collection('cart').findOne({"userName":userName});
}

async function getUserCartItem(cart){
    //TODO: ERROR HANDLING
    let allItems
    try{
        allItems = await getAllProduct();
    }
    catch(err){
        throw err;
    }
    let obj = {};
    if(cart != null){
        for(key in cart.product){
            obj[key] = allItems[key];
            if(obj[key]==undefined){
                //TODO: Remove Dependency from this code
                try{
                    await deleteProductFromCartWhichAreDeletedByAdmin(key);
                    // db.collection('cart').updateMany({},{ $unset: {[propertyToDelete]:1}});
                }
                catch(err){
                    console.log(err);
                }
                delete obj[key];
            }else{
                obj[key].quantity = cart.product[key].quantity;
            }
        }
    }
    return obj;
}

function deleteProductFromCartWhichAreDeletedByAdmin(key){
    let propertyToDelete = "product."+key;
    removePropertyFromAll(collection,{},{[propertyToDelete]:1});
}


async function deleteFromCart(pid,userName){
    try{
        let quantity = await getQuantity(pid,userName);
        await increaseStocks(pid,quantity);
    }
    catch(err){
        console.log(err);
    }
    let propetyToDelete = "product."+pid;
    // db.collection().updateOne({"id":pid},{$unset:{propetyToDelete}});
    return removeProperty(collection,{userName},{[propetyToDelete]:1});
}

function getTotalPriceOfCartUserName(userName){
    return 0;
}

module.exports = {getQuantity,addToCart,removeFromCart,getUserCart,getUserCartItem,deleteFromCart,getTotalPriceOfCartUserName};