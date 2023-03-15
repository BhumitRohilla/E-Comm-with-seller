function forgetPasswordAuth(req,res,next){
    if(req.session.userType === undefined){
        next();
    }else{
        res.redirect('/changePassword');
    }
}

module.exports = forgetPasswordAuth;