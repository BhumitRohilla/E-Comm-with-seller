const express = require('express');
const { getUserCartItem, getUserCart, getQuantity, removeFromCart ,deleteFromCart} = require('../func/dbFunction/cartFunction');
const {placeOrder} = require('../func/dbFunction/placeOrder');
const router = express.Router();

router.route('/')
.get(async (req,res)=>{
    try{
        let cart = await getUserCart(req.session.user.userName);
        let cartItem = await getUserCartItem(cart); 
        res.render('cart',({"userType":req.session.userType,"user":req.session.user,"items":cartItem}));
    }
    catch(err){
        console.log(err);
        res.statusCode = 404;
        res.send("Error Occure");
    }
})


router.get('/removeProduct/:pid',async (req,res)=>{
    let {pid} = req.params;
    let quantity;
    try{
        quantity = await getQuantity(pid,req.session.user.userName);
    }
    catch(err){
        console.log(err);
        res.statusCode = 404;
        res.setHeader('Content-Type','text/plain');
        res.send();
    };
    if(quantity > 1){
        res.statusCode = 201;
        try{
            removeFromCart(pid,req.session.user.userName);
        }
        catch(err){
            console.log(err);
            res.statusCode = 404;
            res.send();
            return ;
        }
    }else{
        res.statusCode = 204;
    }
    res.send();
})


router.post('/orderPlacement',async (req,res)=>{
    let userName = req.session.user.userName;
    try{
        let cart = await getUserCart(userName);
        let productQuantity = cart.product;
        if(Object.keys(productQuantity).length == 0)
        {
            res.statusCode = 202;
        }else{
            await placeOrder(productQuantity,userName);
            res.statusCode = 200;
        }
    }
    catch(err){
        console.log(err);
        res.statusCode = 500;
    }
    res.setHeader('Content-Type','text/plain');
    res.send();
});


router.get('/deleteProduct/:pid',async (req,res)=>{
    let {pid} = req.params;
    
    deleteFromCart(pid,req.session.user.userName)
    .then(function(){
        res.statusCode = 201;
        res.setHeader('Content-Type','text/plain');
        res.send();
    })
    .catch((err)=>{
        console.log(err);
        res.statusCode = 404;
        res.setHeader('Content-Type','text/plain');
        res.send();
    })
})


module.exports = router;