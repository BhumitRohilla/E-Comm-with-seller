const { verifyUser } = require("../../Services/common/userFunction");

function verifyUserController(req,res){
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
}

module.exports = {verifyUserController};