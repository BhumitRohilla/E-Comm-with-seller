const stripe = require('stripe')('sk_test_51MrAkJSIXFeKBASGhgSyuVln4JM9o4XNGs8JhIdFzA3SgnXrWoRQLu0sJWVrc1KduZx2uYaaDYXZ6tiQAiDVI0PM00OdN7Ea2G');
const express = require('express');
// const { getUserCartItem, getUserCart, getQuantity, removeFromCart ,deleteFromCart} = require('../func/dbFunction/cartFunction');
const router = express.Router();


// const {getUserCart,getUserCartItem,getQuantity,removeFromCart,deleteFromCart} = require('../func/dbFunction-sql/cartFunction');
const {getUserCart,getUserCartItem,getQuantity,removeFromCart,deleteFromCart,getTotalPriceOfCartUserName} = require('../func/common/cartFunc');
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
        res.render('cart',({"userType":req.session.userType,"user":req.session.user,"items":cartItem,"price":cart.price}));
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
            await removeFromCart(pid,req.session.user.userName);
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
            let {orderId,price} = await placeOrder(productQuantity,userName);
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                mode:'payment',
                line_items:[
                    {
                        price_data:{
                            currency:'inr',
                            product_data:{
                                name:"Total"
                            },
                            unit_amount : price
                        },
                        quantity:1
                    }
                ],
                success_url:`http://${process.env.HOSTNAME}:${process.env.PORT}/thanks/${orderId}`,
                cancel_url: `http://${process.env.HOSTNAME}:${process.env.PORT}/orderCancel/${orderId}`,
            })
            res.statusCode = 200;
            console.log(session.url);
            res.setHeader('Content-Type','text/plain');
            res.send(session.url);
        }
    }
    catch(err){
        console.log(err);
        res.statusCode = 500;
        res.send();
    }
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


router.get('/getPrice',async (req,res)=>{
    let userName =  req.session.user.userName;
    try{
        let totalPrice = await getTotalPriceOfCartUserName(userName);
        res.setHeader('Content-Type','text/plain');
        res.send(`${totalPrice}`);
        res.statusCode = 202;
    }
    catch(err){
        console.log(err);
        res.statusCode = 500;
    }
})

module.exports = router;