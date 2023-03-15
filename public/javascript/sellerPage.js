var strWindowFeatures = "location=yes,height=700,width=1080,scrollbars=yes,status=yes";
function newProductPage(id){
    console.log(id);
    //TODO : Remove This Hard Codded Address
    window.open(window.location.toString()+`/addNewProduct/${id}`,'_black',strWindowFeatures);
}