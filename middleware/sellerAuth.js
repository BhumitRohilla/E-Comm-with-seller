function sellerAuth(req,res,next){
    if(req.session.userType === 'seller' && req.session.user.active){
        next();
    }else if(req.session.userType === 'seller'){
        res.render('errPage',({userType:'seller',user:req.session.user,error:"YOUR ACCOUT IS SUSPENDED. CONTENT STEAM SUPPORT!!"}));
    }
    else{
        res.redirect('/');
    }
}

module.exports = sellerAuth;