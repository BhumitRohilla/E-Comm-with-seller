const express = require('express');
// const { getUserOrder } = require('../func/dbFunction/userOrderList');

const {getUserOrder} = require('../Services/common/userOrderList');
const router = express.Router();


//* getUserOrder    :->  NO select (select productId,quantity from order_item where order_item) from order where userName = '' role = 'user';
//* select (select productId,sellerUser,title,DateOfRelease,status,userReview,Img,active from product where productId = order.productId),quantity from order_item where orderId in (select orderId from order where userName = '');

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