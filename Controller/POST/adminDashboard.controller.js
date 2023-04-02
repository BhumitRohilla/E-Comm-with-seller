const {getSingleProduct, deleteSingleProduct,} = require('../../Services/common/productFunc');
const {createNewSeller,getOneSellerUserNameOnly,deleteOneSeller} = require('../../Services/common/sellerFunc');
const sendMail = require('../../func/sendMail');
const sendInvitationMail = require('../../func/sendInvitationMail');

async function deleteProductController(req,res){
    let {id} = req.body;
    let seller;
    let product;
    try{
        product = await getSingleProduct(id);
        seller = await getOneSellerUserNameOnly(product.sellerName);
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
}


async function deleteSellerController(req,res){
    let {userName} = req.body;
    try{
        let seller = await getOneSellerUserNameOnly(userName);
        await deleteOneSeller(seller.userName);
        sendMail(seller,"Account Deletion","Info Board","<h1>Account Delete</h1><p>Your seller account is deleteed,Please contect Steam</p>",function(){})
        res.statusCode = 200;
    }
    catch(err){
        res.statusCode =500;
    }
    res.setHeader('Content-Type','text/plain');
    res.send();
}


async function newSellerController(req,res){
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
}


module.exports = {deleteProductController,deleteSellerController,newSellerController};