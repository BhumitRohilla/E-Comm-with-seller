const express = require('express');
const router = express.Router();

router.get('/:key',(req,res)=>{
    console.log(req.params.key);
    
    res.render('thanks');
})

module.exports = router;