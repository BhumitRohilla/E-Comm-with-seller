const express = require('express');
// const { getOneSeller, updateSeller } = require('../func/dbFunction/sellerFunc');
const router = express.Router();
const crypto = require('crypto');
const sendMail = require('../func/sendMail');
const {getOneSeller,updatePasswordChangeToken,removePasswordChangeToken} = require('../func/common/sellerFunc');

//* select * from user where email = ''        getUser;
//* update user set passwordChange = '' and email = '';



router.route('/')
.get((req,res)=>{
    res.render('forget');
})
.post(async (req,res)=>{
    let {email} = req.body;
    try{
        let seller = await getOneSeller({email});
        if(seller == null){
            res.statusCode = 403;
            res.end();
            return ;
        }else{
            //seller.passwordChange = crypto.randomBytes(6).toString('hex');
            let token = await updatePasswordChangeToken(email)
            // await updateSeller({email},{"passwordChange":seller.passwordChange});
            sendMail(seller,"Password Reset Seller","Change Password",`<h1>Reset Password</h1><p>Use <a href="http://${process.env.HOSTNAME}:${process.env.PORT}/forgetPasswordSeller/change/${token}">THIS</a> link to reset password </p>`,function(){    
                res.statusCode = 200;
                res.send();
            });
        }
    }
    catch(err){
        console.log(err);
        res.statusCode = 500;
        res.end();
        return ;
    }  
})



router.route("/change/:key")
.get(async (req,res)=>{
    let {key}  = req.params;
    try{
        let seller = await getOneSeller({"passwordChange":key});
        if(seller == null){
            res.render('errPage',{userType:req.session.userType,user:req.session.user,error:"Invalid Link"});
            return ;
        }else{
            // await updateSeller({"passwordChange":key},{"passwordChange":null});
            await removePasswordChangeToken(seller.email);
            console.log(seller)
            req.session.is_logged_in = true;
            req.session.userType = 'seller';
            req.session.user = seller;
            res.statusCode = 200;
            res.redirect('/changePassword');
            return ;
        }
    }
    catch(err){
        console.log(err);
        res.setHeader('Content-Type','text/plain');
        res.statusCode = 500;
        res.send();
        return ;
    }
})


module.exports = router;