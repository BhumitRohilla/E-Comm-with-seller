const express = require('express');
const post = require('../Controller/POST/login.controller');
const userAuth = require('../middleware/userAuth');
const router = express.Router();

router.route('/')
.get(userAuth,(req,res)=>{
    res.render('sellerLogin',{'userType':req.session.userType,"user":req.session.user});
})
.post(post.loginSeller)


module.exports = router;