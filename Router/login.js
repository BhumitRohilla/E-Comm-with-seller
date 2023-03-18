const express = require('express');
const router = express.Router();


//db function
const {getUser} = require('../func/dbFunction/userFunc');

router.route('/')
.get((req,res)=>{
    res.render('login',{'userType': req.session.userType ,"user": req.session.user});
})
.post(async (req,res)=>{
    let userName = req.body.userValue;
    let password = req.body.pass;
    try{
        let data = await getUser({userName,password})
        if(data == null){
            res.statusCode = 401;
            res.end();
            return ;
        }
        req.session.is_logged_in=true;
        req.session.user = data;
        if(userName === 'admin'){
            req.session.userType = 'admin';
        }else{
            req.session.userType = 'user';
        }
        res.statusCode = 200;
        res.setHeader('Content-Type','text/plain')
        res.end();
    }
    catch(err){
        console.log(err);
        res.statusCode = 404;
        res.setHeader('Content-Type','text/plain')
        res.end();
    }
})

module.exports = router;