const {getProducts} = require('../../Services/common/productFunc');
const {getQuantity} = require('../../Services/common/cartFunc');


async function showProductInitial(req,res){
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
}

async function showMoreProduct(req,res){
    let skip = req.session.index;
    
    let data = await getProducts( skip , 5 );
    if( data == 0){
        res.statusCode = 403;
        res.send();
        return ;
    }
    req.session.index = skip + data.length;
    res.render('partials/productMore',{user:req.session.userName,"data":data});
}

async function getProductValue(req,res){
    let {id} = req.params;
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
}

module.exports = {showProductInitial,showMoreProduct,getProductValue};