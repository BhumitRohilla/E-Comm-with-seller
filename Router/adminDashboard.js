const express = require('express');
const { getAllProductArrayForm, deleteMultipleProduct, getSingleProduct, deleteSingleProduct } = require('../func/productFunc');
const { getAllSellers, deleteOneSeller, getOneSeller, createNewSeller } = require('../func/sellerFunc');
const sendMail = require('../func/sendMail');
const router = express.Router();
const crypto = require('crypto');
const sendInvitationMail = require('../func/sendInvitationMail');


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
    }
    catch(err){
        res.statusCode = 404;
        res.setHeader('Content-Type','text/plain');
        res.send();
    }

    let commpleteList = getList(sellers,allProduct);

    res.render('adminDashboard',{"userType":req.session.userType,"user":req.session.user,"err":err,"sellers":commpleteList});
})


router.post('/deleteSeller',async (req,res)=>{
    let {userName} = req.body;
    try{
        let sellerDetails = await getOneSeller({'userName':userName});
        await deleteOneSeller({userName});
        await deleteMultipleProduct({"sellerId":sellerDetails.id});
        sendMail(sellerDetails,"Account Deletion","Info Board","<h1>Account Delete</h1><p>Your seller account is deleteed,Please contect Steam</p>",function(){})
        res.statusCode = 200;
        res.send();
    }
    catch(err){
        console.log(err);
        res.statusCode = 500;
        res.send();
    }
    res.send();
})


router.route('/deleteProduct')
.post(async (req,res)=>{
    let {id} = req.body;
    let product = await getSingleProduct(id);
    let seller = await getOneSeller({"id":product.sellerId})
    sendMail(seller,"Product Deleted",`Product Deleted`,`<h1>Product Deleted</h1><p>Your product with name ${product.title} is deleted Content Steam</p>`,async function(){
        try{
            await deleteSingleProduct(product.id);
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
    let {email} = req.body;
    let sellerCheck;
    try{
        sellerCheck = await getOneSeller({email});
    }
    catch(err){
        console.log(err);
        res.statusCode = 500;
        res.send();
    }
    if(sellerCheck != null){
        res.statusCode = 409;
        res.send();
    }else{
        try{
            let userCreateKey = crypto.randomBytes(6).toString('hex');
            sendInvitationMail(email,userCreateKey,async function(err){
                if(!err){
                    await createNewSeller(email,userCreateKey);
                    res.statusCode = 200;
                    res.send();
                }else{
                    res.statusCode = 403;
                    res.send();
                }
            })
            
        }
        catch(err){
            console.log(err);
            res.statusCode = 500;
            res.send();
        }
    }
});


function getList(sellers,products){
    let result = {};
    sellers.forEach((seller)=>{
        let obj = {};
        obj.sellerId = seller.id;
        obj.userName = seller.userName;
        obj.product = [];
        result[obj.sellerId] = obj;
    })

    products.forEach((product)=>{
        result[product.sellerId].product.push(product);
    })

    return result;
}


module.exports = router;