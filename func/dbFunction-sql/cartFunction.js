const { newConnectionSQL } = require("../db/dbConnectionSQL");
const { getSingleProduct } = require('../dbFunction-sql/productFunc');

async function getQuantity(pid,userName){
    let query = `select dbo.getQuantity(${pid},'${userName}');`
    let result = await newConnectionSQL(query);
    console.log(result);
    return result[0][''];
}

async function addToCart(pid,userName){
    //console.log(pid,userName);
    let query = `exec increaseQuantityByOne ${userName}, ${pid}`;
    let result = await newConnectionSQL(query);
    console.log(result);
}

async function removeFromCart(pid,userName){
    let query = `exec decreaseQuantityByOne '${userName}', ${pid};`;
    let result = await newConnectionSQL(query);
    console.log(result);
}


async function getUserCart(userName){
    let query = `select * from cart_item where cartId = (select cartId from cart where userName = '${userName}')`;
    let result = await newConnectionSQL(query);
    console.log(result);
    let objToReturn = {};
    objToReturn.userName = userName;
    objToReturn.product = {};
    result.forEach((element)=>{
        let obj ={};
        obj.quantity = element.quantity;
        objToReturn.product[element.ProductId] = obj;
    })
    // console.log(objToReturn);
    return objToReturn;
}

async function getUserCartItem(cart){
    let obj = {};
    if(cart != null){
        for(key in cart.product){
            let item = await getSingleProduct(key);
            obj[key] = item;
            if(obj[key] === undefined){
                try{
                    await deleteProductFromCartWhichAreDeletedByAdmin(key);
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

async function deleteProductFromCartWhichAreDeletedByAdmin(key){
    let query = `delete cart_item where Productid = '${key}'`;
    await newConnectionSQL(query); 
}


async function deleteFromCart(pid,userName){
    let query = `delete cart_item where ProductId = '${pid}' and cartId = (select cartid from cart where userName = '${userName}')`;
    await newConnectionSQL(query);
    return ;
}

module.exports = {getQuantity,addToCart,removeFromCart,getUserCart,getUserCartItem,deleteFromCart};