var strWindowFeatures = "location=yes,height=700,width=1080,scrollbars=yes,status=yes";
function newProductPage(id){
    console.log(id);
    //TODO : Remove This Hard Codded Address
    window.open(window.location.toString()+`/addNewProduct/${id}`,'_blank',strWindowFeatures);
}

function updateProduct(id){
    window.open(window.location.toString()+`/updateProduct/${id}`,'_blank',strWindowFeatures)
}


function deleteProduct(id){
    var callback=(request)=>{
        switch(request.status){
            case 200:{
                window.location.reload();
            }
        }
    }
    createRequest('POST','/sellerPage/deleteProduct',id.toString(),callback);
}

function createRequest(method,dest,data,callback){
    let request = new XMLHttpRequest;
    request.open(method,dest);
    request.setRequestHeader('Content-Type','text/plain');
    request.send(data);
    request.addEventListener('load',function(){
        callback(request);
    })
}
