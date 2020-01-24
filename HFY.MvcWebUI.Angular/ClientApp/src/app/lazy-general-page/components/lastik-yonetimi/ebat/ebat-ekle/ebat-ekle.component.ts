import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { EbatlarService } from 'src/app/lazy-general-page/services/backend-services/ebatlar/ebatlar.service';
import { ToastrService } from 'src/app/lazy-general-page/services/extra-services/toastr.service';
import { Router } from '@angular/router';
import { EbatEkle } from 'src/app/lazy-general-page/classes/ebat/models/ebat-ekle';

@Component({
  selector: 'app-ebat-ekle',
  templateUrl: './ebat-ekle.component.html',
  styleUrls: ['./ebat-ekle.component.css']
})
export class EbatEkleComponent implements OnInit {

  constructor(private fb: FormBuilder, private ebatService: EbatlarService, private toastr: ToastrService, private router: Router) {
    // initialize FormGroup  
    this.regiForm = fb.group({
      'Ad': [null, Validators.compose([Validators.required, Validators.maxLength(49)])],
      'Sira': [null, Validators.compose([Validators.required,Validators.max(5000)])],
    });
  }

  regiForm: FormGroup;

  ngOnInit() {

  }

  onFormSubmit(form: EbatEkle) {
    this.ebatService.ebatEkle(form).subscribe(response => {
      if (response.MessageType === 1) {
        this.toastr.success(response.Message);
        setTimeout(() => {
          this.router.navigate(['/admin/lastik-yonetimi/ebat']);
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
