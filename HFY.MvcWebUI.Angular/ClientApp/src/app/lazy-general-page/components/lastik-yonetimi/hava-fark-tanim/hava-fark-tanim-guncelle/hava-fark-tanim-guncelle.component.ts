import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'src/app/lazy-general-page/services/extra-services/toastr.service';
import { HavaFarkTanimlarService } from 'src/app/lazy-general-page/services/backend-services/hava-fark-tanimlar/hava-fark-tanimlar.service';
import { HavaFarkTanimGuncelle } from 'src/app/lazy-general-page/classes/hava-fark-tanimlar/models/hava-fark-tanim-guncelle';

@Component({
  selector: 'app-hava-fark-tanim-guncelle',
  templateUrl: './hava-fark-tanim-guncelle.component.html',
  styleUrls: ['./hava-fark-tanim-guncelle.component.css']
})
export class HavaFarkTanimGuncelleComponent implements OnInit {

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private havaFarkTanimlarService: HavaFarkTanimlarService, private toastr: ToastrService, private router: Router) {
    // initialize FormGroup  
    this.regiForm = fb.group({
      'Tanim': [null, Validators.compose([Validators.required, Validators.maxLength(49)])],
      'HavaFarkMinimumYuzde': [null, Validators.compose([Validators.required, Validators.max(200)])],
      'HavaFarkMaksimumYuzde': [null, Validators.compose([Validators.required, Validators.max(200)])],
      'Kayip': [null, Validators.compose([Validators.required, Validators.max(5)])],
      'ListeAktiflik': [null, Validators.compose([Validators.required])],//input=checkbox
    });

    let id = this.route.snapshot.params.havaFarkId === undefined ? 0 : this.route.snapshot.params.havaFarkId;
    if (isNaN(id)) {
      window.location.href = "/admin/lastik-yonetimi/hava-fark-tanim";
    }
    else {
      this.havaFarkTanimlarService.getHavaFarkTanim(id).subscribe(response => {
        this.regiForm = fb.group({
          'HavaFarkID': [response.HavaFarkID],
          'Tanim': [response.Tanim, Validators.compose([Validators.required, Validators.maxLength(49)])],
          'HavaFarkMinimumYuzde': [response.HavaFarkMinimumYuzde, Validators.compose([Validators.required, Validators.max(200)])],
          'HavaFarkMaksimumYuzde': [response.HavaFarkMaksimumYuzde, Validators.compose([Validators.required, Validators.max(200)])],
          'Kayip': [response.Kayip, Validators.compose([Validators.required, Validators.max(5)])],
          'ListeAktiflik': [response.ListeAktiflik, Validators.compose([Validators.required])],
        });
      });
    }
  }

  regiForm: FormGroup;

  ngOnInit() {
  }

  onFormSubmit(form: HavaFarkTanimGuncelle) {
    this.havaFarkTanimlarService.havaFarkTanimGuncelle(form).subscribe(response => {
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
