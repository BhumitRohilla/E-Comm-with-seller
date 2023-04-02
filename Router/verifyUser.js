const express = require('express');
const router = express.Router();


//Controller
const verfiyUserGet = require('../Controller/GET/verifyUser.controller');


router.get('/:key',verfiyUserGet.verifyUserController);

module.exports = router;