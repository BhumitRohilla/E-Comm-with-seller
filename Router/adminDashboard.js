const express = require('express');
// const { getAllProductArrayForm, deleteMultipleProduct, getSingleProduct, deleteSingleProduct } = require('../func/dbFunction/productFunc');
// const { getAllSellers, deleteOneSeller, getOneSeller, createNewSeller } = require('../func/dbFunction/sellerFunc');
const sendMail = require('../func/sendMail');
const router = express.Router();
const sendInvitationMail = require('../func/sendInvitationMail');

// const {getAllProductArrayForm,deleteSingleProduct,getSingleProduct} = require('../func/dbFunction-sql/productFunc');
// const {getAllSellers,getOneSellerUserNameOnly,deleteOneSeller,createNewSeller} = require('../func/dbFunction-sql/sellerFunc');

const {getAllProductArrayForm} = require('../func/common/productFunc');
const {getAllSellers,createNewSeller} = require('../func/common/sellerFunc');

//* getAllSellers   :-> select * from user where role = 'seller';
//* getAllProduct   :-> select * from product;
//* deleteSeller    :-> update user set active = 0 where userName = '' and role = 'seller';
//* deleteAllProduct:-> update product set active = 0 where sellerUser = 'sellerUserName';
//* deleteSingleProduct :-> update product set active = 0 where productId = '';

router.route('/')
.get(async (req,res)=>{
    let err = req.session.err;
    if(err != undefined){
        delete req.session.err;
    }
    let sellers;
    let allProduct;
    try{
        sellers = await getAllSellers();
        allProduct = await getAllProductArrayForm({});
        let commpleteList = getList(sellers,allProduct);
        res.render('adminDashboard',{"userType":req.session.userType,"user":req.session.user,"err":err,"sellers":commpleteList});
    }
    catch(err){
        res.statusCode = 404;
        res.setHeader('Content-Type','text/plain');
        res.send();
        return ;
    }


})


router.post('/deleteSeller',async (req,res)=>{
    let {userName} = req.body;
    try{
        let seller = await getOneSellerUserNameOnly(userName);
        console.log(seller);
        await deleteOneSeller(seller.userName);
        sendMail(seller,"Account Deletion","Info Board","<h1>Account Delete</h1><p>Your seller account is deleteed,Please contect Steam</p>",function(){})
        res.statusCode = 200;
    }
    catch(err){
        console.log(err);
        res.statusCode =500;
    }
    res.setHeader('Content-Type','text/plain');
    res.send();
})


router.route('/deleteProduct')
.post(async (req,res)=>{
    let {id} = req.body;
    let seller;
    let product;
    try{
        product = await getSingleProduct(id);
        seller = await getOneSellerUserNameOnly({"userName":product.sellerName})
    }
    catch(err){
        console.log(err);
    }
    sendMail(seller,"Product Deleted",`Product Deleted`,`<h1>Product Deleted</h1><p>Your product with name ${product.title} is deleted Content Steam for process of reinitiation of your accout.</p>`,async function(){
        try{
            await deleteSingleProduct(product.ProductId);
            res.statusCode = 200;
            res.send();
        }
        catch(err){
            console.log(err);
            res.statusCode = 404;
            res.send();
        }
    })
})


router.route('/newSeller')
.get((req,res)=>{
    res.render('newSeller');
})
.post(async (req,res)=>{
    console.log(req.body);
    let {email} = req.body;
    let  userCreateKey
    try{
        userCreateKey = await createNewSeller(email);
        
        if(userCreateKey!=null){
            sendInvitationMail(email,userCreateKey,async function(err){
                if(!err){
                    res.statusCode = 200;
                    res.send();
                }else{
                    res.statusCode = 402;
                    res.send();
                }
            });
        }
    }
    catch(err){
        console.log(err);
        if(err.message == 'User Already Exists'){
            res.statusCode = 409;
        }else{
            res.statusCode = 500;
        }
        res.send();
    }
});


function getList(sellers,products){
    let result = {};
    try{
        sellers.forEach((seller)=>{
            let obj = {};
            obj.userName = seller.userName;
            obj.product = [];
            result[obj.userName] = obj;
        })
    
        products.forEach((product)=>{
            result[product.sellerName].product.push(product);
        })

    }
    catch(err){
        throw err;
    }
    return result;
}


module.exports = router;