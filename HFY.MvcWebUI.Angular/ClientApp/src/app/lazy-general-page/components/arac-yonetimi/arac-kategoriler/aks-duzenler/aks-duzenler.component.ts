import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { AuthorizationService } from 'src/app/lazy-general-page/services/authorization/authorization.service';
import { AracKategorilerService } from 'src/app/lazy-general-page/services/backend-services/arac-kategoriler/arac-kategoriler.service';
import { SettingsService } from 'src/app/lazy-general-page/services/settings/settings.service';
import { DataTablesService } from 'src/app/lazy-general-page/services/data-tables/data-tables.service';
import { DataTablesComponentMessageService } from 'src/app/lazy-general-page/services/rxjs/data-tables-component-message.service';
import { SweetAlertService } from 'src/app/lazy-general-page/services/extra-services/sweet-alert.service';
import { AksDuzenlerService } from 'src/app/lazy-general-page/services/backend-services/aks-duzenler/aks-duzenler.service';
import { Subscription } from 'rxjs';
import { AksDuzenler } from 'src/app/lazy-general-page/classes/aks-duzenler/aks-duzenler';
import { ExtraInfoHelper } from 'src/app/lazy-general-page/helpers/extra-info-helper/extra-info-helper';
import { AksPozisyonlarService } from 'src/app/lazy-general-page/services/backend-services/aks-pozisyonlar/aks-pozisyonlar.service';
import { AksPozisyonlar } from 'src/app/lazy-general-page/classes/aks-pozisyonlar/aks-pozisyonlar';

declare var Swal: any;

@Component({
  selector: 'app-aks-duzenler',
  templateUrl: './aks-duzenler.component.html',
  styleUrls: ['./aks-duzenler.component.css']
})
export class AksDuzenlerComponent implements OnInit {

  constructor(private http: HttpClient, private route: ActivatedRoute, private authorize: AuthorizationService, private aksPozisyonlarService: AksPozisyonlarService, private aracKategorilerService: AracKategorilerService, private aksDuzenlerService: AksDuzenlerService, private settingService: SettingsService, private dataTableService: DataTablesService, private dataTablesRxJs: DataTablesComponentMessageService, private sweetAlert: SweetAlertService) {
    this.subscription = this.dataTablesRxJs.getMessage().subscribe(message => {
      if (message.componentRequest == "AksDuzen") this.dataTablesData = message.data
    });
  }

  subscription: Subscription;

  dtOptions: DataTables.Settings = {};
  dataTablesData: AksDuzenler[];
  aracKategori: string = "";
  aracKategoriId: number;
  extraInfo = new ExtraInfoHelper();

  ngOnInit() {
    this.extraInfo.UstID = this.route.snapshot.params.aracKategoriId === undefined ? 0 : this.route.snapshot.params.aracKategoriId;
    if (isNaN(this.extraInfo.UstID)) {
      window.location.href = "/admin/arac-yonetimi/arac-kategori";
    }
    else {
      this.aracKategorilerService.getAracKategori(this.extraInfo.UstID).subscribe(response => this.aracKategori = response.Ad);
      this.aracKategoriId = this.extraInfo.UstID;
      this.dtOptions = this.dataTableService.getData("AksDuzen", 10, new AksDuzenler().jqueryDataTableAksDuzenler(), this.extraInfo);
      this.aksPozisyonlarService.getAksPozisyonlar().subscribe(response => {
        this.aksPozisyonlar = response;
      });
    }
  }

  aksPozisyonlar: AksPozisyonlar[];

  getAksPozisyon(aksPozisyonId: number, istek = "Ad") {
    if (istek === "Ad") {
      var finder = this.aksPozisyonlar.find(a => a.AksPozisyonID == aksPozisyonId);
      return finder == undefined ? "-" : finder.Ad;
    }
    else if(istek === "Çeker"){
      //Çeker Var Mı Yok Mu
      var finder = this.aksPozisyonlar.find(a => a.AksPozisyonID == aksPozisyonId);
      return finder == undefined ? "-" : (finder.Ceker == 0 ? "Hayır" : "Evet");
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  aksDuzenSil(id: number) {
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
        this.aksDuzenlerService.aksDuzenSil(id).subscribe(response => {
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
