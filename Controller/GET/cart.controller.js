const {getUserCart,getUserCartItem,getQuantity,removeFromCart,deleteFromCart,getTotalPriceOfCartUserName,addToCartAndRemoveStock} = require('../../Services/common/cartFunc');

async function showCart(req,res){
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
}

async function buyProduct(req,res){
    let {pid} = req.params;
    try{
        await addToCartAndRemoveStock(req.session.user.userName,pid);
        res.statusCode = 201;
    }
    catch(err){
        console.log('Transaction Failed');
        res.statusCode = err;
    }
    res.send();
}

async function removeOneProduct(req,res){
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
}

async function deleteProduct(req,res){
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
}

async function getPriceOfCart(req,res){
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
}

module.exports = {showCart,buyProduct,removeOneProduct,deleteProduct,getPriceOfCart};