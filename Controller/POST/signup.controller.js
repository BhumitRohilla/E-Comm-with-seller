const crypto = require('crypto');
const sendVerificationMail = require('../../func/sendVerificationMail');

const {insertUser} = require('../../Services/common/userFunction');
const { validEmail, validPassword, validUserName } = require('../../Validation/validation');


async function SignUp(req,res){
    let {name,userName,password,email} = req.body;
    let user={
        name,userName,password,email,isVarified: false,key: crypto.randomBytes(6).toString('hex'),passwordChange: null
    }
    
    if(!validEmail(user.email)){
        return res.status(400).send('Email is inValid');
    }

    if(!validUserName(user.userName)){
        return res.status(400).send('Username is invalid');
    }
    
    if(!validPassword(user.password)){
        return res.status(400).send('Password is invalid');
    }

    if(!checkPass(name,userName,password,email)){
        res.statusCode = 401;
        res.send();
        return ;
    }
    try{        
        await insertUser(user);
        sendVerificationMail(user,function(err){
            if(!err){
                res.statusCode = 200;
                res.setHeader('Content-Type','text/plain')
                res.end();
            }else{
                res.statusCode = 303;
                res.setHeader('Content-Type','text/plain');
                res.end();
            }
        });
    }
    catch(err){
        switch(err){
            case 401:
                res.statusCode = 401;
                break;
            case 402:
                res.statusCode = 402;
                break;
            case 404:
                res.statusCode = 404;
                break;
            default:
                res.statusCode = 500;
                break;
        }
        res.send();
    }
}


function checkPass(name,userName,password,email){
    if(name.trim() === '' || userName.trim() === '' || password.trim() === '' || email.trim() === '' ){
        return false;
    }
    if(userName === 'admin'){
        return false;
    }
    return true;
}


module.exports = {SignUp};