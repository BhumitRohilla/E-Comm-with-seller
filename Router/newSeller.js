const express = require('express');
const router  = express.Router();

const sellerPageControllerGet = require('../Controller/GET/newSeller.controller');
const sellerPageControllerPost = require('../Controller/POST/newSeller.controller');

//* select * from user where key = '';
//* insert into user(userName,password,email,is_varified,passwordChange,active,role,key) values(userName,password,email,1,NULL,1,'seller',NULL);


router.route('/:key')
.get(sellerPageControllerGet.newSellerPageShow)
.post(sellerPageControllerPost.newSellerPage);


module.exports = router;