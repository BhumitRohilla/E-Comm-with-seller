function increaseQuantity(id){
    let element = document.getElementById(id);
    let request = new XMLHttpRequest;
    request.open("GET",`/product/buyProduct/${element.id}`);
    request.send();
    request.addEventListener('load',function(){
        if(request.status == 201 ){
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
        }
        if(request.status == 204){
            
        }
    })
}

function deleteFromCart(id){
    let element = document.getElementById(id);
    let request = new XMLHttpRequest;
    request.open("GET",`/myCart/deleteProduct/${element.id}`);
    request.send();
    request.addEventListener('load',function(){
        if(request.status == 201 ){
            element.remove();
        }
        if(request.status == 404){
            alert('Server Time Out');
        }
    })
}