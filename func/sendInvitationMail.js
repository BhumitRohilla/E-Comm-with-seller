require('dotenv').config();
const mailAPI = require('./mailAPI');
//email,subject,text,html,callback
function sendInvitationMail(email,userCreateKey,callback){
    const subject = 'Invitation'
    const text = 'This is text'
    const html = `<h1>Welcome Seller</h1> <p>Please use this link to create account <a href="http://${process.env.HOSTNAME}:${process.env.PORT}/newSeller/${userCreateKey}">ClickHere</a></p>`;
    mailAPI(email,subject,text,html,callback);
}

module.exports = sendInvitationMail;