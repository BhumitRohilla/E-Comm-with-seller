const express = require('express');
const router = express.Router();
// const {verifyUser} = require('../func/dbFunction/userFunc')

/**
 ** update user set is_varified = 1 where [key] = "";
 */


// const {verifyUser} = require('../func/dbFunction-sql/userFunc');

const {verifyUser} = require('../func/common/userFunction');

router.get('/:key',(req,res)=>{
    let filter = {'key':req.params.key};
    verifyUser(filter)
    .then(()=>{
        req.session.destroy();
        res.redirect('/login');
    })
    .catch((err)=>{
        console.log(err);
        res.send("Error Occur");
    })
})


module.exports = router;