const express = require('express');
// const { getQuantity, addToCart, removeFromCart } = require('../func/dbFunction/cartFunction');
// const {getQuantity,addToCart,removeFromCart} = require('../func/dbFunction-sql/cartFunction');
// const { getProducts, getSingleProduct, decreaseOneStock } = require('../func/dbFunction/productFunc');
const router = express.Router();

// const {getProducts,getSingleProduct,decreaseOneStock} = require('../func/dbFunction-sql/productFunc');
const {getProducts,getSingleProduct,decreaseOneStock} = require('../func/common/productFunc');
const {addToCart,getQuantity} = require('../func/common/cartFunc');

//* getProducts         :-> select * from product offset skip fetch next 5 rows only;
//* getQuantity         :-> select quantity from cart_item where cartid = (select cartId from cart where userName = '') and productId = '';
//* getSingleProduct    :-> select * from product where productId =  '';
//! checkIfPresent      :-> select 'exists' from cart_item where cartId = (select cartId from cart where userName = '' ) and productId = '';
//! addToCart (present) :-> update outer set quantity =((select quanity from cart_item as inner where inner.cartId = outer.cartId and productId = '' )+1) from cart_item as outer into cart_item  values();
//! ifCartDoesNotExists :-> insert into cart values();
//! addToCart (not present) :-> insert into cart_item values();


router.route('/')
.get(async (req,res)=>{
    // readFileStream('./product.json',function(data){
    //     res.render('product',({user:req.session.userName,"data":data}));
    // },req);
    req.session.index = 0;
    let data ;
    try{
        data = await getProducts(0,5);
    }
    catch(err){
        console.log(err);
        res.render('errPage',{'userType':req.session.userType,'user': req.session.user ,"error":"Server Error Occure"});
        return ;
    }
    console.log(data);
    req.session.index = data.length;
    
    res.render('product',{'userType':req.session.userType,'user': req.session.user ,"data":data});
    // res.render('product',{user:req.session.userName,"data":data});
})

router.get('/showMore',async (req,res)=>{
    let skip = req.session.index;
    
    let data = await getProducts( skip , 5 );
    if( data == 0){
        res.statusCode = 403;
        res.send();
        return ;
    }
    req.session.index = skip + data.length;
    res.render('partials/productMore',{user:req.session.userName,"data":data});

    // let data = getProducts(parseInt(req.session.index),5);
    // req.session.index += data.length;
    // res.send(data);
    // if(req.session.index && req.session.index == -1){
    //     res.statusCode=404;
    //     res.end();
    //     return ;
    // }
    // readFileStream('./product.json',function(data){
    //    res.setHeader('Content-Type','application/JSON');
    //    res.send(data);
    // },req);
})


router.get('/getProductValue/:id',async (req,res)=>{
    // res.send(req.params);
    let {id} = req.params;
    // getQuantity(id,req.session.user.userName,function(data){
    //     res.statusCode = 200 ;
    //     res.setHeader('Content-Type','text/plain');
    //     res.send(data.toString());
    // });
    let quantity ;
    try{
        quantity = await getQuantity(id,req.session.user.userName);
    }
    catch(err){
        console.log(err);
        res.statusCode = 404;
        res.setHeader("Content-Type",'text/plain');
        res.send();
        return ;
    }
    res.statusCode = 200;
    res.setHeader("Content-Type",'text/plain');
    res.send(quantity.toString());
})

// * Done UptoHear;

router.get('/buyProduct/:pid',async (req,res)=>{
    let {pid} = req.params;
    let stock
    try{
        let product = await getSingleProduct(pid);
        stock = product.stock;
    }
    catch(err){
        res.statusCode = 404;
        res.setHeader('Content-Type','text/plain');
        res.send();
        return ;
    }
    if(stock > 0){
        res.statusCode = 201;
        try{
            await addToCart(pid,req.session.user.userName);
        }
        catch(err){
            console.log(err);
            res.statusCode = 404;
            res.send();
            return ;
        }
        try{
            await decreaseOneStock(pid);
        }
        catch(err){
            removeFromCart(pid,req.session.user.userName);
            console.log(err);
            res.statusCode = 404;
            res.send();
        }
    }else{
        res.statusCode = 204;
    }
    res.send();
})



module.exports = router;