const { newConnectionSQL } = require('../db/dbConnectionSQL');
const { getSingleProduct } = require('./productFunc');

async function getUserOrder(userName){
    //! Not compatible with mongo :-> `select quantity,OrderId,Product.* from Order_Item  inner join (select Product.*,tag , [about-game] from Product join ( select Product_Tag.*,[about-game] from Product_Tag inner join About_Product on Product_Tag.ProductId = About_Product.ProductId) as c1 on Product.ProductId = c1.productId ) as Product on Order_Item.ProductId = Product.ProductId where OrderId in (select OrderId from Orders where userName = 'bhumit');`;
    let query = `select Orders.*,ProductId,quantity,resolve,status,price from Orders inner join Order_Item on Orders.OrderId = Order_Item.OrderId where userName = '${userName}';`
    let result = await newConnectionSQL(query);
    let order = {};
    let length = result.length
    //TODO: Find a way to execute them paralleley;
    for(let i=0;i<length;++i){
        order[result[i].OrderId] = result[i];
        order[result[i].OrderId].product = {};
        Object.assign(order[result[i].OrderId].product,await getSingleProduct(result[i].ProductId));
        delete order.ProductId;
    }
    console.log(result);
    return order;
}

module.exports = {getUserOrder};