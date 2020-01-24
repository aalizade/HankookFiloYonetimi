import { Injectable } from '@angular/core';
declare var toastr:any

@Injectable({
  providedIn: 'root'
})
export class ToastrService {

  constructor() {
    this.onSettings();
   }

   success(message:string)
   {
     toastr.success(message, "");
   }

   warning(message:string)
   {
     toastr.warning(message);
   }

   error(message:string)
   {
     toastr.error(message);
   }

   info(message:string)
   {
     toastr.info(message);
   }

  onSettings(){
    toastr.options = {
      "closeButton": true,
      "debug": false,
      "newestOnTop": false,
      "progressBar": true,
      "positionClass": "toast-bottom-right",
      "preventDuplicates": false,
      "onclick": null,
      "showDuration": "600",
      "hideDuration": "1000",
      "timeOut": "2200",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    }
  }
}
