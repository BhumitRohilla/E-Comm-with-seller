const express = require('express');
const router = express.Router();

router.get('/:key',(req,res)=>{
    res.render('thanks');
})