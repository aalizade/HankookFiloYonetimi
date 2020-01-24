import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { LastikMarkalarService } from 'src/app/lazy-general-page/services/backend-services/lastik-markalar/lastik-markalar.service';
import { ToastrService } from 'src/app/lazy-general-page/services/extra-services/toastr.service';
import { Router } from '@angular/router';
import { LastikMarkaEkle } from 'src/app/lazy-general-page/classes/lastik-markalar/models/lastik-marka-ekle';

@Component({
  selector: 'app-lastik-marka-ekle',
  templateUrl: './lastik-marka-ekle.component.html',
  styleUrls: ['./lastik-marka-ekle.component.css']
})
export class LastikMarkaEkleComponent implements OnInit {

  constructor(private fb: FormBuilder, private lastikMarkalarService: LastikMarkalarService, private toastr: ToastrService, private router: Router) {
    // initialize FormGroup  
    this.regiForm = fb.group({
      'Kod': [null, Validators.compose([Validators.required, Validators.maxLength(5)])],
      'Ad': [null, Validators.compose([Validators.required, Validators.maxLength(50)])],
      'KaplamaMarka': [false, Validators.compose([Validators.required])],
      'Sira': [null, Validators.compose([Validators.required, Validators.max(5000)])],
    });
  }

  regiForm: FormGroup;

  ngOnInit() {

  }

  onFormSubmit(form: LastikMarkaEkle) {
    this.lastikMarkalarService.lastikMarkaEkle(form).subscribe(response => {
      if (response.MessageType === 1) {
        this.toastr.success(response.Message);
        setTimeout(() => {
          this.router.navigate(['/admin/lastik-yonetimi/lastik-marka']);
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
