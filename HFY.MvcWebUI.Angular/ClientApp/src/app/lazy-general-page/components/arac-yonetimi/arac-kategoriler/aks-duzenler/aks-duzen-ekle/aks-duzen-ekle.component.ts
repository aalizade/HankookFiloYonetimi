import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ToastrService } from 'src/app/lazy-general-page/services/extra-services/toastr.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AracModellerService } from 'src/app/lazy-general-page/services/backend-services/arac-modeller/arac-modeller.service';
import { AracModelEkle } from 'src/app/lazy-general-page/classes/arac-modeller/models/arac-model-ekle';
import { AracMarkalarService } from 'src/app/lazy-general-page/services/backend-services/arac-markalar/arac-markalar.service';
import { AracKategorilerService } from 'src/app/lazy-general-page/services/backend-services/arac-kategoriler/arac-kategoriler.service';
import { Select2OptionData } from 'ng-select2';
import { AksDuzenlerService } from 'src/app/lazy-general-page/services/backend-services/aks-duzenler/aks-duzenler.service';
import { AksPozisyonlarService } from 'src/app/lazy-general-page/services/backend-services/aks-pozisyonlar/aks-pozisyonlar.service';
import { ExtraInfoHelper } from 'src/app/lazy-general-page/helpers/extra-info-helper/extra-info-helper';
import { AksDuzenEkle } from 'src/app/lazy-general-page/classes/aks-duzenler/models/aks-duzen-ekle';

@Component({
  selector: 'app-aks-duzen-ekle',
  templateUrl: './aks-duzen-ekle.component.html',
  styleUrls: ['./aks-duzen-ekle.component.css']
})
export class AksDuzenEkleComponent implements OnInit {

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private aracKategorilerService: AracKategorilerService, private aksPozisyonlarService:AksPozisyonlarService, private aksDuzenlerService: AksDuzenlerService, private aracModellerService: AracModellerService, private toastr: ToastrService, private router: Router) {
    // initialize FormGroup  
    this.regiForm = fb.group({
      'AracKategoriID': [null, Validators.compose([Validators.required])], // select
      'Ad': [null, Validators.compose([Validators.required, Validators.maxLength(99)])], // input=text
      'Sira': [null, Validators.compose([Validators.required])], // input=number
    });

    let id = this.route.snapshot.params.aracKategoriId === undefined ? undefined : this.route.snapshot.params.aracKategoriId;
    if (isNaN(id)) {
      window.location.href = "/admin/arac-yonetimi/arac-kategori";
    }
    else {
      this.aracKategorilerService.getAracKategori(id).subscribe(response => this.aracKategori = response.Ad);
      this.regiForm = fb.group({
        'AracKategoriID': [id],
        'AksPozisyonID': [null, Validators.compose([Validators.required])], // select
      });
      this.aksPozisyonlarService.getAksPozisyonlar().subscribe(response => {
        this.aksPozisyonlar = [];
        response.filter(a => a.ListeAktiflik == true).forEach(item => {
          this.aksPozisyonlar.push({
            id: String(item.AksPozisyonID),
            text: item.Ad
          });
        })
      })
    }
  }
  
  regiForm: FormGroup;
  aracKategori: string = "";
  aracKategoriId: number;
  extraInfo = new ExtraInfoHelper();
  aksPozisyonlar: Array<Select2OptionData> = [];

  ngOnInit() {

  }

  onFormSubmit(form: AksDuzenEkle) {
    this.aksDuzenlerService.aksDuzenEkle(form).subscribe(response => {
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
