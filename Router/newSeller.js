const express = require('express');
const { getOneSeller, updateSeller } = require('../func/sellerFunc');
const router  = express.Router();

router.route('/:key')
.get(async (req,res)=>{
    let {key} = req.params;
    let sellerDetails;
    try{
        sellerDetails = await getOneSeller({'userCreateKey':key});
        // console.log(sellerDetails);
    }
    catch(err){
        res.statusCode = 404;
        res.send();
        return ;
    }
    if(sellerDetails == null){
        res.send('Invalid Link');
        return ;
    }
    res.render('newSeller',({'email':sellerDetails.email}));
})
.post(async (req,res)=>{
    let {key} = req.params;
    let {userName,name,password} = req.body;
    let sellerDetails ;
    try{
        if(userName == "" || name == "" || password == "" ){
            res.statusCode = 303;
        }else{
            let data = {userName,name,password};
            data.userCreateKey = null ;
            sellerDetails = await getOneSeller({'userCreateKey':key});
            if(sellerDetails == null){
                res.statusCode = 404;
            }else{
                await updateSeller({'userCreateKey':key},data);
                res.statusCode = 200;
            }
        }
    }
    catch(err){
        console.log(err);
        res.statusCode = 500;
    }
    res.setHeader('Content-Type','text/plain');
    res.send();
});


module.exports = router;