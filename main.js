require('dotenv').config();
const express = require('express');
const app = express();
const session = require('express-session');
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
const { newConnectionSQL } = require('./func/db/dbConnectionSQL');
const dbFunction = require('./func/db/dbFunctionSQL');

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

// * DONE UPTO HERE:
app.use('/sellerLogin',sellerLogin);


app.use('/signup',signup);


app.use('/verify',verifyUser);


app.get('/logout',(req,res)=>{
    req.session.destroy();
    res.redirect('/');
})


app.use('/changePassword',changePasswordAuth,changePassword);


app.use('/forgetPassword',forgetPasswordAuth,forgetPassword);


app.use('/forgetPasswordSeller',forgetPasswordAuth,forgetPasswordSeller);


app.use('/product',homeAuth,product);


app.use('/myCart',homeAuth,cart);


// * Done Upto Hear
//TODO: Test Delete Seller
app.use('/adminDashboard',adminAuth,adminDashboard);


//TODO: Order Page in seller
app.use('/sellerPage',sellerAuth,sellerPage);


app.use('/newSeller',newSeller);


app.use('/myOrder',homeAuth,order);



app.get('*',(req,res)=>{
    res.sendStatus(404);
})


app.listen(process.env.PORT,process.env.HOSTNAME,function(){
    console.log(`server running at http://${process.env.HOSTNAME}:${process.env.PORT}`);
});