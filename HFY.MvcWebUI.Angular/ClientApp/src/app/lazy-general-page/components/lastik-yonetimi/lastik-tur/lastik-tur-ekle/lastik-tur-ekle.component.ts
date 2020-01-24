import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { LastikTurlerService } from 'src/app/lazy-general-page/services/backend-services/lastik-turler/lastik-turler.service';
import { ToastrService } from 'src/app/lazy-general-page/services/extra-services/toastr.service';
import { Router } from '@angular/router';
import { LastikTurEkle } from 'src/app/lazy-general-page/classes/lastik-turler/models/lastik-tur-ekle';

@Component({
  selector: 'app-lastik-tur-ekle',
  templateUrl: './lastik-tur-ekle.component.html',
  styleUrls: ['./lastik-tur-ekle.component.css']
})
export class LastikTurEkleComponent implements OnInit {

  constructor(private fb: FormBuilder, private lastikTurService: LastikTurlerService, private toastr: ToastrService, private router: Router) {
    // initialize FormGroup  
    this.regiForm = fb.group({
      'Kod': [null, Validators.compose([Validators.required, Validators.maxLength(99)])],
      'Ad': [null, Validators.compose([Validators.required, Validators.maxLength(99)])],
      'Sira': [null, Validators.compose([Validators.required, Validators.max(5000)])],
    });
  }

  regiForm: FormGroup;

  ngOnInit() {

  }

  onFormSubmit(form: LastikTurEkle) {
    this.lastikTurService.lastikTurEkle(form).subscribe(response => {
      if (response.MessageType === 1) {
        this.toastr.success(response.Message);
        setTimeout(() => {
          this.router.navigate(['/admin/lastik-yonetimi/lastik-tur']);
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
