const { getOneSeller } = require("../../Services/common/sellerFunc");

async function newSellerPageShow(req,res){
    let {key} = req.params;
    let sellerDetails;
    try{
        sellerDetails = await getOneSeller({'userCreateKey':key});
    }
    catch(err){
        res.statusCode = 404;
        res.send();
        return ;
    }
    if(sellerDetails == null){
        res.render('errPage',({userType:req.session.userType,user:req.session.user,error:"Invalid Link!"}))
        return ;
    }
    res.render('newSeller',({'email':sellerDetails.email}));
}


module.exports ={newSellerPageShow};