const express = require('express');
const router = express.Router();


//* select * from user where userName = '' and password = '' and role = "user";


// const {getUser} = require('../func/dbFunction-sql/userFunc');

const {getUser} = require('../func/common/userFunction');

router.route('/')
.get((req,res)=>{
    res.render('login',{'userType': req.session.userType ,"user": req.session.user});
})
.post(async (req,res)=>{
    let userName = req.body.userValue;
    let password = req.body.pass;
    if(userName == null || password == null){
        res.statusCode = 401;
        res.end();
        return ;
    }else{
        if(userName === 'admin' && password === process.env.ADMIN_PASS){
            req.session.userType = 'admin';
            req.session.user = {userName:'admin'};
            req.session.is_logged_in = true;
            res.statusCode = 200;
            res.end();
            return ;
        }
    }
    try{
        
        let data = await getUser({userName,password})
        if(data == null){
            res.statusCode = 401;
            res.end();
            return ;
        }
        req.session.is_logged_in=true;
        req.session.user = data;
        req.session.userType = 'user';
        console.log(req.session.user.isVarified);
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