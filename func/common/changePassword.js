const sql = require('../dbFunction-sql/userFunc')
const mongoUser = require('../dbFunction/userFunc');
const mongoSeller = require('../dbFunction/sellerFunc');

function changePassword(userName,password,userType){
    let result;
    if(process.env.USESQL == 'true' ){
        result = sql.changePassword(userName,password);
    }else{
        if(userType == 'user' ){
            result = mongoUser.changePassword(userName,password);
        }else{
            result = mongoSeller.changePassword(userName,password);
        }
    }
    return result;
}

module.exports = {changePassword};