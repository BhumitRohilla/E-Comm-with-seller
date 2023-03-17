const express = require('express');
const { getQuantity, addToCart, removeFromCart } = require('../func/cartFunction');
const { getProducts, getSingleProduct, decreaseOneStock } = require('../func/productFunc');
const router = express.Router();

router.route('/')
.get(async (req,res)=>{
    // readFileStream('./product.json',function(data){
    //     res.render('product',({user:req.session.userName,"data":data}));
    // },req);
    req.session.index = 0;
    let data = await getProducts(0,5);
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