import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HizIndekslerService } from 'src/app/lazy-general-page/services/backend-services/hiz-indeksler/hiz-indeksler.service';
import { ToastrService } from 'src/app/lazy-general-page/services/extra-services/toastr.service';
import { Router } from '@angular/router';
import { HizIndeksEkle } from 'src/app/lazy-general-page/classes/hiz-indeksler/models/hiz-indeks-ekle';

@Component({
  selector: 'app-hiz-indeks-ekle',
  templateUrl: './hiz-indeks-ekle.component.html',
  styleUrls: ['./hiz-indeks-ekle.component.css']
})
export class HizIndeksEkleComponent implements OnInit {

  constructor(private fb: FormBuilder, private hizIndekslerService: HizIndekslerService, private toastr: ToastrService, private router: Router) {
    // initialize FormGroup  
    this.regiForm = fb.group({
      'Kod': [null, Validators.compose([Validators.required, Validators.maxLength(99)])],
      'Ad': [null, Validators.compose([Validators.required, Validators.maxLength(99)])],
      'Sira': [null, Validators.compose([Validators.required,Validators.max(5000)])],
    });
  }

  regiForm: FormGroup;

  ngOnInit() {

  }

  onFormSubmit(form: HizIndeksEkle) {
    this.hizIndekslerService.hizIndeksEkle(form).subscribe(response => {
      if (response.MessageType === 1) {
        this.toastr.success(response.Message);
        setTimeout(() => {
          this.router.navigate(['/admin/lastik-yonetimi/hiz-indeks']);
        }, 500);
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
    }, error => {
      this.toastr.error("Lütfen doldurulması gereken alanları doldurun.");
    })
  }

}
