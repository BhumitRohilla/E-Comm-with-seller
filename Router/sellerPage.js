const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({'dest':'public/image/product/'});
const path = require('path');


// Controller
const sellerPageGet = require('../Controller/GET/sellerPage.controller');
const sellerPagePost = require('../Controller/POST/sellerPage.controller');

router.use(express.json());

router.route('/')
.get(sellerPageGet.sellerPageShow);

router.route('/addNewProduct/:key')
.get((req,res)=>{
    let {key} = req.params;
    res.render('newProductPage',({"action":`/sellerPage/addNewProduct/${key}`}));
})
.post(upload.single("product-img")  ,sellerPagePost.addNewProduct)


router.route('/updateProduct/:pid')
.get(sellerPageGet.updateProductShow)
.post(upload.single('product-img'),sellerPagePost.updateProductController);

router.post('/deleteProduct',sellerPagePost.deleteProduct);

router.route('/order').get(sellerPageGet.showOrders)

router.post('/order/reject/:key',sellerPagePost.orderRejected)

router.post('/order/accept/:key',sellerPagePost.orderAccepted);

module.exports = router;
