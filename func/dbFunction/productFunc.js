let {findAllWithSkip,findOne,updateOne,findAll, insertOne,deleteOne, deleteMany, updateMany} = require('../db/dbFunction');

let collection = 'product';


function getProducts(starting,number){
    return findAllWithSkip(collection,starting,number,{"active":true});
}


function getSingleProduct(pid){
    return findOne(collection,{"ProductId":pid,'active':true});
}


async function increaseOneStock(pid){
    let product;
    let stock;
    try{
        // * db.collection('product').findOne({"id":pid});
        product = await getSingleProduct(pid);
        stock = product.stock;
        stock++;
        await updateOne(collection,{"id":pid},{"stock":stock});
    }
    catch(err){
        throw err;
    }
}

async function increaseStocks(pid,stocks){
    let product;
    let stock;
    try{
        product = await getSingleProduct(pid);
        stock = product.stock + stocks;
        await updateOne(collection,{'id':pid},{"stock":stock});
    }
    catch(err){
        throw err;
    }
}

async function decreaseOneStock(pid){

    let product;
    let stock;
    try{
        product = await getSingleProduct(pid);
        stock = product.stock;
    }
    catch(err){
        throw err;
    }
    try{
        await updateOne(collection,{"id":pid},{"stock": stock -1 });
    }
    catch(err){
        throw err;
    }
}

async function getAllProduct(){
    let data;
    try{
        data = await findAll(collection,{'active':true});
    }
    catch(err){
        throw err;
    }
    // * let data = await db.collection('product').find().toArray();
    let obj ={};
    data =  data.forEach((element)=>{
        obj[element.ProductId] = element;
    })
    return obj;
}


function getAllProductArrayForm(filter){
    filter.active = true;
    return findAll(collection,filter);
}

async function addProduct(obj){
    //TODO: Remove This Dependency;
    let finalObj = {}
    finalObj.id = obj.id;
    finalObj.sellerId = obj.sellerId;
    finalObj.active = true;
    finalObj.title = obj.title;
    let tagArray = obj.tags.split(' ');
    finalObj.date = obj.date;
    finalObj.tag = tagArray;
    finalObj.status = obj.status;
    finalObj.userReviews = obj.userReviews;
    finalObj.img = obj.imgSrc;
    finalObj.stock = obj.stock;
    finalObj['about-game'] = obj.about;
    return insertOne(collection,finalObj);
    // * return await db.collection('product').insertOne(finalObj);
}

function updateProduct(pid,data){
    data.tag = data.tag.split(' ');
    return updateOne(collection,{"id":pid,'active':true},data);
}

function deleteSingleProduct(pid){
    return updateOne(collection,{"id":pid},{'active':false});
}

function deleteMultipleProduct(filter){
    return updateMany(collection,filter,{'active':false});
}

function getAllProductOfSeller(sellerName){
    return getAllProductArrayForm({sellerName});
}

module.exports = {getProducts,getSingleProduct,decreaseOneStock,increaseOneStock,getAllProduct,addProduct,updateProduct,deleteSingleProduct,getAllProductArrayForm,deleteMultipleProduct,increaseStocks,getAllProductOfSeller};