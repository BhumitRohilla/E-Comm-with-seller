function validEmail(email){
    const emailRejex = /^[a-zA-Z0-9]+@[a-z]+.com$/;
    return emailRejex.test(email);
}


function validUserName(userName){
    const userRejex = /^[a-zA-Z_0-9]+$/;
    return userRejex.test(userName);
}


function validPassword(password){
    const passwordRejex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{8,40}$/;
    return passwordRejex.test(password);
}


module.exports = {validEmail,validPassword,validUserName};