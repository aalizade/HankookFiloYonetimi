import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ToastrService } from 'src/app/lazy-general-page/services/extra-services/toastr.service';
import { Router } from '@angular/router';
import { AracMarkalarService } from 'src/app/lazy-general-page/services/backend-services/arac-markalar/arac-markalar.service';
import { AracMarkaEkle } from 'src/app/lazy-general-page/classes/arac-markalar/models/arac-marka-ekle';

@Component({
  selector: 'app-arac-marka-ekle',
  templateUrl: './arac-marka-ekle.component.html',
  styleUrls: ['./arac-marka-ekle.component.css']
})
export class AracMarkaEkleComponent implements OnInit {

  constructor(private fb: FormBuilder,private aracMarkaService:AracMarkalarService,private toastr:ToastrService,private router:Router) {
    // initialize FormGroup  
    this.regiForm = fb.group({
      'Ad': [null, Validators.compose([Validators.required, Validators.maxLength(99)])], // input=text
      'Sira': [null, Validators.compose([Validators.required])], // input=number
    });
  }

  regiForm: FormGroup;
  
  ngOnInit() {

  }

  onFormSubmit(form: AracMarkaEkle) {
    this.aracMarkaService.aracMarkaEkle(form).subscribe(response => {
      if (response.MessageType === 1) {
        this.toastr.success(response.Message);
        // setTimeout(() => {
        //   this.router.navigate(['/admin/arac-yonetimi/arac-kategori']);
        // }, 500);
      }
      else {
        if (response.ErrorList !== undefined) {
          response.ErrorList.forEach(item => {
            this.toastr.error(item.ErrorMessage);
          })
        }
        if (response.Error !== "" && response.Error !== undefined) {
          this.toastr.error(response.Error);
        }
      }
    },error=>{
      this.toastr.error("Lütfen doldurulması gereken alanları doldurun.");
    })
  }

}
