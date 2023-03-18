const express = require('express');
const { getUserOrder } = require('../func/dbFunction/userOrderList');
const router = express.Router();

router.route('/')
.get(async (req,res)=>{
    let order = await getUserOrder(req.session.user.userName);
    console.dir(order, { depth: null })
    res.render('order',{userType:req.session.userType,user:req.session.user,order});
})
.post((req,res)=>{

})

module.exports = router;