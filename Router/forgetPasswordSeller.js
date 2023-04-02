const express = require('express');
// const { getOneSeller, updateSeller } = require('../func/dbFunction/sellerFunc');
const router = express.Router();


const forgetPasswordGet = require('../Controller/GET/forgetPassword.controller')
const forgetPasswordPost = require('../Controller/POST/forgetPassword.controller')

//* select * from user where email = ''        getUser;
//* update user set passwordChange = '' and email = '';



router.route('/')
.get((req,res)=>{
    res.render('forget');
})
.post(forgetPasswordPost.forgetPasswordSeller);



router.route("/change/:key")
.get(forgetPasswordGet.forgetPasswordChangeSeller);


module.exports = router;