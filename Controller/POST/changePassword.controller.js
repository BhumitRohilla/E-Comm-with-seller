const sendMail = require("../../func/sendMail");
const { changePassword } = require("../../Services/common/userFunction");

async function changePasswordController(req,res){
    let {password} = req.body;
    password = password.trim();
    if(password == ""){
        res.statusCode = 404;
        res.send();
        return ;
    }
    let user = req.session.user;
    let userType =  req.session.userType;
    //TODO: Lower priority move it into it's own function
    try{
        await changePassword(user.userName,password,userType);
        if(userType == 'seller'){
            sendMail(user,"Password Change Seller","Info Board","<h1>Password Change</h1><p>Your password has been changed</p>",function(){
                res.statusCode = 200;
                res.setHeader('Content-Type','text/plain');
                res.send();
            })
        }
        if(userType == 'user'){
            sendMail(user,"Password Change","Info Board","<h1>Password Change</h1><p>Your password has been changed</p>",function(){
                res.statusCode = 200;
                res.setHeader('Content-Type','text/plain');
                res.send();
            })
        }
        req.session.destroy();
    }
    catch(err){
        console.log(err);
        res.statusCode = 500;
    }
}

module.exports = {changePasswordController};