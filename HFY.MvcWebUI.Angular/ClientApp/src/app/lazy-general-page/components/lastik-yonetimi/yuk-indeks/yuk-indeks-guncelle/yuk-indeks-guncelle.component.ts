import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { YukIndekslerService } from 'src/app/lazy-general-page/services/backend-services/yuk-indeksler/yuk-indeksler.service';
import { ToastrService } from 'src/app/lazy-general-page/services/extra-services/toastr.service';
import { YukIndeksGuncelle } from 'src/app/lazy-general-page/classes/yuk-indeksler/models/yuk-indeks-guncelle';

@Component({
  selector: 'app-yuk-indeks-guncelle',
  templateUrl: './yuk-indeks-guncelle.component.html',
  styleUrls: ['./yuk-indeks-guncelle.component.css']
})
export class YukIndeksGuncelleComponent implements OnInit {

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private yukIndekslerService:YukIndekslerService, private toastr: ToastrService, private router: Router) {
    // initialize FormGroup  
    this.regiForm = fb.group({
      'Kod': [null, Validators.compose([Validators.required, Validators.maxLength(99)])], //input=text
      'Ad': [null, Validators.compose([Validators.required,Validators.maxLength(99)])],//input=text
      'Sira': [null, Validators.compose([Validators.required,Validators.max(5000)])],//input=number
      'ListeAktiflik': [null, Validators.compose([Validators.required])],//input=checkbox
    });

    let id = this.route.snapshot.params.yukIndeksId === undefined ? 0 : this.route.snapshot.params.yukIndeksId;
    if (isNaN(id)) {
      window.location.href = "/admin/lastik-yonetimi/yuk-indeks";
    }
    else {
      this.yukIndekslerService.getYukIndeks(id).subscribe(response => {
        this.regiForm = fb.group({
          'YukIndexID':[response.YukIndexID],
          'Kod': [response.Kod, Validators.compose([Validators.required, Validators.maxLength(99)])],
          'Ad': [response.Ad, Validators.compose([Validators.required,Validators.maxLength(99)])],
          'Sira': [response.Sira, Validators.compose([Validators.required,Validators.max(5000)])],
          'ListeAktiflik': [response.ListeAktiflik, Validators.compose([Validators.required])],
        });
      });
    }
  }

  regiForm: FormGroup;

  ngOnInit() {
  }

  onFormSubmit(form: YukIndeksGuncelle) {
    this.yukIndekslerService.yukIndeksGuncelle(form).subscribe(response => {
      if (response.MessageType === 1) {
        this.toastr.success(response.Message);
        setTimeout(() => {
          this.router.navigate(['/admin/lastik-yonetimi/yuk-indeks']);
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
