const { paymentSuccess,paymentFail } = require("../../Services/common/orderFunction");


async function  orderSuccess(req,res){
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
}

async function orderFail(req,res){
    let {key} = req.params;
    try{
        let orderFail = await paymentFail(key);
        if(orderFail){
            res.render('cancelled');
        }else{
            res.render('errPage',({userType:req.session.userType,user:req.session.user,error:"Invalid Link"}));
        }
    }
    catch(err){
        res.render('errPage',({userType:req.session.userType,user:req.session.user,error:`Server error occure.`}));
    }
}

module.exports = {orderSuccess,orderFail};