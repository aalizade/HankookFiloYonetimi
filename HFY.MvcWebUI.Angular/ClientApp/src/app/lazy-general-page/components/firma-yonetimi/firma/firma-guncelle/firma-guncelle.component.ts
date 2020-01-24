import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'src/app/lazy-general-page/services/extra-services/toastr.service';
import { Firmalar } from 'src/app/lazy-general-page/classes/firmalar/firmalar';
import { FirmaGuncelle } from 'src/app/lazy-general-page/classes/firmalar/models/firma-guncelle';
import { FirmalarService } from 'src/app/lazy-general-page/services/backend-services/firmalar/firmalar.service';
import { ParaBirimler } from 'src/app/lazy-general-page/classes/para-birimler/para-birimler';
import { ParaBirimlerService } from 'src/app/lazy-general-page/services/backend-services/para-birimler/para-birimler.service';
import { Select2OptionData } from 'ng-select2';
import { AuthorizationService } from 'src/app/lazy-general-page/services/authorization/authorization.service';
import { Role } from 'src/app/lazy-general-page/services/authorization/roles/role';

@Component({
  selector: 'app-firma-guncelle',
  templateUrl: './firma-guncelle.component.html',
  styleUrls: ['./firma-guncelle.component.css']
})
export class FirmaGuncelleComponent implements OnInit {

  adminRole: boolean = false;
  firmaRol: string = "";
  isletmeGuncelle: boolean = false;
  firmaGuncelle: boolean = false;
  subeGuncelle:boolean = false;
  constructor(private authorize: AuthorizationService, private fb: FormBuilder, private route: ActivatedRoute, private firmaService: FirmalarService, private paraBirimlerService: ParaBirimlerService, private toastr: ToastrService, private router: Router, private datePipe: DatePipe) {
    this.adminRole = this.authorize.role === Role.Admin ? true : false;
    // initialize FormGroup  
    this.regiForm = fb.group({
      'Rol': [null, Validators.compose([Validators.required, Validators.maxLength(18)])],
      'BagliOlduguID': [0, Validators.compose([Validators.required])],
      'FirmaAd': [null, Validators.compose([Validators.required, Validators.maxLength(90)])],
      'FirmaKisaAd': [null],
      'TelefonNumarasi': [null, Validators.compose([Validators.required, Validators.maxLength(45)])],
      'VergiTCNo': [null, Validators.compose([Validators.required, Validators.maxLength(45)])],
      'Adres': [null, Validators.compose([Validators.required, Validators.maxLength(230)])],
      'FaturaAdresi': [null, Validators.compose([Validators.required, Validators.maxLength(230)])],
      'Eposta': [null, Validators.compose([Validators.required, Validators.maxLength(45), Validators.email])],
      'YetkiliKisi': [null],
      'Sifre': [null, Validators.compose([Validators.maxLength(25)])],
      'PsiBar': [null, Validators.compose([Validators.required, Validators.maxLength(5)])],
      'DisDerinligiSayisi': [null, Validators.compose([Validators.required, Validators.maxLength(2)])],
      'ParaBirimID': [null, Validators.compose([Validators.required])],
      'KayitTarihi': [null, Validators.compose([Validators.required])],
      'ListeAktiflik': [null, Validators.compose([Validators.required])],
    });

    let id = this.route.snapshot.params.id === undefined ? 0 : this.route.snapshot.params.id;
    if (isNaN(id)) {
      window.location.href = "/admin/firma-yonetimi/firma";
    }
    else {
      this.firmaService.getFirma(id).subscribe(response => {
        let kullaniciRolBelirle = "Kayıt";
        if (response.Rol === Role.Isletme) { kullaniciRolBelirle = "İşletme"; this.isletmeGuncelle = true; }
        else if (response.Rol === Role.Firma) { kullaniciRolBelirle = Role.Firma; this.firmaGuncelle = true; }
        else if (response.Rol === Role.Sube) { kullaniciRolBelirle = "Şube"; this.subeGuncelle = true; }

        this.firmaRol = kullaniciRolBelirle;
        //
        this.firmaService.getAllActivesWithBagliID().subscribe(response => {
          this.firmalar = response
          this.firmalar = this.firmalar.filter(a => a.FirmaID !== +id && a.Rol === Role.Firma);
        });
        this.paraBirimlerService.getParaBirimler().subscribe(paraBirimResponse => {
          this.paraBirimler = [];
          paraBirimResponse.forEach(item => {
            this.paraBirimler.push({
              id: String(item.ParaBirimID),
              text: item.Kod
            });
          })
        });
        //
        this.regiForm = fb.group({
          'FirmaID': [response.FirmaID],
          'Rol': [response.Rol, Validators.compose([Validators.required, Validators.maxLength(18)])],
          'BagliOlduguID': [response.BagliOlduguID, Validators.compose([Validators.required])],
          'FirmaAd': [response.FirmaAd, Validators.compose([Validators.required, Validators.maxLength(90)])],
          'FirmaKisaAd': [response.FirmaKisaAd],
          'TelefonNumarasi': [response.TelefonNumarasi, Validators.compose([Validators.required, Validators.maxLength(45)])],
          'VergiTCNo': [response.VergiTCNo, Validators.compose([Validators.required, Validators.maxLength(45)])],
          'Adres': [response.Adres, Validators.compose([Validators.required, Validators.maxLength(230)])],
          'FaturaAdresi': [response.FaturaAdresi, Validators.compose([Validators.required, Validators.maxLength(230)])],
          'Eposta': [response.Eposta, Validators.compose([Validators.required, Validators.maxLength(45)])],
          'YetkiliKisi': [response.YetkiliKisi],
          'Sifre': [null, Validators.compose([Validators.maxLength(25)])],
          'PsiBar': [response.PsiBar, Validators.compose([Validators.required, Validators.maxLength(5)])],
          'DisDerinligiSayisi': [response.DisDerinligiSayisi, Validators.compose([Validators.required, Validators.maxLength(2)])],
          'ParaBirimID': [response.ParaBirimID, Validators.compose([Validators.required])],
          'KayitTarihi': [this.datePipe.transform(response.KayitTarihi, "yyyy-MM-dd"), Validators.compose([Validators.required])],
          'ListeAktiflik': [response.ListeAktiflik, Validators.compose([Validators.required])],
        });
      });
    }
  }

  regiForm: FormGroup;
  firmalar: Firmalar[];
  paraBirimler: Array<Select2OptionData> = [];

  ngOnInit() {
  }

  onFormSubmit(form: FirmaGuncelle) {
    this.firmaService.firmaGuncelle(form).subscribe(response => {
      if (response.MessageType === 1) {
        this.toastr.success(response.Message);
        setTimeout(() => {
          if(this.isletmeGuncelle){
            this.router.navigate(['/admin/firma-yonetimi/isletme']);
          }
          else if(this.firmaGuncelle){
            this.router.navigate(['/admin/firma-yonetimi/firma']);
          }
          else if(this.subeGuncelle){
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
