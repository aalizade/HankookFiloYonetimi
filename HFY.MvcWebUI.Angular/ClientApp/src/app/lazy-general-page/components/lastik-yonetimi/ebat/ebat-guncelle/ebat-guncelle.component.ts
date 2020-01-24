import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EbatlarService } from 'src/app/lazy-general-page/services/backend-services/ebatlar/ebatlar.service';
import { ToastrService } from 'src/app/lazy-general-page/services/extra-services/toastr.service';
import { EbatGuncelle } from 'src/app/lazy-general-page/classes/ebat/models/ebat-guncelle';

@Component({
  selector: 'app-ebat-guncelle',
  templateUrl: './ebat-guncelle.component.html',
  styleUrls: ['./ebat-guncelle.component.css']
})
export class EbatGuncelleComponent implements OnInit {

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private ebatService: EbatlarService, private toastr: ToastrService, private router: Router) {
    // initialize FormGroup  
    this.regiForm = fb.group({
      'Ad': [null, Validators.compose([Validators.required, Validators.maxLength(49)])],//input=text
      'Sira': [null, Validators.compose([Validators.required, Validators.max(5000)])],//input=number
      'ListeAktiflik': [null, Validators.compose([Validators.required])],//input=checkbox
    });

    let id = this.route.snapshot.params.ebatId === undefined ? 0 : this.route.snapshot.params.ebatId;
    if (isNaN(id)) {
      window.location.href = "/admin/lastik-yonetimi/ebat";
    }
    else {
      this.ebatService.getEbat(id).subscribe(response => {
        this.regiForm = fb.group({
          'EbatID': [response.EbatID],
          'Ad': [response.Ad, Validators.compose([Validators.required, Validators.maxLength(49)])],
          'Sira': [response.Sira, Validators.compose([Validators.required, Validators.max(5000)])],
          'ListeAktiflik': [response.ListeAktiflik, Validators.compose([Validators.required])],
        });
      });
    }
  }

  regiForm: FormGroup;

  ngOnInit() {
  }

  onFormSubmit(form: EbatGuncelle) {
    this.ebatService.ebatGuncelle(form).subscribe(response => {
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
