const express = require('express');
const router = express.Router();


//Controller
const productController = require('../Controller/GET/product.controller');
const cartController    = require('../Controller/GET/cart.controller');


router.route('/')
.get(productController.showProductInitial);

router.get('/showMore', productController.showMoreProduct);

router.get('/getProductValue/:id',productController.getProductValue);

router.get('/buyProduct/:pid',cartController.buyProduct);



module.exports = router;