
const stripe = require('stripe')(process.env.STRIPEKEY);
const {getUserCart} = require('../../Services/common/cartFunc');
const {placeOrder} = require('../../Services/common/placeOrder');



async function orderPlacement(req,res){
    let userName = req.session.user.userName;
    try{
        let cart = await getUserCart(userName);
        let productQuantity = cart.product;
        if(Object.keys(productQuantity).length == 0)
        {
            res.statusCode = 202;
        }else{
            let {orderId,price,failedItem} = await placeOrder(productQuantity,userName);
            if(price == 0){
                res.statusCode = 303;
                res.setHeader('Content-Type','text/plain');    
                res.send(`http://${process.env.HOSTNAME}:${process.env.PORT}/thanks/${orderId}`);
            }else{
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
                                    unit_amount : price *100
                                },
                                quantity:1
                            }
                        ],
                        success_url:`http://${process.env.HOSTNAME}:${process.env.PORT}/thanks/${orderId}`,
                        cancel_url: `http://${process.env.HOSTNAME}:${process.env.PORT}/cancelled/${orderId}`,
                    })
                res.statusCode = 303;
                res.send(session.url);
            }
        }
    }
    catch(err){
        console.log(err);
        res.statusCode = 500;
        res.send();
    }
}


module.exports = {orderPlacement};