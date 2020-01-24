import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AksPozisyonlarService } from 'src/app/lazy-general-page/services/backend-services/aks-pozisyonlar/aks-pozisyonlar.service';
import { ToastrService } from 'src/app/lazy-general-page/services/extra-services/toastr.service';
import { AksPozisyonGuncelle } from 'src/app/lazy-general-page/classes/aks-pozisyonlar/models/aks-pozisyon-guncelle';

@Component({
  selector: 'app-aks-pozisyon-guncelle',
  templateUrl: './aks-pozisyon-guncelle.component.html',
  styleUrls: ['./aks-pozisyon-guncelle.component.css']
})
export class AksPozisyonGuncelleComponent implements OnInit {

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private aksPozisyonService:AksPozisyonlarService, private toastr: ToastrService, private router: Router) {
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
      'ListeAktiflik': [null, Validators.compose([Validators.required])],
    });

    let id = this.route.snapshot.params.id === undefined ? 0 : this.route.snapshot.params.id;
    if (isNaN(id)) {
      window.location.href = "/admin/arac-yonetimi/aks-pozisyon";
    }
    else {
      this.aksPozisyonService.getAksPozisyon(id).subscribe(response => {
        this.regiForm = fb.group({
          'AksPozisyonID':[response.AksPozisyonID],
          'Ad': [response.Ad, Validators.compose([Validators.required, Validators.maxLength(99)])],
          'AksNo': [response.AksNo, Validators.compose([Validators.required,Validators.max(99)])],
          'Pozisyon': [response.Pozisyon, Validators.compose([Validators.required, Validators.max(99)])],
          'OnArkaId': [response.OnArkaId, Validators.compose([Validators.required])],
          'SolSagId': [response.SolSagId, Validators.compose([Validators.required])],
          'IcDisId': [response.IcDisId],
          'Ceker': [response.Ceker, Validators.compose([Validators.required])],
          'Sira': [response.Sira, Validators.compose([Validators.required,Validators.max(5000)])],
          'ListeAktiflik': [response.ListeAktiflik, Validators.compose([Validators.required])],
        });
      });
    }
  }

  regiForm: FormGroup;

  ngOnInit() {
  }

  onFormSubmit(form: AksPozisyonGuncelle) {
    this.aksPozisyonService.aksPozisyonGuncelle(form).subscribe(response => {
      if (response.MessageType === 1) {
        this.toastr.success(response.Message);
        setTimeout(() => {
          this.router.navigate(['/admin/arac-yonetimi/aks-pozisyon']);
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
