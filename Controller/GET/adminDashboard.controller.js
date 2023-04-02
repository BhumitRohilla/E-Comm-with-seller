
const {getAllProductArrayForm,getSingleProduct, deleteSingleProduct,} = require('../../Services/common/productFunc');
const {getAllSellers,createNewSeller,getOneSellerUserNameOnly,deleteOneSeller} = require('../../Services/common/sellerFunc');



async function showAdminPannel(req,res){
    let err = req.session.err;
    if(err != undefined){
        delete req.session.err;
    }
    let sellers;
    let allProduct;
    try{
        sellers = await getAllSellers();
        allProduct = await getAllProductArrayForm({});
        let commpleteList = getList(sellers,allProduct);
        res.render('adminDashboard',{"userType":req.session.userType,"user":req.session.user,"err":err,"sellers":commpleteList});
    }
    catch(err){
        res.statusCode = 404;
        res.setHeader('Content-Type','text/plain');
        res.send();
        return ;
    }
}




module.exports = {showAdminPannel};



function getList(sellers,products){
    let result = {};
    try{
        sellers.forEach((seller)=>{
            let obj = {};
            obj.userName = seller.userName;
            obj.product = [];
            result[obj.userName] = obj;
        })
    
        products.forEach((product)=>{
            if(result[product.sellerName] == undefined){
                deleteSingleProduct(product.ProductId);
            }else{
                result[product.sellerName].product.push(product);
            }
        })

    }
    catch(err){
        throw err;
    }
    return result;
}
