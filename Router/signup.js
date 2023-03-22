const express = require('express');
const router = express.Router();
const userAuth = require('../middleware/userAuth');
// const {insertUser} = require('../func/dbFunction/userFunc');
const {insertUser} = require('../func/dbFunction-sql/userFunc');
const crypto = require('crypto');
const sendVerificationMail = require('../func/sendVerificationMail');


//* select * from user where userName = '' and password = '';
/**
 **  insert into user(userName,password,email,is_varified,passwordChange,active,role)
 **  values(userName,password,email,is_varified,passwordChnage,active,role);
 */

router.route('/')
.get(userAuth,(req,res)=>{
    res.render('signup',{'userType':req.session.userType,'user':req.session.user});
})
.post(async (req,res)=>{
    let {name,userName,password,email} = req.body;
    let user={
        name,userName,password,email,isVarified: false,key: crypto.randomBytes(6).toString('hex'),passwordChange: null
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