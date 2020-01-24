import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'src/app/lazy-general-page/services/extra-services/toastr.service';
import { FirmalarService } from 'src/app/lazy-general-page/services/backend-services/firmalar/firmalar.service';
import { Firmalar } from 'src/app/lazy-general-page/classes/firmalar/firmalar';
import { ExtraInfoHelper } from 'src/app/lazy-general-page/helpers/extra-info-helper/extra-info-helper';
import { AuthorizationService } from 'src/app/lazy-general-page/services/authorization/authorization.service';
import { Select2OptionData } from 'ng-select2';
import { Role } from 'src/app/lazy-general-page/services/authorization/roles/role';
import { KullaniciYetkiEkle } from 'src/app/lazy-general-page/classes/kullanici-yetkiler/models/kullanici-yetki-ekle';
import { KullaniciYetkilerService } from 'src/app/lazy-general-page/services/backend-services/kullanici-yetkiler/kullanici-yetkiler.service';

@Component({
  selector: 'app-kullanici-yetki-ekle',
  templateUrl: './kullanici-yetki-ekle.component.html',
  styleUrls: ['./kullanici-yetki-ekle.component.css']
})
export class KullaniciYetkiEkleComponent implements OnInit {

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private authorize: AuthorizationService,
    private kullaniciYetkilerService: KullaniciYetkilerService,
    private firmalarService: FirmalarService, private toastr: ToastrService, private router: Router) {

  }

  emsalKullanicilar: Array<Select2OptionData> = [];
  firmaRol: string = "";
  firmaAd: string = "";
  firmaId: number;
  seciliFirmaId: string;
  extraInfo = new ExtraInfoHelper();

  ngOnInit() {
    this.extraInfo.UstID = this.route.snapshot.params.ilgiliId === undefined ? 0 : this.route.snapshot.params.ilgiliId;
    if (isNaN(this.extraInfo.UstID)) {
      window.location.href = "/admin/firma-yonetimi/firma";
    }
    else {
      this.firmalarService.getEmsalIsletmeKullanicilari(this.extraInfo.UstID).subscribe(firmaResponse => {
        this.emsalKullanicilar = [];
        firmaResponse.filter(a => a.ListeAktiflik == true).forEach(item => {
          this.emsalKullanicilar.push({
            id: String(item.FirmaID),
            text: item.FirmaAd
          });
        })
      });
      this.firmalarService.getFirma(this.extraInfo.UstID).subscribe(response => {
        this.authorize.GetUserTokenInfo().subscribe(userTokenInfoResponse => {
          let olusturanKisiGirisYapanKisiMi = response.OlusturanId === Number(userTokenInfoResponse.Result["id"]) ? true : false;
          if (this.authorize.role === Role.Admin || olusturanKisiGirisYapanKisiMi) {
            this.firmaAd = response.FirmaAd;
            this.firmaRol = response.Rol;
          }
          else {
            window.location.href = "/admin/firma-yonetimi/firma";
          }
        });
      }
      );
    }
  }

  kullaniciYetkiEkle() {
    if (this.seciliFirmaId !== null && this.seciliFirmaId !== undefined) {
      let kullaniciYetkiEkle = new KullaniciYetkiEkle();
      kullaniciYetkiEkle.FirmaID = Number(this.seciliFirmaId);
      kullaniciYetkiEkle.IlgiliID = this.extraInfo.UstID;
      kullaniciYetkiEkle.YetkiTip = this.firmaRol;

      this.kullaniciYetkilerService.kullaniciYetkiEkle(kullaniciYetkiEkle).subscribe(response => {
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
      })
    }
    else{
      this.toastr.error("Lütfen kullanıcı seçiniz.");
    }
  }

}
