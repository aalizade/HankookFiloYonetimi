import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LastikMarkaDesenOzelliklerService } from 'src/app/lazy-general-page/services/backend-services/lastik-marka-desen-ozellikler/lastik-marka-desen-ozellikler.service';
import { ToastrService } from 'src/app/lazy-general-page/services/extra-services/toastr.service';
import { LastikMarkaDesenOzellikGuncelle } from 'src/app/lazy-general-page/classes/lastik-marka-desen-ozellikler/models/lastik-marka-desen-ozellik-guncelle';
import { EbatlarService } from 'src/app/lazy-general-page/services/backend-services/ebatlar/ebatlar.service';
import { Select2OptionData } from 'ng-select2';

@Component({
  selector: 'app-lastik-marka-desen-ozellik-guncelle',
  templateUrl: './lastik-marka-desen-ozellik-guncelle.component.html',
  styleUrls: ['./lastik-marka-desen-ozellik-guncelle.component.css']
})
export class LastikMarkaDesenOzellikGuncelleComponent implements OnInit {

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private ebatlarService: EbatlarService, private lastikMarkaDesenOzelliklerService: LastikMarkaDesenOzelliklerService, private toastr: ToastrService, private router: Router) {
    // initialize FormGroup  
    this.regiForm = fb.group({
      'LastikMarkaDesenID': [null, Validators.compose([Validators.required])],
      'DisDerinligi': [null, Validators.compose([Validators.required, Validators.max(99)])],
      'KatOrani': [null, Validators.compose([Validators.required, Validators.max(99)])],
      'EbatID': [null, Validators.compose([Validators.required])], // select
      'Sira': [null, Validators.compose([Validators.required])],
      'ListeAktiflik': [null, Validators.compose([Validators.required])], // input=checkbox
    });

    let id = this.route.snapshot.params.lastikMarkaDesenOzellikId === undefined ? 0 : this.route.snapshot.params.lastikMarkaDesenOzellikId;
    if (isNaN(id)) {
      window.location.href = "/admin/lastik-yonetimi/lastik-marka";
    }
    else {
      this.lastikMarkaDesenOzelliklerService.getLastikMarkaDesenOzellik(id).toPromise().then(response => {
        this.regiForm = fb.group({
          'LastikMarkaDesenOzellikID': [response.LastikMarkaDesenOzellikID],
          'DisDerinligi': [response.DisDerinligi,Validators.compose([Validators.max(99)])],
          'KatOrani': [response.KatOrani,Validators.compose([Validators.max(99)])],
          'EbatID': [response.EbatID, Validators.compose([Validators.required])], // select
          'Sira': [response.Sira, Validators.compose([Validators.required])], // input=number
          'ListeAktiflik': [response.ListeAktiflik, Validators.compose([Validators.required])], // input=checkbox
        });
      });

      this.ebatlarService.getEbatlar().subscribe(response => {
        this.ebatlar = [];
        response.filter(a => a.ListeAktiflik == true).forEach(item => {
          this.ebatlar.push({
            id: String(item.EbatID),
            text: item.Ad
          });
        })
      });
    }
  }

  regiForm: FormGroup;
  ebatlar: Array<Select2OptionData> = [];

  ngOnInit() {
  }

  onFormSubmit(form: LastikMarkaDesenOzellikGuncelle) {
    form.DisDerinligi = form.DisDerinligi == undefined ? 0 : form.DisDerinligi;
    form.KatOrani = form.KatOrani == undefined ? 0 : form.KatOrani;
    this.lastikMarkaDesenOzelliklerService.lastikMarkaDesenOzellikGuncelle(form).subscribe(response => {
      if (response.MessageType === 1) {
        this.toastr.success(response.Message);
        // setTimeout(() => {
        //   this.router.navigate(['/admin/arac-yonetimi/arac-model']);
        // }, 500);
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
