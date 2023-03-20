import {requestServerNoDelay} from '/javascript/general.js'
let submitBtn = document.getElementById('submit-btn');
let password1 = document.getElementById('password1');
let password2 = document.getElementById('password2');
let errMsg = document.getElementById('err-msg');
let timeId = null;
submitBtn.addEventListener('click',function(){
    submitBtn.setAttribute('disabled',true);
    let p1 = password1.value.trim();
    let p2 = password2.value.trim();
    if(p1 == "" || p2 == ""){
        alert("password fields are emtpy");
    }else if(p1 != p2){
        alert("Password are not matching");
    }else{
        requestServerNoDelay('POST','/changePassword',{"password":p1},function(request){
            console.log(request);
            if(request.status == 200){
                showErr('Password Changed check your mail');
                setTimeout(function(){
                    window.location.href='/login';
                },3000);
            }else{
                showErr('Server Time Out');
                submitBtn.removeAttribute('disabled');
            }
        })
    }
})

function showErr(err){
    if(timeId != null){
        clearTimeout(timeId);
    }
    errMsg.innerText = err;
    errMsg.style.visibility = 'visible';
    setTimeout(function(){
        errMsg.style.visibility = 'hidden';
        errMsg.innerText = 'This Is Dummy Text';
    },3000);
}