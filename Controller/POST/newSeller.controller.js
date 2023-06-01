const {createNewSellerFinal, getOneSeller} = require('../../Services/common/sellerFunc');
const { validUserName, validPassword } = require('../../Validation/validation');


async function newSellerPage(req,res){
    let {key} = req.params;
    let {userName,name,password} = req.body;
    let sellerDetails ;
    try{
        if(userName == "" || name == "" || password == "" ){
            res.statusCode = 303;
        }
        else if(!validUserName(userName)){
            return res.status(400).send('Username is invalid');
        }
        else if(!validPassword(password)){
            return res.status(400).send('Password is invalid');
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
};


module.exports ={newSellerPage};