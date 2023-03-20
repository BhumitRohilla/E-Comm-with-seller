const express = require('express');
const { getUserOrder } = require('../func/dbFunction/userOrderList');
const router = express.Router();

router.route('/')
.get(async (req,res)=>{
    let order ;
    try{
        order = await getUserOrder(req.session.user.userName);
    }
    catch(err){
        console.log(err);
        res.statusCode = 500;
        res.send("Server Error");
        return ;
    }
    res.render('order',{userType:req.session.userType,user:req.session.user,order});
})

module.exports = router;