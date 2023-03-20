import {requestServerNoDelay} from '/javascript/general.js'
let button = document.getElementById("submit");
let email = document.getElementById("email");
let errMsg = document.getElementById('err-msg');
let timeID ;

button.addEventListener("click",function(evt){
    let emailVal = email.value.trim();
    if(emailVal == ''){
        return ;
    }else{
        button.setAttribute('disabled','true');
    }
    requestServerNoDelay("POST",window.location.href,{"email":emailVal},function(request){
        if(request.status == 403){
            errShow('Email does not exists');
        }else{
            errShow('Check Your mail');
        }       
    })
})


function errShow(err){
    button.removeAttribute('disabled');
    if(timeID != null){
        clearTimeout(timeID);
    }
    errMsg.innerText = err;
    errMsg.style.visibility = 'visible';
    timeID = setTimeout(function(){
        errMsg.style.visibility = 'hidden';
        errMsg.innerText = "This is Dummy Text";
    },3000)
}