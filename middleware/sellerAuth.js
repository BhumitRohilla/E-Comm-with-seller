function sellerAuth(req,res,next){
    if(req.session.userType === 'seller'){
        next();
    }else{
        res.redirect('/');
    }
}

module.exports = sellerAuth;