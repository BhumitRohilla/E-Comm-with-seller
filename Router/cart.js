const express = require('express');
const router = express.Router();

//Controller
const cartControllerGet = require('../Controller/GET/cart.controller');
const cartControllerPost = require('../Controller/POST/cart.controller');


router.route('/').get(cartControllerGet.showCart)

router.route('/buyProduct/:pid',cartControllerGet.buyProduct);

router.get('/removeProduct/:pid',cartControllerGet.removeOneProduct);

router.post('/orderPlacement',cartControllerPost.orderPlacement);

router.get('/deleteProduct/:pid',cartControllerGet.deleteProduct);

router.get('/getPrice',cartControllerGet.getPriceOfCart);

module.exports = router;