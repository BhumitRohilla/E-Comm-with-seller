function homeAuth(req,res,next){
    if(req.session.is_logged_in && req.session.userType === 'admin'){
        next();
    }else if(req.session.is_logged_in && req.session.userType === 'seller'){
        res.redirect('/sellerPage');
    }else if(req.session.is_logged_in && req.session.userType === 'user' && req.session.user.isVarified){
        next();
    }
    else if(req.session.is_logged_in){
        res.statusCode = 401;
        // res.send("Please Varify Your Account");
        res.render('errPage',({"userType":req.session.userType,"user":req.session.user,"error":"Your Accout Is Not Varified!"}));
    }else{
        res.redirect('/login');
    }
}

module.exports = homeAuth;