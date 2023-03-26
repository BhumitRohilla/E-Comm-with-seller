const { newConnectionSQL } = require("../db/dbConnectionSQL");


async function getProducts(start,length){
    let query = `select * from dbo.getProduct(${start},${length});`;
    let result = await newConnectionSQL(query);
    console.log(result);
    result.forEach((element)=>{
        element.tag = element.tag.split(' ');
    })
    return result;
    // alter function getProduct(@start int,@length int)
    // returns table
    // as
    // 	    return select Product.*,c1.tag,[[about-game]] from Product inner join (select Product_Tag.*,[about-game] from Product_Tag join About_Product on Product_Tag.productId = About_Product.productId) as c1 on c1.productId = Product.productId order by productId OFFSET @start rows fetch next @length rows only;

}

async function getSingleProduct(pid){
    let query = `select Product.*,tag , [about-game] from Product join ( select Product_Tag.*,[about-game] from Product_Tag inner join About_Product on Product_Tag.ProductId = About_Product.ProductId) as c1 on Product.ProductId = c1.productId where Product.ProductId = ${pid} and active = 1;`;
    let result = await newConnectionSQL(query);
    result = result[0];
    result.tag = result.tag.split(' ');
    return result;
}

async function decreaseOneStock(pid){
    let query = `exec decraseStock ${pid}`;
    let result = await newConnectionSQL(query);
    console.log(result);
}

async function getAllProductArrayForm(){
    let query = `select * from dbo.getAllProduct()`;
    let result = await newConnectionSQL(query);
    result.forEach((element)=>{
        element.tag = element.tag.split(' ');
    })
    console.log(result);
    return result;
}

async function deleteSingleProduct(pid){
    let query = `update Product set active = 0 where ProductId = '${pid}'`;
    return newConnectionSQL(query);
}

async function addProduct(obj){
    // return insertOne(collection,finalObj);
    obj.tags = (obj.tags.split(' '));
    obj.tags = obj.tags.filter((element)=>{
        if(element.trim() == ''){
            return false;
        }
        return true;
    })
    obj.tags = obj.tags.join(' ');
    let query = `exec insertIntoProduct '${obj.sellerName}','${obj.title}','${obj.date}','${obj.stock}',${obj.userReviews},'${obj.status}','${obj.imgSrc}','${1}','${obj.tags}','${obj.about}'`;
    return newConnectionSQL(query);
    // * return await db.collection('product').insertOne(finalObj);
}

async function getAllProductOfSeller(sellerName){
    let query = `select Product.*,tag , [about-game] from Product join ( select Product_Tag.*,[about-game] from Product_Tag inner join About_Product on Product_Tag.ProductId = About_Product.ProductId) as c1 on Product.ProductId = c1.productId where sellerName = '${sellerName}' and active = 1;`;
    let result =await newConnectionSQL(query);
    result.forEach((element)=>{
        element.tag = element.tag.split(' ');
    })
    return result;
}

async function updateProduct(pid,item){
    console.dir('item',item);
    let query = `exec updateProduct  ${pid},'${item.title}','${item.date}','${item.status}',${item.userReviews},'${item.img}',${item.stock},'${item.tag}','${item['about-game']}'`;
    return newConnectionSQL(query);
}



module.exports = {getProducts,getSingleProduct,decreaseOneStock,getAllProductArrayForm,deleteSingleProduct,addProduct,getAllProductOfSeller,updateProduct};