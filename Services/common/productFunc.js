const mongoProduct = require('../dbFunction/productFunc');
const sqlProduct   = require('../dbFunction-sql/productFunc');

function getProducts(start,length){
    let result;
    if(process.env.USESQL == 'true'){
        result = sqlProduct.getProducts(start,length);
    }else{
        result = mongoProduct.getProducts(start,length);
    }
    return result;
}

function getSingleProduct(pid){
    let result;
    if(process.env.USESQL == 'true'){
        result = sqlProduct.getSingleProduct(pid);
    }else{
        result = mongoProduct.getSingleProduct(pid);
    }
    return result;
}

function decreaseOneStock(pid){
    let result ;
    if(process.env.USESQL == 'true'){
        result = sqlProduct.decreaseOneStock(pid);
    }else{
        result = mongoProduct.decreaseOneStock(pid);
    }
    return result;
}

function getAllProductArrayForm(){
    let result;
    if(process.env.USESQL == 'true'){
        result = sqlProduct.getAllProductArrayForm();
    }else{
        result = mongoProduct.getAllProductArrayForm({});
    }
    return result;
}

function getAllProductOfSeller(sellerName){
    let result;
    if(process.env.USESQL == 'true'){
        result = sqlProduct.getAllProductOfSeller(sellerName);
    }else{
        result = mongoProduct.getAllProductOfSeller(sellerName);
    }
    return result;
}

function addProduct(obj){
    let result;
    if(process.env.USESQL == 'true'){
        result = sqlProduct.addProduct(obj);
    }else{
        result = mongoProduct.addProduct(obj);
    }
    return result;
}

function updateProduct(pid,item){
    let result;
    if(process.env.USESQL == 'true'){
        result = sqlProduct.updateProduct(pid,item);
    }else{
        result = mongoProduct.updateProduct(pid,item);
    }
    return result;
}

function deleteSingleProduct(pid){
    let result;
    if(process.env.USESQL == 'true'){
        result = sqlProduct.deleteSingleProduct(pid);
    }else{
        result = mongoProduct.deleteSingleProduct(pid);
    }
    return result;
}



module.exports = {getProducts,getSingleProduct,decreaseOneStock,getAllProductArrayForm,getAllProductOfSeller,addProduct,updateProduct,deleteSingleProduct};