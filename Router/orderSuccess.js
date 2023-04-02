const express = require('express');
const orderStatusControllerGet = require('../Controller/GET/orderStatus.controller');
const router = express.Router();


router.get('/:key',orderStatusControllerGet.orderSuccess);



module.exports = router;