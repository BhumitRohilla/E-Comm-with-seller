const express = require('express');
const router = express.Router();


//Controller
const changePasswordPost = require('../Controller/POST/changePassword.controller');


router.route('/')
.get((req,res)=>{
    res.render('changePassword',{"userType":req.session.userType , 'user':req.session.user });
})
.post(changePasswordPost.changePasswordController);


module.exports = router;