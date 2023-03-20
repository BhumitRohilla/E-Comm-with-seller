const express = require('express');
const { getAllProductArrayForm, addProduct, getSingleProduct, updateProduct, deleteSingleProduct } = require('../func/dbFunction/productFunc');
const router = express.Router();
const crypto = require('crypto');
const multer = require('multer');
const upload = multer({'dest':'public/image/product/'});
const fs = require('fs');
const path = require('path');
const { getSellerOrder } = require('../func/dbFunction/sellerOrderList');
const {rejectOrder} = require('../func/dbFunction/orderFunction');

router.route('/')
.get(async (req,res)=>{
    let err = req.session.err;
    if(err!=undefined){
        delete req.session.err;
    }
    let allProduct;
    try{
        allProduct = await getAllProductArrayForm({'sellerId':req.session.user.id});
    }
    catch(err){
        console.log(err);
        res.statusCode = 500;
        res.send();
    }
    res.render('sellerPage',{"userType":req.session.userType,"user":req.session.user,"err":err,"product":allProduct});
})

router.route('/addNewProduct/:key')
.get((req,res)=>{
    let {key} = req.params;
    res.render('newProductPage',({"action":`/sellerPage/addNewProduct/${key}`}));
})
.post(upload.single("product-img")  ,async (req,res)=>{
    let {key} = req.params;
    let obj = {};
    if(req.file.size > 256000){
        console.log("File is large");
        res.statusCode = 402;
    }
    else{
        let {title,tags,date,status,userReviews,stock,about} = req.body;
        obj = {title,tags,date,status,userReviews,stock,about};
        obj.imgSrc = req.file.filename;
        let isValid = checkProductValues(obj);
        if(!isValid){
            res.statusCode = 404;
        }
        else{
            try{
                obj.id = crypto.randomBytes(7).toString('hex');
                obj.sellerId = key;
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

})


router.route('/updateProduct/:pid')
.get(async (req,res)=>{
    let {pid} = req.params;
    let item;
    try{
        item = await getSingleProduct(pid);
        if(item.sellerId !== req.session.user.id){
            throw err;
        }

    }
    catch(err){
        res.statusCode = 404;
        res.send("Unable to find the product");
        return ;
    }
    let action = `/sellerPage/updateProduct/${pid}`;
    // let item = await db.collection('product').findOne({id});
    res.render('updateProductPage',({item,action}));
})
.post(upload.single('product-img'),async (req,res)=>{
    let {title,tags,date,status,userReviews,stock,about} = req.body;
    let {pid} = req.params;
    let item;
    //TODO:
    try{
        item = await getSingleProduct(pid);
        if(item.sellerId !== req.session.user.id){
            throw "unAutharised";
        }
        let updated = false;
        if(title!=""){
            item.title = title;
            updated = true;
        }
        if(tags!=""){
            item.tag = tags.split(' ');
            updated = true;
        }
        if(date !=''){
            item.date = date;
            updated = true;
        }
        if(status != ''){
            item.status = status;
            updated = true;
        }
        if(userReviews != '' && userReviews > 0){
            item.userReviews = userReviews;
            updated = true;
        }
        if(stock != '' && stock > 0){
            item.stock = stock;
            updated = true;
        }
        if(item['about-game'] != '' ){
            item['about-game'] = about;
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
            // db.collection('product').updateOne({"id":item.id},{$set:item})
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
});


router.post('/deleteProduct',(req,res)=>{
    req.data = '';
    req.on('data',function(chunk){
        req.data+=chunk;
    })
    req.on('end',async function(){
        //TODO: Low Priority Create Function of this code
        let product = await getSingleProduct(req.data);
        if(product.sellerId === req.session.user.id){
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
})

router.route('/order')
.get(async (req,res)=>{
    let order
    try{
        order = await getSellerOrder(req.session.user.id);
    }
    catch(err){
        console.log(err);
        res.statusCode = 500;
        res.send("Server Error Occure");
    }
    console.log(order);
    res.render('sellerOrder.ejs',{userType:req.session.userType,user:req.session.user,order});
})

router.post('/order/reject/:key',async (req,res)=>{
    let {key} = req.params;
    console.log(key);
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
})


function checkProductValues(obj){
    if(obj.title == "" || obj.tag == "" || obj.date == "" || obj.statusProduct == "" || obj.userReviews == "" /*|| price == ""*/ || obj.stock == ""  || obj.about == "" || obj.img == ""){
        return false;
    }else if(obj.userReviews < 0 || obj.stock  < 0){
        alert("Please Enter none negative values");
        return false;
    }else{
        return true;
    }
}




module.exports = router;