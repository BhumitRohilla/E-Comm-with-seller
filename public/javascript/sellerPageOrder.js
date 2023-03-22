
function rejectOrder(id){
   console.log(id);
   let request = new XMLHttpRequest;
   request.open('POST',`/sellerPage/order/reject/${id}`);
   request.send();
   request.addEventListener('load',function(){
      switch(request.status){
         case 200:{
            window.location.reload();
         }
      }
   })
}