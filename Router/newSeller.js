const express = require('express');
// const { getOneSeller, updateSeller } = require('../func/dbFunction/sellerFunc');
const router  = express.Router();

// const { getOneSeller,createNewSellerFinal } = require('../func/dbFunction-sql/sellerFunc');
const {getOneSeller,createNewSellerFinal} = require('../func/common/sellerFunc')

//* select * from user where key = '';
//* insert into user(userName,password,email,is_varified,passwordChange,active,role,key) values(userName,password,email,1,NULL,1,'seller',NULL);


router.route('/:key')
.get(async (req,res)=>{
    let {key} = req.params;
    let sellerDetails;
    try{
        sellerDetails = await getOneSeller({'userCreateKey':key});
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
        }
        else if(userName == 'admin'){
            throw 409;
        }else{
            let data = {userName,name,password};
            data.userCreateKey = null ;
            sellerDetails = await getOneSeller({'userCreateKey':key});
            if(sellerDetails == null){
                res.statusCode = 404;
            }else{
                await createNewSellerFinal({'userCreateKey':key},data,sellerDetails.email)
                // await updateSeller({'userCreateKey':key},data);
                res.statusCode = 200;
            }
        }
    }
    catch(err){
        if(err.message == 'User Already Exists'){
            res.statusCode = 409;
        }else{
            res.statusCode = 500;
        }
        console.log(err);
    }
    res.setHeader('Content-Type','text/plain');
    res.send();
});


module.exports = router;