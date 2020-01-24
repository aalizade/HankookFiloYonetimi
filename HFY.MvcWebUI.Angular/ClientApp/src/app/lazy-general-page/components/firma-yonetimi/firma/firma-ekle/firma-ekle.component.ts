import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'src/app/lazy-general-page/services/extra-services/toastr.service';
import { Firmalar } from 'src/app/lazy-general-page/classes/firmalar/firmalar';
import { FirmaEkle } from 'src/app/lazy-general-page/classes/firmalar/models/firma-ekle';
import { FirmalarService } from 'src/app/lazy-general-page/services/backend-services/firmalar/firmalar.service';
import { ParaBirimlerService } from 'src/app/lazy-general-page/services/backend-services/para-birimler/para-birimler.service';
import { Select2OptionData } from 'ng-select2';
import { AuthorizationService } from 'src/app/lazy-general-page/services/authorization/authorization.service';
import { Role } from 'src/app/lazy-general-page/services/authorization/roles/role';

@Component({
  selector: 'app-firma-ekle',
  templateUrl: './firma-ekle.component.html',
  styleUrls: ['./firma-ekle.component.css']
})
export class FirmaEkleComponent implements OnInit {

  adminRole: boolean = false;
  isletmeEkle: boolean = false;
  firmaEkle: boolean = false;
  subeEkle:boolean = false;
  constructor(private authorize: AuthorizationService, private fb: FormBuilder, private route: ActivatedRoute, private firmaService: FirmalarService, private paraBirimlerService: ParaBirimlerService, private toastr: ToastrService, private router: Router) {
    this.adminRole = this.authorize.role === Role.Admin ? true : false;
    if (this.authorize.role === Role.SubeKullanicisi) {
      this.router.navigate(['/admin/firma-yonetimi/firma']);
    }

    this.isletmeEkle = this.route.snapshot.params.rolTip === "isletme" ? true : false;
    this.firmaEkle = this.route.snapshot.params.rolTip === "firma" ? true : false;
    this.subeEkle = this.route.snapshot.params.rolTip === "sube" ? true : false;

    // initialize FormGroup  
    this.regiForm = fb.group({
      'Rol': [null, Validators.compose([Validators.required, Validators.maxLength(18)])],
      'BagliOlduguID': [0, Validators.compose([Validators.required])],
      'FirmaAd': [null, Validators.compose([Validators.required, Validators.maxLength(90)])],
      'FirmaKisaAd': [null],
      'TelefonNumarasi': [null, Validators.compose([Validators.required, Validators.maxLength(45)])],
      'VergiTCNo': [null, Validators.compose([Validators.required, Validators.maxLength(45)])],
      'Adres': [null, Validators.compose([Validators.required, Validators.maxLength(230)])],
      'FaturaAdresi': ["Fatura Adresi", Validators.compose([Validators.required, Validators.maxLength(230)])],
      'Eposta': [null, Validators.compose([Validators.required, Validators.maxLength(45), Validators.email])],
      'YetkiliKisi': [null],
      'Sifre': [112233, Validators.compose([Validators.required, Validators.maxLength(25)])],
      'PsiBar': ["psi", Validators.compose([Validators.required, Validators.maxLength(5)])],
      'DisDerinligiSayisi': [this.isletmeEkle === true ? "0" : "3", Validators.compose([Validators.required, Validators.maxLength(2)])],
      'ParaBirimID': [this.isletmeEkle === true ? 0 : null, Validators.compose([Validators.required])],
      'KayitTarihi': [null, Validators.compose([Validators.required])],
    });
    this.firmaService.getAllActivesWithBagliID().subscribe(response => {
      this.firmalar = response
    });

    this.firmaService.getIsletmeler().subscribe(response => {
      this.isletmeler = response
    });

    this.paraBirimlerService.getParaBirimler().subscribe(paraBirimResponse => {
      this.paraBirimler = [];
      paraBirimResponse.forEach(item => {
        this.paraBirimler.push({
          id: String(item.ParaBirimID),
          text: item.Kod
        });
      });
    });
  }

  regiForm: FormGroup;
  firmalar: Firmalar[];
  isletmeler: Firmalar[];
  paraBirimler: Array<Select2OptionData> = [];

  ngOnInit() {

  }

  onFormSubmit(form: FirmaEkle) {
    this.firmaService.firmaEkle(form).subscribe(response => {
      if (response.MessageType === 1) {
        this.toastr.success(response.Message);
        setTimeout(() => {
          if(this.isletmeEkle){
            this.router.navigate(['/admin/firma-yonetimi/isletme']);
          }
          else if(this.firmaEkle){
            this.router.navigate(['/admin/firma-yonetimi/firma']);
          }
          else if(this.subeEkle){
            this.router.navigate(['/admin/firma-yonetimi/sube']);
          }
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
