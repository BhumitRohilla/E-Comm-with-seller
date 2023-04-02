let order = document.getElementById('buy-btn');

order.addEventListener('click',orderBtn);

let blurDiv;
let loadingDiv;

function increaseQuantity(id){
    let element = document.getElementById(id);
    let request = new XMLHttpRequest;
    request.open("GET",`/product/buyProduct/${element.id}`);
    request.send();
    request.addEventListener('load',function(){
        if(request.status == 201 ){
            updatePrice();
            let quantitySpan = element.getElementsByClassName('item-quantity')[0];
            // console.log(quantitySpan);
            quantitySpan.innerText = parseInt(quantitySpan.innerText) + 1;
        }
        if(request.status == 204){
            alert('Out of stocks');
        }
    })
}

function decreaseQuantity(id){
    let element = document.getElementById(id);
    let request = new XMLHttpRequest;
    request.open("GET",`/myCart/removeProduct/${element.id}`);
    request.send();
    request.addEventListener('load',function(){
        if(request.status == 201 ){
            let quantitySpan = element.getElementsByClassName('item-quantity')[0];
            quantitySpan.innerText = parseInt(quantitySpan.innerText) - 1;
            updatePrice();
        }
        if(request.status == 204){
            
        }
    })
}

function orderBtn(){
    let request = new XMLHttpRequest;
    request.open('POST','/myCart/orderPlacement');
    request.send();
    request.addEventListener('load',function(){
        console.log(request.response);
        if(request.status == 303){
            window.history.pushState("", "", "/");
            window.location.replace(request.response);
        }
        if(request.status == 202){
            alert("No Product In The Cart");
        }
        blurDiv.remove();
        loadingDiv.remove();
    })
    blurDiv = document.createElement('div');
    loadingDiv = document.createElement('div');
    blurDiv.setAttribute('class','blur-back');
    loadingDiv.setAttribute('class','blur-loading-div');
    document.body.appendChild(blurDiv);
    document.body.appendChild(loadingDiv);
}

function deleteFromCart(id){
    let element = document.getElementById(id);
    let request = new XMLHttpRequest;
    request.open("GET",`/myCart/deleteProduct/${element.id}`);
    request.send();
    request.addEventListener('load',function(){
        if(request.status == 201 ){
            element.remove();
            updatePrice();
        }
        if(request.status == 404){
            alert('Server Time Out');
        }
    })
    
}


function updatePrice(){
    let Price = document.getElementById('price-p');
    let request = new XMLHttpRequest;
    request.open('GET','/myCart/getPrice');
    request.send();
    request.addEventListener('load',function(){
        Price.innerHTML = `₹ ${request.response}`
    })
}