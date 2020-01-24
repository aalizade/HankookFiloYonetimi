import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataTablesComponentMessageService } from 'src/app/lazy-general-page/services/rxjs/data-tables-component-message.service';
import { DataTablesService } from 'src/app/lazy-general-page/services/data-tables/data-tables.service';
import { FirmalarService } from 'src/app/lazy-general-page/services/backend-services/firmalar/firmalar.service';
import { KullanicilarService } from 'src/app/lazy-general-page/services/backend-services/kullanicilar/kullanicilar.service';
import { SweetAlertService } from 'src/app/lazy-general-page/services/extra-services/sweet-alert.service';
import { AuthorizationService } from 'src/app/lazy-general-page/services/authorization/authorization.service';
import { Role } from 'src/app/lazy-general-page/services/authorization/roles/role';
import { Subscription } from 'rxjs';
import { Firmalar } from 'src/app/lazy-general-page/classes/firmalar/firmalar';
import { ExtraInfoHelper } from 'src/app/lazy-general-page/helpers/extra-info-helper/extra-info-helper';
import { KullaniciYetkiler } from 'src/app/lazy-general-page/classes/kullanici-yetkiler/kullanici-yetkiler';
import { KullaniciYetkilerService } from 'src/app/lazy-general-page/services/backend-services/kullanici-yetkiler/kullanici-yetkiler.service';

declare var Swal: any;

@Component({
  selector: 'app-kullanici-yetki',
  templateUrl: './kullanici-yetki.component.html',
  styleUrls: ['./kullanici-yetki.component.css']
})
export class KullaniciYetkiComponent implements OnInit {

  adminRole: boolean = false;
  olusturanKisiGirisYapanKisiMi: boolean = false;
  constructor(private route: ActivatedRoute, private dataTablesRxJs: DataTablesComponentMessageService, private dataTableService: DataTablesService, private firmalarService: FirmalarService, private kullaniciYetkilerService: KullaniciYetkilerService, private sweetAlert: SweetAlertService, private authorize: AuthorizationService) {
    this.adminRole = this.authorize.role === Role.Admin ? true : false;

    this.subscription = this.dataTablesRxJs.getMessage().subscribe(message => {
      if (message.componentRequest == "KullaniciYetki") this.dataTablesData = message.data
    });

  }

  subscription: Subscription;

  dtOptions: DataTables.Settings = {};
  dataTablesData: KullaniciYetkiler[];

  firmalar: Firmalar[];
  firmaRol: string = "";
  firmaAd: string = "";
  firmaId: number;
  extraInfo = new ExtraInfoHelper();

  ngOnInit() {
    this.extraInfo.UstID = this.route.snapshot.params.ilgiliId === undefined ? 0 : this.route.snapshot.params.ilgiliId;
    if (isNaN(this.extraInfo.UstID)) {
      window.location.href = "/admin/firma-yonetimi/firma";
    }
    else {
      this.firmalarService.getTumKullanicilar().subscribe(firmaResponse => {
        this.firmalar = firmaResponse;
      })
      this.firmalarService.getFirma(this.extraInfo.UstID).subscribe(response => {
        if (response.Rol === Role.Isletme || response.Rol === Role.Firma || response.Rol === Role.Sube) {
          this.firmaAd = response.FirmaAd;
          this.firmaRol = response.Rol;
          this.authorize.GetUserTokenInfo().subscribe(userTokenInfoResponse => {
            this.olusturanKisiGirisYapanKisiMi = response.OlusturanId === Number(userTokenInfoResponse.Result["id"]) ? true : false;
          });
        }
        else {
          window.location.href = "/admin/firma-yonetimi/firma";
        }
      }
      );
      this.firmaId = this.extraInfo.UstID;
      this.dtOptions = this.dataTableService.getData("KullaniciYetki", 10, new KullaniciYetkiler().jqueryDataTableKullaniciYetkiler(), this.extraInfo);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getFirmaAd_KisaAd(firmaId: number, istekTipi: string = "FirmaAd") {
    var finder = this.firmalar.find(a => a.FirmaID === firmaId);
    if (istekTipi === "FirmaAd") {
      return finder !== undefined ? finder.FirmaAd : "-";
    }
    else {
      return finder !== undefined ? finder.FirmaKisaAd : "-";
    }
  }

  kullaniciYetkiSil(id: number) {
    Swal.fire({
      title: 'Emin misiniz?',
      text: "Seçtiğiniz kayıt silinecektir. Bu işlem geri alınamaz.",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Evet!',
      cancelButtonText: "Hayır!"
    }).then((result) => {
      if (result.value) {
        this.kullaniciYetkilerService.kullaniciYetkiSil(id).subscribe(response => {
          if (response.MessageType === 1) {
            this.sweetAlert.success(response.Message);
            setTimeout(() => {
              window.location.reload(true);
            }, 500);
          }
          else {
            if (response.ErrorList !== undefined) {
              response.ErrorList.forEach(item => {
                this.sweetAlert.error(item.ErrorMessage);
              })
            }
            if (response.Error !== "" && response.Error !== undefined) {
              this.sweetAlert.error(response.Error);
            }
          }
        })
      }
    })
  }

}
