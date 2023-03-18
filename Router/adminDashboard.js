const express = require('express');
const { getAllProductArrayForm, deleteMultipleProduct, getSingleProduct, deleteSingleProduct } = require('../func/dbFunction/productFunc');
const { getAllSellers, deleteOneSeller, getOneSeller, createNewSeller } = require('../func/dbFunction/sellerFunc');
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
        let seller = await getOneSeller({userName});
        // console.log(seller);
        await deleteOneSeller({id:seller.id});
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
    let product = await getSingleProduct(id);
    let seller = await getOneSeller({"id":product.sellerId})
    sendMail(seller,"Product Deleted",`Product Deleted`,`<h1>Product Deleted</h1><p>Your product with name ${product.title} is deleted Content Steam for process of reinitiation of your accout.</p>`,async function(){
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
                }
            });
        }
        res.statusCode = 200;
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
    res.send();
});


function getList(sellers,products){
    let result = {};
    try{
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

    }
    catch(err){
        console.log(err);
        res.statusCode = 404;
        res.send();
    }
    return result;
}


module.exports = router;