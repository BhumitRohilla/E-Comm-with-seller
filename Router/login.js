const express = require('express');
const router = express.Router();

//Controller
const loginPost = require('../Controller/POST/login.controller');

router.route('/')
.get((req,res)=>{
    res.render('login',{'userType': req.session.userType ,"user": req.session.user});
})
.post(loginPost.loginUser);

module.exports = router;