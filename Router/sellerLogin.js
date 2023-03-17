const express = require('express');
const userAuth = require('../middleware/userAuth');
const router = express.Router();
const {getOneSeller} = require('../func/sellerFunc');

router.route('/')
.get(userAuth,(req,res)=>{
    res.render('sellerLogin',{'userType':req.session.userType,"user":req.session.user});
})
.post(async (req,res)=>{
    let {userName,password} = req.body;
    try{
        let data = await getOneSeller({userName,password})
        if(data == null){
            res.statusCode = 401;
            res.end();
            return ;
        }
        req.session.is_logged_in=true;
        req.session.userType = 'seller';
        req.session.user = data;
        res.statusCode = 200;
        res.setHeader('Content-Type','text/plain')
        res.end();
    }
    catch(err){
        console.log(err);
        res.statusCode = 401;
        res.setHeader('Content-Type','text/plain')
        res.end();
    }
})

module.exports = router;