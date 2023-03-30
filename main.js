require('dotenv').config();
const express = require('express');
const app = express();
const session = require('express-session');

//middleware
const userAuth = require('./middleware/userAuth')
const homeAuth = require('./middleware/homeAuth');
const adminAuth = require('./middleware/adminAuth');
const changePasswordAuth = require('./middleware/changePasswordAuth');
const forgetPasswordAuth = require('./middleware/forgetPasswordAuth');
const sellerAuth = require('./middleware/sellerAuth');


//Router
const login = require('./Router/login');
const sellerLogin = require('./Router/sellerLogin');
const signup = require('./Router/signup');
const verifyUser = require('./Router/verifyUser');
const changePassword = require('./Router/changePassword');
const product = require('./Router/product')
const forgetPassword = require('./Router/forgetPassword');
const forgetPasswordSeller = require('./Router/forgetPasswordSeller');
const cart = require('./Router/cart');
const adminDashboard = require('./Router/adminDashboard');
const sellerPage = require('./Router/sellerPage');
const newSeller = require('./Router/newSeller');
const order = require('./Router/order');


app.set('view engine','ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(session({
    secret: "bhumit rohilla",
    saveUninitialized: true,
    resave: false 
}))

app.get('/',(req,res)=>{
    res.render('root',{'userType': req.session.userType ,"user": req.session.user});
});


app.get('/home',homeAuth,(req,res)=>{
    res.redirect('product');
});


app.use('/login',userAuth,login);


app.use('/sellerLogin',sellerLogin);


app.use('/signup',signup);


app.use('/verify',verifyUser);


app.get('/logout',(req,res)=>{
    req.session.destroy();
    res.redirect('/');
})


//TODO: In generlizing need to pay attention as seller and user table is seperate in mongo
app.use('/changePassword',changePasswordAuth,changePassword);


app.use('/forgetPassword',forgetPasswordAuth,forgetPassword);


app.use('/forgetPasswordSeller',forgetPasswordAuth,forgetPasswordSeller);

//--TODO: Mongo Code is broken fix it
app.use('/product',homeAuth,product);

// // TODO: Implement order button code in sql
// // TODO: update Price as well when changing the quantity
//* mongo 


app.use('/sellerPage',sellerAuth,sellerPage);

//TODO: Check delete product and seller
app.use('/adminDashboard',adminAuth,adminDashboard);


app.use('/newSeller',newSeller);

//* sql ;

app.use('/myCart',homeAuth,cart);

app.use('/myOrder',homeAuth,order);



app.get('*',(req,res)=>{
    res.render('errPage',{userType:req.session.userType,user:req.session.user,error:"PAGE NOT FOUND!"});
})


app.listen(process.env.PORT,process.env.HOSTNAME,function(){
    console.log(`server running at http://${process.env.HOSTNAME}:${process.env.PORT}`);
});