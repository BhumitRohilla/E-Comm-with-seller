function changePasswordAuth(req,res,next){
    if(req.session.userType === undefined){
        res.redirect('/');
    }else if( req.session.userType === 'seller' || req.session.userType === 'user'){
        next();
    }
}

module.exports = changePasswordAuth;