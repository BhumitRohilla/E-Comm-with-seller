const express = require('express');
const router = express.Router();
const crypto = require('crypto');
// const { getUser, updatePasswordChangeToken } = require('../func/dbFunction/userFunc');
const { getUser, updatePasswordChangeToken, removePasswordChangeToken } = require('../func/dbFunction-sql/userFunc');
const sendMail = require('../func/sendMail');


//* select * from user where email = ''        getUser;
//* update user set passwordChange = '' and email = '';


router.route('/')
.get((req,res)=>{
    res.render('forget');
})
.post(async (req,res)=>{
    let {email} = req.body;
    try{
        let data = await getUser({email});
        if(data === null){
            res.statusCode = 403;
            res.end();
            return ;
        }
        try{
            let key = await updatePasswordChangeToken(email);
            sendMail(data,"Password Reset","Change Password",`<h1>Reset Password</h1><p>Use <a href="http://${process.env.HOSTNAME}:${process.env.PORT}/forgetPassword/change/${key}">THIS</a> link to reset password </p>`,function(){    
                res.statusCode = 200;
                res.send();
                return ;
            });
        }
        catch(err){
            console.log(err);
            res.statusCode = 404;
            res.send();
            return ;
        }
    }
    catch(err){
        res.statusCode = 404;
        res.end();
        console.log(err);
    }
})


router.get("/change/:key",async (req,res)=>{
    let {key} = req.params;
    console.log(key);
    let user;
    try{
        user = await getUser({'passwordChange':key});
        if(user != null){
            req.session.is_logged_in = true;
            req.session.user = user;
            req.session.userType = 'user';
            await removePasswordChangeToken(user.email);
        }
        res.redirect("/changePassword");
    }
    catch(err){
        console.log(err);
        res.statusCode = 404;
        res.send();
        return;
    }
    // readFile('./userData.json',function(err,data){
    //     if(!err){
    //         data = JSON.parse(data);
    //         let user ;
    //         data.forEach((element)=>{
    //             if(element.changePasswordToken == key){
    //                 user = element;
    //             }
    //         })
    //         if(user!=null){
    //             req.session.userName = user.userName;
    //             req.session.is_logged_in = true;
    //             req.session.isVarified = true;
    //             res.redirect('/changePassword');
    //         }
    //     }
    // })
})


module.exports = router;