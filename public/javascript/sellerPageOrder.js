let errorDiv;
let errorTimeOut = null;

function rejectOrder(id){
   console.log(id);
   let request = new XMLHttpRequest;
   request.open('POST',`/sellerPage/order/reject/${id}`);
   request.send();
   request.addEventListener('load',function(){
      switch(request.status){
         case 200:{
            document.getElementById(id).remove();
         }
      }
   })
}

function acceptOrder(id,quantity){   
   //blur background
   let blurDiv = document.createElement('div');
   blurDiv.setAttribute('class','blur-back');
   document.body.appendChild(blurDiv);
   blurDiv.addEventListener('click',function(){
      blurDiv.remove();
      popUpDiv.remove();
      document.body.style.overflow='scroll';
   })

   //popUp Div
   let popUpDiv = document.createElement('div');
   popUpDiv.setAttribute('class','pop-up-div');
   document.body.appendChild(popUpDiv);
   document.body.style.overflow='hidden';
   
   //textArea to enter keys
   let textArea = document.createElement('textarea');
   textArea.setAttribute('id','productKeys');
   textArea.setAttribute('placeholder','Enter keys with enter in between');
   popUpDiv.appendChild(textArea);
   
   //error div
   errorDiv = document.createElement('p');
   errorDiv.setAttribute('id','err-msg');
   errorDiv.innerText = 'This is Dummy Text';
   popUpDiv.appendChild(errorDiv);

   
   //submit btn
   let submitBtn = document.createElement('button');
   submitBtn.classList.add('blue-btn');
   submitBtn.innerText = "Send";
   submitBtn.setAttribute('onclick',`sendToServer('${id}','${quantity}')`);
   
   // submitBtn.addEventListener('click',function(){
   //    sendToServer(id,quantity);   
   // })
      
   popUpDiv.appendChild(submitBtn);
}

function sendToServer(id,quantity){
   

   let submitBtn = document.getElementsByClassName('blue-btn')[0];
   submitBtn.removeAttribute('onclick');
   submitBtn.innerHTML = '<div class="back-forth-animation"></div>'

   let obj = {};
   let textArea = document.getElementById('productKeys');
   let text = textArea.value;
   let keyArray = text.split('\n');
   keyArray = keyArray.map((element)=>{
      element = element.trim();
      return element;
   })
   keyArray = keyArray.filter((element)=>{
      if(element == ''){
         return false;
      }
      return true;
   })
   if(keyArray.length == quantity){
      let request = new XMLHttpRequest;
      request.open('POST',`/sellerPage/order/accept/${id}`);
      request.setRequestHeader('Content-Type','application/JSON');
      request.send(JSON.stringify(keyArray));
      request.addEventListener('load',function(){
         submitBtn.innerText = 'Send';
         
         switch(request.status){
            case 200:{
               let element = document.getElementById(`${id}`);
               removePopUpDiv();
               element.remove();
               break;
            }
            case 202:{
               errorShow('quantity and keys are not matching');
               break;
            }
            default:{
               errorShow('Server error Occure');
               break;
            }
         }
      });
   }else{
      errorShow('quantity and keys are not matching');
      submitBtn.innerHTML = 'Send';
      submitBtn.setAttribute('onclick',`sendToServer(${id},${quantity})`);
   }
}


function errorShow(errMsg){
   if(errorTimeOut != null){
      clearTimeout(errorTimeOut);
   }
   errorDiv.innerText = errMsg;
   errorDiv.style.visibility = 'visible';
   setTimeout(()=>{
      errorDiv.style.visibility = 'hidden';
   },3000);
}


function removePopUpDiv(){
   document.getElementsByClassName('blur-back')[0].remove();
   document.getElementsByClassName('pop-up-div')[0].remove();
   document.body.style.overflow = 'scroll';
}