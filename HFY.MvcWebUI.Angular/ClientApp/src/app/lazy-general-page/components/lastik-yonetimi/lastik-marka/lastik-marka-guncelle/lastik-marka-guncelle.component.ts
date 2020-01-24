import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'src/app/lazy-general-page/services/extra-services/toastr.service';
import { LastikMarkalarService } from 'src/app/lazy-general-page/services/backend-services/lastik-markalar/lastik-markalar.service';
import { LastikMarkaGuncelle } from 'src/app/lazy-general-page/classes/lastik-markalar/models/lastik-marka-guncelle';

@Component({
  selector: 'app-lastik-marka-guncelle',
  templateUrl: './lastik-marka-guncelle.component.html',
  styleUrls: ['./lastik-marka-guncelle.component.css']
})
export class LastikMarkaGuncelleComponent implements OnInit {

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private lastikMarkalarService: LastikMarkalarService, private toastr: ToastrService, private router: Router) {
    // initialize FormGroup  
    this.regiForm = fb.group({
      'Kod': [null, Validators.compose([Validators.required, Validators.maxLength(5)])],
      'Ad': [null, Validators.compose([Validators.required, Validators.maxLength(50)])],
      'KaplamaMarka': [null, Validators.compose([Validators.required])],
      'Sira': [null, Validators.compose([Validators.required, Validators.max(5000)])],
      'ListeAktiflik': [null, Validators.compose([Validators.required])]
    });

    let id = this.route.snapshot.params.lastikMarkaId === undefined ? 0 : this.route.snapshot.params.lastikMarkaId;
    if (isNaN(id)) {
      window.location.href = "/admin/lastik-yonetimi/yuk-indeks";
    }
    else {
      this.lastikMarkalarService.getLastikMarka(id).subscribe(response => {
        this.regiForm = fb.group({
          'LastikMarkaID': [response.LastikMarkaID],
          'Kod': [response.Kod, Validators.compose([Validators.required, Validators.maxLength(5)])],
          'Ad': [response.Ad, Validators.compose([Validators.required, Validators.maxLength(50)])],
          'KaplamaMarka': [response.KaplamaMarka, Validators.compose([Validators.required])],
          'Sira': [response.Sira, Validators.compose([Validators.required, Validators.max(5000)])],
          'ListeAktiflik': [response.ListeAktiflik, Validators.compose([Validators.required])]
        });
      });
    }
  }

  regiForm: FormGroup;

  ngOnInit() {
  }

  onFormSubmit(form: LastikMarkaGuncelle) {
    this.lastikMarkalarService.lastikMarkaGuncelle(form).subscribe(response => {
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
