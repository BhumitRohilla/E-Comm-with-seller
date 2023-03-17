const express = require('express');
const { getUserCartItem, getUserCart, getQuantity, removeFromCart ,deleteFromCart} = require('../func/cartFunction');
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


router.post('/order',async (req,res)=>{
    let userName = req.session.user.userName;
    let cart = await getUserCart(userName);
    console.log(cart);
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