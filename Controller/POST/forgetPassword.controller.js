const sendMail = require("../../func/sendMail");

const sellerDbFunction = require("../../Services/common/sellerFunc");
const userDbFunction = require("../../Services/common/userFunction");



async function forgetPassword(req,res){
    let {email} = req.body;
    try{
        let data = await userDbFunction.getUser({email});
        if(data === null){
            res.statusCode = 403;
            res.end();
            return ;
        }
        try{
            let key = await userDbFunction.updatePasswordChangeToken(email);
            sendMail(data,"Password Reset","Change Password",`<h1>Reset Password</h1><p>Use <a href="http://${process.env.HOSTNAME}:${process.env.PORT}/forgetPassword/change/${key}">THIS</a> link to reset password </p>`,function(){    
                res.statusCode = 200;
                res.send();
                return ;
            });
        }
        catch(err){
            console.log(err);
            res.statusCode = 404;
            res.send();
            return ;
        }
    }
    catch(err){
        res.statusCode = 404;
        res.end();
        console.log(err);
    }
}



async function forgetPasswordSeller(req,res){
    let {email} = req.body;
    try{
        let seller = await sellerDbFunction.getOneSeller({email});
        if(seller == null){
            res.statusCode = 403;
            res.end();
            return ;
        }else{
            let token = await sellerDbFunction.updatePasswordChangeToken(email)
            sendMail(seller,"Password Reset Seller","Change Password",`<h1>Reset Password</h1><p>Use <a href="http://${process.env.HOSTNAME}:${process.env.PORT}/forgetPasswordSeller/change/${token}">THIS</a> link to reset password </p>`,function(){    
                res.statusCode = 200;
                res.send();
            });
        }
    }
    catch(err){
        console.log(err);
        res.statusCode = 500;
        res.end();
        return ;
    }  
}

module.exports = {forgetPassword,forgetPasswordSeller};


