const express = require('express');
const router = express.Router();
const {updateUser} = require('../func/userFunc')

router.get('/:key',(req,res)=>{
    let filter = {'key':req.params.key};
    updateUser(filter,{"isVarified":true})
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