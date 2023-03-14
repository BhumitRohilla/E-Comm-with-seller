import {requestServerNoDelay} from '/javascript/general.js'

const nameInput = document.getElementById('name');
const userNameInput = document.getElementById('userName');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const submitBtn = document.getElementById('submit-btn');
const errDiv = document.getElementById('err-msg');
let timeOutId = null;

submitBtn.addEventListener('click',function(){
    if(timeOutId!=null){
        clearTimeout(timeOutId);
        
    }
    let name = nameInput.value.trim();
    let userName = userNameInput.value.trim();
    let password = passwordInput.value.trim();

    if(name == '' || userName == '' || password == ''){
        errDisp('Please Fill All Parameters');
        return ;
    }

    let obj ={name,userName,password};
    requestServerNoDelay('POST',window.location.href,obj,function(request){
        switch(request.status){
            case 200:{
                errDisp("Account Created");
                break;
            }
            case 303:{
                errDisp("Provide all details");
            }
            case 409:{
                errDisp("UserName Already Taken");
                break;
            }
            case 500:{
                errDisp("Server Time Out");
                break;
            }
        }
    })
});

function errDisp(errMsg){
    errDiv.style.visibility = 'visible';
    errDiv.innerText = errMsg;
    timeOutId = setTimeout(function(){
        errDiv.style.visibility = 'hidden';
    },3000);
}