import { Injectable } from '@angular/core';
declare var Swal: any
@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {

  constructor() {  }

  success(message: string,message2:string="") {
    Swal.fire(message,message2, "success");
  }

  warning(message: string,message2:string="") {
    Swal.fire(message,message2, "warning");
  }

  error(message: string,message2:string="") {
    Swal.fire(message,message2, "error");
  }

  info(message: string,message2:string="") {
    Swal.fire(message,message2, "info");
  }

  question(message: string,message2:string="") {
    Swal.fire(message,message2, "question");
  }

}
