let {findAllWithSkip,findOne,updateOne,findAll, insertOne,deleteOne, deleteMany} = require('./dbFunction');

let collection = 'product';


function getProducts(starting,number){
    return findAllWithSkip(collection,starting,number,{});
}


function getSingleProduct(pid){
    return findOne(collection,{"id":pid});
}


async function increaseOneStock(pid){
    let product;
    let stock;
    try{
        // * db.collection('product').findOne({"id":pid});
        product = await findOne(collection,{"id":pid});
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
        product = await findOne(collection,{'id':pid});
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
        data = await findAll(collection,{});
    }
    catch(err){
        throw err;
    }
    // * let data = await db.collection('product').find().toArray();
    let obj ={};
    data =  data.forEach((element)=>{
        obj[element.id] = element;
    })
    return obj;
}


function getAllProductArrayForm(filter){
    return findAll(collection,filter);
}

async function addProduct(obj){
    //TODO: Remove This Dependency;
    let finalObj = {}
    finalObj.id = obj.id;
    finalObj.sellerId = obj.sellerId;
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
    // db.collection().
    return updateOne(collection,{"id":pid},data);
}

function deleteSingleProduct(pid){
    return deleteOne(collection,{"id":pid});
}

function deleteMultipleProduct(filter){
    return deleteMany(collection,filter);
}

module.exports = {getProducts,getSingleProduct,decreaseOneStock,increaseOneStock,getAllProduct,addProduct,updateProduct,deleteSingleProduct,getAllProductArrayForm,deleteMultipleProduct,increaseStocks};