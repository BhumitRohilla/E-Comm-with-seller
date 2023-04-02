const express = require('express');
const router = express.Router();
// const { getUser, updatePasswordChangeToken } = require('../func/dbFunction/userFunc');
// const { getUser, updatePasswordChangeToken, removePasswordChangeToken } = require('../func/dbFunction-sql/userFunc');

//* select * from user where email = ''        getUser;
//* update user set passwordChange = '' and email = '';


const forgetPasswordGet = require('../Controller/GET/forgetPassword.controller')
const forgetPasswordPost = require('../Controller/POST/forgetPassword.controller')

router.route('/')
.get((req,res)=>{
    res.render('forget');
})
.post(forgetPasswordPost.forgetPassword);

router.get("/change/:key",forgetPasswordGet.forgetPasswordChange);


module.exports = router;