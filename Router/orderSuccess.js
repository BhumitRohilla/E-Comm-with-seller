const express = require('express');
const { paymentSuccess } = require('../func/common/orderFunction');
const router = express.Router();

router.get('/:key',async (req,res)=>{
    let {key} = req.params;
    console.log(key);
    try{
        let successOrder = await paymentSuccess(key);
        if(successOrder){
            res.render('thanks');
        }else{
            res.render('errPage',({userType:req.session.userType,user:req.session.user,error:"Invalid Link"}));
        }
    }
    catch(err){
        res.render('errPage',({userType:req.session.userType,user:req.session.user,error:`Server error occure please contect support with orderId = ${key}`}));
    }  
})

module.exports = router;