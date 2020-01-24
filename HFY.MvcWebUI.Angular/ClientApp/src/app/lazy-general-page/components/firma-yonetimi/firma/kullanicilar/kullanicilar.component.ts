import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Firmalar } from 'src/app/lazy-general-page/classes/firmalar/firmalar';
import { DataTablesComponentMessageService } from 'src/app/lazy-general-page/services/rxjs/data-tables-component-message.service';
import { SweetAlertService } from 'src/app/lazy-general-page/services/extra-services/sweet-alert.service';
import { Role } from 'src/app/lazy-general-page/services/authorization/roles/role';
import { AuthorizationService } from 'src/app/lazy-general-page/services/authorization/authorization.service';
import { ExtraInfoHelper } from 'src/app/lazy-general-page/helpers/extra-info-helper/extra-info-helper';
import { KullanicilarService } from 'src/app/lazy-general-page/services/backend-services/kullanicilar/kullanicilar.service';
import { FirmalarService } from 'src/app/lazy-general-page/services/backend-services/firmalar/firmalar.service';
import { DataTablesService } from 'src/app/lazy-general-page/services/data-tables/data-tables.service';

declare var Swal: any;

@Component({
  selector: 'app-kullanicilar',
  templateUrl: './kullanicilar.component.html',
  styleUrls: ['./kullanicilar.component.css']
})
export class KullanicilarComponent implements OnInit {

  adminRole: boolean = false;
  constructor(private route: ActivatedRoute, private dataTablesRxJs: DataTablesComponentMessageService, private dataTableService: DataTablesService, private firmalarService: FirmalarService, private kullanicilarService: KullanicilarService, private sweetAlert: SweetAlertService, private authorize: AuthorizationService) {
    this.adminRole = this.authorize.role === Role.Admin ? true : false;

    this.subscription = this.dataTablesRxJs.getMessage().subscribe(message => {
      if (message.componentRequest == "Kullanici") this.dataTablesData = message.data
    });


  }

  subscription: Subscription;

  dtOptions: DataTables.Settings = {};
  dataTablesData: Firmalar[];

  firmaRol: string = "";
  firmaAd: string = "";
  firmaId: number;
  extraInfo = new ExtraInfoHelper();

  ngOnInit() {
    this.extraInfo.UstID = this.route.snapshot.params.firmaId === undefined ? 0 : this.route.snapshot.params.firmaId;
    if (isNaN(this.extraInfo.UstID)) {
      window.location.href = "/admin/firma-yonetimi/firma";
    }
    else {
      this.firmalarService.getFirma(this.extraInfo.UstID).subscribe(response => {
        if (response.Rol === Role.Isletme || response.Rol === Role.Firma || response.Rol === Role.Sube) {
          this.firmaAd = response.FirmaAd;
          this.firmaRol = response.Rol;
        }
        else{
          window.location.href = "/admin/firma-yonetimi/firma";
        }
      }
      );
      this.firmaId = this.extraInfo.UstID;
      this.dtOptions = this.dataTableService.getData("Kullanici", 10, new Firmalar().jqueryDataTableKullanicilar(), this.extraInfo);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  kullaniciSil(id: number) {
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
        this.kullanicilarService.kullaniciSil(id).subscribe(response => {
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
