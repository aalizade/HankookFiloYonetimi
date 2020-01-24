import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from 'src/app/lazy-general-page/services/authorization/authorization.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FirmalarService } from 'src/app/lazy-general-page/services/backend-services/firmalar/firmalar.service';
import { KullanicilarService } from 'src/app/lazy-general-page/services/backend-services/kullanicilar/kullanicilar.service';
import { ParaBirimlerService } from 'src/app/lazy-general-page/services/backend-services/para-birimler/para-birimler.service';
import { ToastrService } from 'src/app/lazy-general-page/services/extra-services/toastr.service';
import { Role } from 'src/app/lazy-general-page/services/authorization/roles/role';
import { Select2OptionData } from 'ng-select2';
import { DatePipe } from '@angular/common';
import { FirmaGuncelle } from 'src/app/lazy-general-page/classes/firmalar/models/firma-guncelle';

@Component({
  selector: 'app-kullanici-guncelle',
  templateUrl: './kullanici-guncelle.component.html',
  styleUrls: ['./kullanici-guncelle.component.css']
})
export class KullaniciGuncelleComponent implements OnInit {

  adminRole: boolean = false;
  firmaAd: string = "";
  firmaRol: string = "";
  rolName: string = "";
  rolId: string = "";
  constructor(private authorize: AuthorizationService, private fb: FormBuilder,
    private route: ActivatedRoute, private firmaService: FirmalarService, private kullanicilarService: KullanicilarService,
    private paraBirimlerService: ParaBirimlerService, private toastr: ToastrService, private router: Router, private datePipe: DatePipe) {
    this.adminRole = this.authorize.role === Role.Admin ? true : false;
    if (this.authorize.role !== Role.Admin) {
      this.router.navigate(['/admin/firma-yonetimi/firma']);
    }
    let kullaniciId = this.route.snapshot.params.id === undefined ? 0 : this.route.snapshot.params.id;

    // initialize FormGroup  
    this.regiForm = fb.group({
      'Rol': [null, Validators.compose([Validators.required, Validators.maxLength(18)])],
      'BagliOlduguID': [null, Validators.compose([Validators.required])],
      'FirmaAd': [null, Validators.compose([Validators.required, Validators.maxLength(90)])],
      'FirmaKisaAd': [null, Validators.compose([Validators.required, Validators.maxLength(45)])],
      'TelefonNumarasi': [null, Validators.compose([Validators.required, Validators.maxLength(45)])],
      'VergiTCNo': [null, Validators.compose([Validators.required, Validators.maxLength(45)])],
      'Adres': [null, Validators.compose([Validators.required, Validators.maxLength(230)])],
      'FaturaAdresi': ["Fatura Adresi", Validators.compose([Validators.required, Validators.maxLength(230)])],
      'Eposta': [null, Validators.compose([Validators.required, Validators.maxLength(45), Validators.email])],
      'Sifre': [null, Validators.compose([Validators.required, Validators.maxLength(25)])],
      'PsiBar': ["psi", Validators.compose([Validators.required, Validators.maxLength(5)])],
      'DisDerinligiSayisi': ["3", Validators.compose([Validators.required, Validators.maxLength(2)])],
      'ParaBirimID': [null, Validators.compose([Validators.required])],
      'KayitTarihi': [null, Validators.compose([Validators.required])],
      'KullaniciGorevi': [null],
      'KullaniciKisaKod': [null]
    });

    this.kullanicilarService.getKullanici(kullaniciId).subscribe(firmaResponse => {
      if (firmaResponse.Rol !== Role.Admin && firmaResponse.Rol !== Role.Isletme && firmaResponse.Rol !== Role.Firma && firmaResponse.Rol !== Role.Sube) {
        this.firmaAd = firmaResponse.FirmaAd;
        this.firmaRol = firmaResponse.Rol;

        if (this.firmaRol === Role.IsletmeKullanicisi) { this.rolName = "İşletme Kullanıcısı"; this.rolId = Role.IsletmeKullanicisi }
        else if (this.firmaRol === Role.FirmaKullanicisi) { this.rolName = "Firma Kullanıcısı"; this.rolId = Role.FirmaKullanicisi }
        else if (this.firmaRol === Role.SubeKullanicisi) { this.rolName = "Şube Kullanıcısı"; this.rolId = Role.SubeKullanicisi }

        this.firmaService.getFirma(firmaResponse.BagliOlduguID).subscribe(bagliOlduguFirmaResponse => this.firmaAd = bagliOlduguFirmaResponse.FirmaAd)

        this.regiForm = fb.group({
          'FirmaID': [firmaResponse.FirmaID],
          'Rol': [firmaResponse.Rol, Validators.compose([Validators.required, Validators.maxLength(18)])],
          'BagliOlduguID': [firmaResponse.BagliOlduguID, Validators.compose([Validators.required])],
          'FirmaAd': [firmaResponse.FirmaAd, Validators.compose([Validators.required, Validators.maxLength(90)])],
          'FirmaKisaAd': [firmaResponse.FirmaKisaAd, Validators.compose([Validators.required, Validators.maxLength(45)])],
          'TelefonNumarasi': [firmaResponse.TelefonNumarasi, Validators.compose([Validators.required, Validators.maxLength(45)])],
          'VergiTCNo': [firmaResponse.VergiTCNo, Validators.compose([Validators.required, Validators.maxLength(45)])],
          'Adres': [firmaResponse.Adres, Validators.compose([Validators.required, Validators.maxLength(230)])],
          'FaturaAdresi': [firmaResponse.FaturaAdresi, Validators.compose([Validators.required, Validators.maxLength(230)])],
          'Eposta': [firmaResponse.Eposta, Validators.compose([Validators.required, Validators.maxLength(45)])],
          'Sifre': [null, Validators.compose([Validators.maxLength(25)])],
          'PsiBar': [firmaResponse.PsiBar, Validators.compose([Validators.required, Validators.maxLength(5)])],
          'DisDerinligiSayisi': [firmaResponse.DisDerinligiSayisi, Validators.compose([Validators.required, Validators.maxLength(2)])],
          'ParaBirimID': [firmaResponse.ParaBirimID, Validators.compose([Validators.required])],
          'KayitTarihi': [this.datePipe.transform(firmaResponse.KayitTarihi, "yyyy-MM-dd"), Validators.compose([Validators.required])],
          'KullaniciGorevi': [firmaResponse.KullaniciGorevi],
          'KullaniciKisaKod': [firmaResponse.KullaniciKisaKod],
          'ListeAktiflik': [firmaResponse.ListeAktiflik, Validators.compose([Validators.required])],
        });
      }
      else {
        window.location.href = "/admin/firma-yonetimi/firma";
      }

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
  paraBirimler: Array<Select2OptionData> = [];

  ngOnInit() {
  }

  onFormSubmit(form: FirmaGuncelle) {
    this.firmaService.firmaGuncelle(form).subscribe(response => {
      if (response.MessageType === 1) {
        this.toastr.success(response.Message);
        setTimeout(() => {
          $("#birOncekiSayfayaDon").click();
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
