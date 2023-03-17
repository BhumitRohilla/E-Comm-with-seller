// var strWindowFeatures = "location=yes,height=700,width=1080,scrollbars=yes,status=yes";
let newSellerBtn = document.getElementById('addNewSeller');
let btnInside = '<div id="vertical" class="buttonline"></div><div id="horizontal" class="buttonline"></div>';
newSellerBtn.addEventListener('click',newSellerPage);
let creationMode = false;
let emailInput ;
let submitBtn;
let openBtnInside='<h2 class="seller-heading">Enter Seller Email</h2><input onclick="window.event.stopPropagation()" class="input-form" onkeydown="checkKey()" id="email" pattern=".+@+." type="email" placeholder="Enter Seller Email" title="Seller Email"><p id="err-msg">This Is Dummy Error</p><button class="submit-btn submit" id="seller-add-btn">Send Invite</button>'
let timeId = null;

function newSellerPage(){
    creationMode = true;
    // window.open(window.location.href+'/newSeller/','_blank',strWindowFeatures);
    newSellerBtn.setAttribute('id','newSellerDiv');
    newSellerBtn.removeEventListener('click',newSellerPage);
    newSellerBtn.addEventListener('click',closeDiv);
    newSellerBtn.innerHTML= openBtnInside;
    submitBtn = document.getElementById('seller-add-btn');
    submitBtn.addEventListener('click',function(evt){
        submit(evt);
    })
    emailInput = document.getElementById('email');
}

function submit(evt){
    evt.stopPropagation();
    let email = emailInput.value;
    // console.log(email);
    if(email == ''){
        errorShow('Email Is Empty');
        return ;
    }


    let request = new XMLHttpRequest;
    request.open('POST','/adminDashboard/newSeller');
    request.setRequestHeader('Content-Type','application/JSON');
    let data = {email};
    request.send(JSON.stringify(data));
    request.addEventListener('load',function(){
        switch(request.status){
            case 409:{
                errorShow("User Already Exists");
                break;
            }
            case 200:{
                errorShow("Mail Send");
            }
        }
    });
}

function deleteSellerBtn(userName){
    let data = JSON.stringify({userName});
    console.log(data);
    let request = new XMLHttpRequest;
    request.open('POST','/sellerPage/deleteSeller');
    request.setRequestHeader('Content-Type','application/JSON');
    request.send(data);
    request.addEventListener('load',function(){
        switch(request.status){
            case 200:{
                let element = document.getElementById(userName);
                element.remove();
                break;
            }
            case 303:{
                window.location.href = '/';
            }
            case 500:{
                alert("Server Time Out");
                break;
            }

        }
    })
}

function checkKey(){
    let errDiv = document.getElementById('err-msg');
    errDiv.style.visibility = 'hidden';
    let key = window.event.key;
    if(key == "Enter"){
        let evt = new Event('click');
        submitBtn.dispatchEvent(evt);
    }
}

function closeDiv(){
    creationMode = false;
    newSellerBtn.innerHTML = btnInside;
    newSellerBtn.setAttribute('id','addNewSeller');
    newSellerBtn.removeEventListener('click',closeDiv);
    newSellerBtn.addEventListener('click',newSellerPage);
}


function deleteElementFromAdmin(id){
    let request = new XMLHttpRequest;
    request.open('POST','adminDashboard/deleteProduct');
    request.setRequestHeader('Content-Type','application/JSON');
    let data = JSON.stringify({id});
    request.send(data);
    request.addEventListener('load',function(){
        if(request.status == 200){
            window.location.reload();
        }else if(request.status == 404){
            alert('Error Occure');
        }
    })
}

function errorShow(errMsg){
    let errDiv = document.getElementById('err-msg');
    errDiv.innerText = errMsg;
    errDiv.style.visibility = 'visible';
}


setInterval(function(){
    if(!creationMode){
        window.location.reload();
    }
},15000);














// function newProductPage(){
//     //TODO : Remove This Hard Codded Address
//     window.open(window.location.toString()+"/addNewProduct/",'_black',strWindowFeatures);
// }

// function updateElementFromAdmin(id){
//     window.open(window.location.toString()+`/updateProduct/${id}`,'_black',strWindowFeatures);

// }

// function deleteElementFromAdmin(id){
//     var callback=(request)=>{
//         switch(request.status){
//             case 200:{
//                 window.location.reload();
//             }
//         }
//     }

//     createRequest('POST','/deleteProduct',id.toString(),callback);
    
// }

// //TODO: LOWER-PRIORITY:- If Possible use import function to import request code.

// function createRequest(method,dest,data,callback){
//     let request = new XMLHttpRequest;
//     request.open(method,dest);
//     request.setRequestHeader('Content-Type','text/plain');
//     request.send(data);
//     request.addEventListener('load',function(){
//         callback(request);
//     })
// }

// const form = document.getElementById('new-product-form');
// const submitBtn = document.getElementById('submit-btn');

// //form values
// const titleInput = document.getElementById('title');
// const tagInput  = document.getElementById('tags');
// const dateInput = document.getElementById('date');
// const statusProductInput = document.getElementById('status');
// const userReviewsInput = document.getElementById('userReviews');
// const priceInput = document.getElementById('price');
// const stockInput = document.getElementById('stock');
// const aboutInput = document.getElementById('about');
// const imgInput   = document.getElementById('product-img');
// let errMsg = document.getElementById('err');

// window.addEventListener('load',function(){
//     if(errMsg != null){
//         setTimeout(function(){
//             errMsg.remove();
//         },3000);
//     }
// })

// submitBtn.addEventListener('click',function(evt){
//     evt.preventDefault();
//     let title = titleInput.value.trim();
//     let tag = tagInput.value.trim();
//     let statusProduct = statusProductInput.value.trim();
//     let userReviews = userReviewsInput.value.trim();
//     let price = priceInput.value
//     let stock = stockInput.value
//     let about = aboutInput.value.trim();
//     let img = imgInput.value.trim();
//     let sizeOfImg = imgInput.files[0].size;
//     if(title == "" || tag == "" || date == "" || statusProduct == "" || userReviews == "" || price == "" || stock == "" || about == "" || img == ""){
//         alert("Please Enter All The Value");
//         return ;
//     } 
    
//     if(sizeOfImg > 256000){
//         alert("Image size should be below 250kb");
//         return ;
//     }

//     form.submit();
// })


