import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ToastrService } from 'src/app/lazy-general-page/services/extra-services/toastr.service';
import { Router } from '@angular/router';
import { HizIndeksEkle } from 'src/app/lazy-general-page/classes/hiz-indeksler/models/hiz-indeks-ekle';
import { HavaFarkTanimlarService } from 'src/app/lazy-general-page/services/backend-services/hava-fark-tanimlar/hava-fark-tanimlar.service';
import { HavaFarkTanimEkle } from 'src/app/lazy-general-page/classes/hava-fark-tanimlar/models/hava-fark-tanim-ekle';

@Component({
  selector: 'app-hava-fark-tanim-ekle',
  templateUrl: './hava-fark-tanim-ekle.component.html',
  styleUrls: ['./hava-fark-tanim-ekle.component.css']
})
export class HavaFarkTanimEkleComponent implements OnInit {

  constructor(private fb: FormBuilder, private havaFarkTanimlarService: HavaFarkTanimlarService, private toastr: ToastrService, private router: Router) {
    // initialize FormGroup  
    this.regiForm = fb.group({
      'Tanim': [null, Validators.compose([Validators.required, Validators.maxLength(49)])],
      'HavaFarkMinimumYuzde': [null, Validators.compose([Validators.required, Validators.max(200)])],
      'HavaFarkMaksimumYuzde': [null, Validators.compose([Validators.required,Validators.max(200)])],
      'Kayip': [null, Validators.compose([Validators.required,Validators.max(5)])],
    });
  }

  regiForm: FormGroup;

  ngOnInit() {

  }

  onFormSubmit(form: HavaFarkTanimEkle) {
    this.havaFarkTanimlarService.havaFarkTanimEkle(form).subscribe(response => {
      if (response.MessageType === 1) {
        this.toastr.success(response.Message);
        setTimeout(() => {
          this.router.navigate(['/admin/lastik-yonetimi/hava-fark-tanim']);
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
