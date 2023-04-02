const {getAllProductOfSeller,getSingleProduct} = require('../../Services/common/productFunc');
const { getSellerOrder } = require('../../Services/common/sellerOrderList');


async function sellerPageShow (req,res){
    let err = req.session.err;
    if(err!=undefined){
        delete req.session.err;
    }
    let allProduct;
    try{
        allProduct = await getAllProductOfSeller(req.session.user.userName);
        res.render('sellerPage',{"userType":req.session.userType,"user":req.session.user,"err":err,"product":allProduct});
    }
    catch(err){
        console.log(err);
        res.statusCode = 500;
        res.render('errPage',{userType:req.session.userType,userName:req.session.user.userName,error:err})
    }
}


async function updateProductShow(req,res){
    let {pid} = req.params;
    let item;
    try{
        item = await getSingleProduct(pid);
        if(item.sellerName !== req.session.user.userName){
            throw err;
        }
    }
    catch(err){
        res.statusCode = 404;
        res.send("Unable to find the product");
        return ;
    }
    let action = `/sellerPage/updateProduct/${pid}`;
    res.render('updateProductPage',({item,action}));
}


async function showOrders(req,res){
    let order;
    try{
        order = await getSellerOrder(req.session.user.userName);
    }
    catch(err){
        console.log(err);
        res.statusCode = 500;
        res.send("Server Error Occure");
        return ;
    }
    res.render('sellerOrder.ejs',{userType:req.session.userType,user:req.session.user,order});
}


module.exports ={sellerPageShow,updateProductShow,showOrders};