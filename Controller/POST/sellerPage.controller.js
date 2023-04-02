const { rejectOrder, getSubOrderFromSubOrderId } = require('../../Services/common/orderFunction');
const {addProduct,getSingleProduct,updateProduct,deleteSingleProduct} = require('../../Services/common/productFunc');


async function addNewProduct(req,res){
    let {key} = req.params;
    let obj = {};
    if(req.file === undefined){
        res.statusCode = 404;
        res.end();
        return;
    }
    if(req.file.size > 256000){
        res.statusCode = 402;
    }
    else{
        let {title,tags,date,status,userReviews,stock,about,price} = req.body;
        obj = {title,tags,date,status,userReviews,stock,about,price};
        let isValid = checkProductValues(obj);
        if(!isValid){
            res.statusCode = 404;
        }
        else{
            try{
                obj.imgSrc = req.file.filename;
                // obj.id = crypto.randomBytes(7).toString('hex');
                // obj.sellerId = key;
                obj.sellerName = key;
                await addProduct(obj);
                res.statusCode = 200;
            }
            catch(err){
                console.log(err);
                res.statusCode = 404;
            }
        }
    }
    res.setHeader('Content-Type','text/plain');
    res.send();
}


async function updateProductController(req,res){
    let {title,tags,date,status,userReviews,stock,about,price} = req.body;
    let {pid} = req.params;
    let item;
    try{
        item = await getSingleProduct(pid);
        if(item.sellerName !== req.session.user.userName){
            throw "unAutharised";
        }
        let updated = false;
        if(title.trim()!=""){
            item.title = title;
            updated = true;
        }
        if(tags.trim()!=""){
            item.tag = tags;
            updated = true;
        }
        if(date.trim() !=''){
            item.date = date;
            updated = true;
        }
        if(status.trim() != ''){
            item.status = status;
            updated = true;
        }
        if(userReviews.trim() != '' && userReviews > 0){
            item.userReviews = userReviews;
            updated = true;
        }
        if(stock.trim() != '' && stock > 0){
            item.stock = stock;
            updated = true;
        }
        if(item['about-game'].trim() != '' ){
            item['about-game'] = about;
            updated = true;
        }
        if(price.trim() != '' && price >0){
            item.price = price;
            updated = true;
        }
        let olderFile = item.img;
        if(req.file!=undefined){
            item.img = req.file.filename;
            updated = true;
            // TODO: Low Priority Move It into function;
            fs.unlink(path.join(__dirname,'/public/image/product',olderFile),function(){
                
            });
        }
        if(updated){
            updateProduct(pid,item)
            .then(function(){
                res.statusCode = 200;
                res.setHeader('Content-Type','text/plain');
                res.send();
            })
            .catch((err)=>{
                console.log(err);
                res.statusCode = 404;
                res.setHeader('Content-Type','plain/text');
                res.send();
            })
        }
    }
    catch(err){
        console.log(err);
        if(err === "unAutharised"){
            res.statusCode = 403;
        }else{
            res.statusCode = 404;
        }
        res.setHeader('Content-Type','text/plain');
        res.send();
    }
}

async function deleteProduct(req,res){
    req.data = '';
    req.on('data',function(chunk){
        req.data+=chunk;
    })
    req.on('end',async function(){
        let product;
        try{
            product = await getSingleProduct(req.data);
        }
        catch(err){
            console.log(err);
            res.statusCode = 403;
            res.setHeader('Content-Type','text/plain');
            res.send();
        }
        if(product.sellerName === req.session.user.userName){
            deleteSingleProduct(req.data)
            .then(function(){
                res.setHeader('Content-Type','text/plain');
                res.statusCode = 200;
                res.send();
            })
            .catch((err)=>{
                console.log(err);
                res.setHeader('Content-Type','text/plain');
                res.statusCode = 404;
                res.send();
            })
        }else{
            res.setHeader('Content-Type','text/plain');
            res.statusCode = 403;
            res.send();
        }
    })
}


async function orderRejected (req,res){
    let {key} = req.params;
    try{
        await rejectOrder(key);
        res.statusCode = 200;
        res.send();
    }
    catch(err){
        console.log(err);
        res.statusCode = 500;
        res.send();
    }
}


async function orderAccepted(req,res){
    let {key} = req.params;
    let ProductKey = req.body;
    try{
        let subOrder = await getSubOrderFromSubOrderId(key);
        let quantityOfOrder = subOrder.quantity;
        console.log(Object.keys(ProductKey));
        if(ProductKey.length != quantityOfOrder){
            throw new Error('quantity and product key not matching');
        }
        await insertProductKeys(key,ProductKey);
        res.statusCode = 200;
    }
    catch(err){
        if(err.message == 'quantity and product key not matching'){
            res.statusCode = 202;
        }else{
            res.statusCode = 500;
        }
    }
    res.setHeader('Content-Type','text/plain');
    res.send();
}


module.exports = {addNewProduct,updateProductController,deleteProduct,orderRejected,orderAccepted};


function checkProductValues(obj){
    if(obj.title == "" || obj.tag == "" || obj.date == "" || obj.statusProduct == "" || obj.userReviews == "" /*|| price == ""*/ || obj.stock == ""  || obj.about == "" || obj.img == ""){
        return false;
    }else if(obj.userReviews < 0 || obj.stock  < 0 || obj.price < 0){
        return false;
    }else{
        return true;
    }
}