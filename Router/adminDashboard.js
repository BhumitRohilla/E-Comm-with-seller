const express = require('express');
const router = express.Router();



const adminDashboardGet = require('../Controller/GET/adminDashboard.controller');
const adminDashboardPost = require('../Controller/POST/adminDashboard.controller');
// const {getAllProductArrayForm,deleteSingleProduct,getSingleProduct} = require('../func/dbFunction-sql/productFunc');
// const {getAllSellers,getOneSellerUserNameOnly,deleteOneSeller,createNewSeller} = require('../func/dbFunction-sql/sellerFunc');

//* getAllSellers   :-> select * from user where role = 'seller';
//* getAllProduct   :-> select * from product;
//* deleteSeller    :-> update user set active = 0 where userName = '' and role = 'seller';
//* deleteAllProduct:-> update product set active = 0 where sellerUser = 'sellerUserName';
//* deleteSingleProduct :-> update product set active = 0 where productId = '';

router.route('/')
.get(adminDashboardGet.showAdminPannel);

router.post('/deleteSeller',adminDashboardPost.deleteSellerController )

router.route('/deleteProduct').post(adminDashboardPost.deleteProductController);

router.route('/newSeller')
.get((req,res)=>{
    res.render('newSeller');
})
.post(adminDashboardPost.newSellerController);


module.exports = router;