import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LastikTurlerService } from 'src/app/lazy-general-page/services/backend-services/lastik-turler/lastik-turler.service';
import { ToastrService } from 'src/app/lazy-general-page/services/extra-services/toastr.service';
import { LastikTurGuncelle } from 'src/app/lazy-general-page/classes/lastik-turler/models/lastik-tur-guncelle';

@Component({
  selector: 'app-lastik-tur-guncelle',
  templateUrl: './lastik-tur-guncelle.component.html',
  styleUrls: ['./lastik-tur-guncelle.component.css']
})
export class LastikTurGuncelleComponent implements OnInit {

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private lastikTurService:LastikTurlerService, private toastr: ToastrService, private router: Router) {
    // initialize FormGroup  
    this.regiForm = fb.group({
      'Kod': [null, Validators.compose([Validators.required, Validators.maxLength(99)])], //input=text
      'Ad': [null, Validators.compose([Validators.required,Validators.maxLength(99)])],//input=text
      'Sira': [null, Validators.compose([Validators.required,Validators.max(5000)])],//input=number
      'ListeAktiflik': [null, Validators.compose([Validators.required])],//input=checkbox
    });

    let id = this.route.snapshot.params.lastikTurId === undefined ? 0 : this.route.snapshot.params.lastikTurId;
    if (isNaN(id)) {
      window.location.href = "/admin/lastik-yonetimi/lastik-tur";
    }
    else {
      this.lastikTurService.getLastikTur(id).subscribe(response => {
        this.regiForm = fb.group({
          'LastikTurID':[response.LastikTurID],
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

  onFormSubmit(form: LastikTurGuncelle) {
    this.lastikTurService.lastikTurGuncelle(form).subscribe(response => {
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
