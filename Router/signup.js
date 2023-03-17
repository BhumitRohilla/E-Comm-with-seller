const express = require('express');
const router = express.Router();
const userAuth = require('../middleware/userAuth');
const {insertUser} = require('../func/userFunc');
const crypto = require('crypto');
const sendVerificationMail = require('../func/sendVerificationMail');

router.route('/')
.get(userAuth,(req,res)=>{
    res.render('signup',{'userType':req.session.userType,'user':req.session.user});
})
.post(async (req,res)=>{
    let {name,userName,password,email} = req.body;
    let user={
        name,userName,password,email,isVarified: false,key: crypto.randomBytes(5).toString('hex'),passwordChange: null
    }
    try{
        await insertUser(user);
        sendVerificationMail(user,function(err){
            if(!err){
                res.statusCode = 200;
                res.setHeader('Content-Type','text/plain')
                res.end();
            }else{
                res.statusCode = 303;
                res.setHeader('Content-Type','text/plain');
                res.end();
            }
        });
    }
    catch(err){
        console.log(err);
        switch(err){
            case 401:
                res.statusCode = 401;
                break;
            case 404:
                res.statusCode = 404;
                break;
            default:
                res.statusCode = 500;
                break;
        }
        res.send();
    }
})


module.exports = router;