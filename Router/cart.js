const express = require('express');
// const { getUserCartItem, getUserCart, getQuantity, removeFromCart ,deleteFromCart} = require('../func/dbFunction/cartFunction');
const router = express.Router();


// const {getUserCart,getUserCartItem,getQuantity,removeFromCart,deleteFromCart} = require('../func/dbFunction-sql/cartFunction');
const {getUserCart,getUserCartItem,getQuantity,removeFromCart,deleteFromCart} = require('../func/common/cartFunc');
const {placeOrder} = require('../func/common/placeOrder');

//* getUserCartProduct :-> select (select * from product where productId = cart_item.productId),quantity from cart_item where cartId = (select cartId from cart where userName = '');
//! removeFromCart     :-> update c2 set quantity = (select quantity from cartItem as  c1 where c1.cartId = c2.cartId and productId = '' ) - 1 from cart_item as c2 where cartId = (select cartId from cart where userName = '') where productId = '';
//* deleteFromCart     :-> delete cart_item where cartId = (select cartId from cart where userName = '') and productId = '';
//* placeOrder         :-> In placeOrder Function;
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
        return ;
    };
    if(quantity > 1){
        try{
            removeFromCart(pid,req.session.user.userName);
            res.statusCode = 201;
            res.setHeader('Content-Type','text/plain');
            res.send();
        }
        catch(err){
            console.log(err);
            res.statusCode = 404;
            res.send();
            return ;
        }
    }else{
        res.statusCode = 204;
        res.send();
    }
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
    
    try{
        await deleteFromCart(pid,req.session.user.userName)
        res.statusCode = 201;
        res.setHeader('Content-Type','text/plain');
        res.send();
    }
    catch(err){
        console.log(err);
        res.statusCode = 404;
        res.setHeader('Content-Type','text/plain');
        res.send();
    }
});


module.exports = router;