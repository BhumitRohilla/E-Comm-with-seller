const express = require('express');
const router = express.Router();
const userAuth = require('../middleware/userAuth');

//Controller
const signUppost = require('../Controller/POST/signup.controller');

//* select * from user where userName = '' and password = '';
/**
 **  insert into user(userName,password,email,is_varified,passwordChange,active,role)
 **  values(userName,password,email,is_varified,passwordChnage,active,role);
 */

router.route('/')
.get(userAuth,(req,res)=>{
    res.render('signup',{'userType':req.session.userType,'user':req.session.user});
})
.post(signUppost.SignUp)

module.exports = router;