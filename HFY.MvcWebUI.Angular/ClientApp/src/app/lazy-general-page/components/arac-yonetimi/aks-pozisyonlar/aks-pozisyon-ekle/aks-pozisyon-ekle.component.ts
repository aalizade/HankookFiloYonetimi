import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AksPozisyonlarService } from 'src/app/lazy-general-page/services/backend-services/aks-pozisyonlar/aks-pozisyonlar.service';
import { ToastrService } from 'src/app/lazy-general-page/services/extra-services/toastr.service';
import { Router } from '@angular/router';
import { AksPozisyonlar } from 'src/app/lazy-general-page/classes/aks-pozisyonlar/aks-pozisyonlar';
import { AksPozisyonEkle } from 'src/app/lazy-general-page/classes/aks-pozisyonlar/models/aks-pozisyon-ekle';

@Component({
  selector: 'app-aks-pozisyon-ekle',
  templateUrl: './aks-pozisyon-ekle.component.html',
  styleUrls: ['./aks-pozisyon-ekle.component.css']
})
export class AksPozisyonEkleComponent implements OnInit {
  
  constructor(private fb: FormBuilder,private aksPozisyonService:AksPozisyonlarService,private toastr:ToastrService,private router:Router) {
    // initialize FormGroup  
    this.regiForm = fb.group({
      'Ad': [null, Validators.compose([Validators.required, Validators.maxLength(99)])],
      'AksNo': [0, Validators.compose([Validators.required,Validators.max(99)])],
      'Pozisyon': [null, Validators.compose([Validators.required, Validators.max(99)])],
      'OnArkaId': [null, Validators.compose([Validators.required])],
      'SolSagId': [null, Validators.compose([Validators.required])],
      'IcDisId': ["0"],
      'Ceker': ["0", Validators.compose([Validators.required])],
      'Sira': [null, Validators.compose([Validators.required,Validators.max(5000)])],
    });

  }

  regiForm: FormGroup;
  
  ngOnInit() {

  }

  onFormSubmit(form: AksPozisyonEkle) {
    this.aksPozisyonService.aksPozisyonEkle(form).subscribe(response => {
      if (response.MessageType === 1) {
        this.toastr.success(response.Message);
        // setTimeout(() => {
        //   this.router.navigate(['/admin/arac-yonetimi/aks-pozisyon']);
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
