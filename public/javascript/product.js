import {requestServerNoDelay} from '/javascript/general.js'
const showMore = document.getElementById('show-more');
const itemList = document.getElementById('item-container');
let errMsg;





showMore.addEventListener('click',function(){
    
    requestServerNoDelay('GET','/product/showMore',null,function(request){
        if(request.status == 403){
            showMore.style.visibility = "hidden";
        }else{    
            let data = request.response;
            showMore.insertAdjacentHTML("beforebegin",data);
        }
    });
})