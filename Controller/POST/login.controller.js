


const { getOneSeller } = require('../../Services/common/sellerFunc');
const {getUser} = require('../../Services/common/userFunction');


async function loginUser(req, res) {
  let userName = req.body.userValue;
  let password = req.body.pass;
  if (userName == null || password == null) {
    res.statusCode = 401;
    res.end();
    return;
  } else {
    if (userName === "admin" && password === process.env.ADMIN_PASS) {
      req.session.userType = "admin";
      req.session.user = { userName: "admin" };
      req.session.is_logged_in = true;
      res.statusCode = 200;
      res.end();
      return;
    }
  }
  try {
    let data = await getUser({ userName, password });
    if (data == null) {
      res.statusCode = 401;
      res.end();
      return;
    }
    req.session.is_logged_in = true;
    req.session.user = data;
    req.session.userType = "user";
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end();
  } catch (err) {
    console.log(err);
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    res.end();
  }
}

async function loginSeller(req,res){
  let {userName,password} = req.body;
  try{
      let data = await getOneSeller({userName,password})
      if(data == null){
          res.statusCode = 401;
          res.end();
          return ;
      }
      req.session.is_logged_in=true;
      req.session.userType = 'seller';
      req.session.user = data;
      res.statusCode = 200;
      res.setHeader('Content-Type','text/plain')
      res.end();
  }
  catch(err){
      console.log(err);
      res.statusCode = 401;
      res.setHeader('Content-Type','text/plain')
      res.end();
  }
}

module.exports ={loginUser,loginSeller};