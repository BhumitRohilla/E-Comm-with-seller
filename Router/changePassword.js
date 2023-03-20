const express = require('express');
const router = express.Router();
const {updateUser} = require('../func/dbFunction/userFunc')
const {updateSeller} = require('../func/dbFunction/sellerFunc');
const sendMail = require('../func/sendMail');

router.route('/')
.get((req,res)=>{
    res.render('changePassword',{"userType":req.session.userType , 'user':req.session.user });
})
.post(async (req,res)=>{
    let {password} = req.body;
    password = password.trim();
    if(password == ""){
        res.statusCode = 404;
        res.send();
        return ;
    }
    let user = req.session.user;
    let userType =  req.session.userType;
    // console.log(user);
    // db.collection('users').updateOne({"userName":user.userName,"email":user.email},{$set:{}})
    //TODO: Lower priority move it into it's own function
    try{
        if(userType === 'user')
        {
            await updateUser({"userName":user.userName,"email":user.email},{password});
            sendMail(user,"Password Change","Info Board","<h1>Password Change</h1><p>Your password has been changed</p>",function(){
                res.statusCode = 200;
                res.setHeader('Content-Type','text/plain');
                res.send();
            })
        }else if(userType === 'seller'){
            //db.collection('collection').updateOne(filter,data);
            await updateSeller({"userName":user.userName,"email":user.email},{password});
            sendMail(user,"Password Change Seller","Info Board","<h1>Password Change</h1><p>Your password has been changed</p>",function(){
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
    // readFile('./userData.json',function(err,data){
    //     if(!err){
    //         data = JSON.parse(data);
    //         let user ;
    //         data.forEach((element)=>{
    //             if(element.userName == userName){
    //                 user = element;
    //                 element.password = password;
    //             }
    //         })
    //         writeFile('./userData.json',JSON.stringify(data),function(err){
    //             if(!err){
    //                 sendMail(user,"Password Change","Info Board","<h1>Password Change</h1><p>Your password has been changed</p>",function(){
    //                     res.statusCode = 200;
    //                     req.session.destroy();
    //                     res.setHeader('Content-Type','application/JSON');
    //                     res.send();
    //                 })   
    //             }
    //         })
    //     }
    // })
})


module.exports = router;