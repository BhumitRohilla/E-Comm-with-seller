const sellerDbFunction = require("../../Services/common/sellerFunc");
const userDbFunction = require("../../Services/common/userFunction");


async function forgetPasswordChange(req,res){
    let {key} = req.params;
    let user;
    try{
        if(req.session.is_logged_in){req.session.destory();}
        user = await userDbFunction.getUser({'passwordChange':key});
        if(user === null){
            res.render('errPage',{userType:req.session.userType,user:req.session.user,error:"Invalid Link"});   
        }
        else{
            req.session.is_logged_in = true;
            req.session.user = user;
            req.session.userType = 'user';
            await userDbFunction.removePasswordChangeToken(user.email);
            res.redirect("/changePassword");
        }
    }
    catch(err){
        console.log(err);
        res.statusCode = 404;
        res.send();
        return;
    }
}


async function forgetPasswordChangeSeller(req,res){
    let {key}  = req.params;
    try{
        if(req.session.is_logged_in){req.session.destory();}
        let seller = await sellerDbFunction.getOneSeller({"passwordChange":key});
        if(seller == null){
            res.render('errPage',{userType:req.session.userType,user:req.session.user,error:"Invalid Link"});
            return ;
        }else{
            await sellerDbFunction.removePasswordChangeToken(seller.email);
            req.session.is_logged_in = true;
            req.session.userType = 'seller';
            req.session.user = seller;
            res.statusCode = 200;
            res.redirect('/changePassword');
            return ;
        }
    }
    catch(err){
        console.log(err);
        res.setHeader('Content-Type','text/plain');
        res.statusCode = 500;
        res.send();
        return ;
    }
}

module.exports = {forgetPasswordChange,forgetPasswordChangeSeller};