import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AracKategorilerService } from 'src/app/lazy-general-page/services/backend-services/arac-kategoriler/arac-kategoriler.service';
import { ToastrService } from 'src/app/lazy-general-page/services/extra-services/toastr.service';
import { Router } from '@angular/router';
import { AracKategoriEkle } from 'src/app/lazy-general-page/classes/arac-kategoriler/models/arac-kategori-ekle';

@Component({
  selector: 'app-arac-kategori-ekle',
  templateUrl: './arac-kategori-ekle.component.html',
  styleUrls: ['./arac-kategori-ekle.component.css']
})
export class AracKategoriEkleComponent implements OnInit {

  constructor(private fb: FormBuilder,private aracKategoriService:AracKategorilerService,private toastr:ToastrService,private router:Router) {
    // initialize FormGroup  
    this.regiForm = fb.group({
      'Ad': [null, Validators.compose([Validators.required, Validators.maxLength(99)])], // input=text
      'Sira': [null, Validators.compose([Validators.required])], // input=number
    });
  }

  regiForm: FormGroup;
  
  ngOnInit() {

  }

  onFormSubmit(form: AracKategoriEkle) {
    this.aracKategoriService.aracKategoriEkle(form).subscribe(response => {
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
