import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { AuthorizationService } from 'src/app/lazy-general-page/services/authorization/authorization.service';
import { SettingsService } from 'src/app/lazy-general-page/services/settings/settings.service';
import { DataTablesService } from 'src/app/lazy-general-page/services/data-tables/data-tables.service';
import { DataTablesComponentMessageService } from 'src/app/lazy-general-page/services/rxjs/data-tables-component-message.service';
import { SweetAlertService } from 'src/app/lazy-general-page/services/extra-services/sweet-alert.service';
import { Subscription } from 'rxjs';
import { AracMarkalar } from 'src/app/lazy-general-page/classes/arac-markalar/arac-markalar';
import { AracModellerService } from 'src/app/lazy-general-page/services/backend-services/arac-modeller/arac-modeller.service';
import { AracModeller } from 'src/app/lazy-general-page/classes/arac-modeller/arac-modeller';
import { ExtraInfoHelper } from 'src/app/lazy-general-page/helpers/extra-info-helper/extra-info-helper';
import { AracMarkalarService } from 'src/app/lazy-general-page/services/backend-services/arac-markalar/arac-markalar.service';
import { AracKategoriler } from 'src/app/lazy-general-page/classes/arac-kategoriler/arac-kategoriler';
import { AracKategorilerService } from 'src/app/lazy-general-page/services/backend-services/arac-kategoriler/arac-kategoriler.service';

declare var Swal: any

@Component({
  selector: 'app-arac-modeller',
  templateUrl: './arac-modeller.component.html',
  styleUrls: ['./arac-modeller.component.css']
})
export class AracModellerComponent implements OnInit {

  constructor(private http: HttpClient, private route: ActivatedRoute, private authorize: AuthorizationService, private aracKategorilerService:AracKategorilerService, private aracMarkalarService:AracMarkalarService, private aracModellerService: AracModellerService, private settingService: SettingsService, private dataTableService: DataTablesService, private dataTablesRxJs: DataTablesComponentMessageService, private sweetAlert: SweetAlertService) {
    this.subscription = this.dataTablesRxJs.getMessage().subscribe(message => {
      if (message.componentRequest == "AracModel") this.dataTablesData = message.data
    });
    this.aracKategorilerService.getAracKategoriler().subscribe(response => {
      this.aracKategoriler = response;
    })
  }

  subscription: Subscription;

  dtOptions: DataTables.Settings = {};
  dataTablesData: AracModeller[];
  
  aracKategoriler:AracKategoriler[];

  aracMarka: string = "";
  aracMarkaId: number;
  extraInfo = new ExtraInfoHelper();

  ngOnInit() {
    this.extraInfo.UstID = this.route.snapshot.params.aracMarkaId === undefined ? 0 : this.route.snapshot.params.aracMarkaId;
    if (isNaN(this.extraInfo.UstID)) {
      window.location.href = "/admin/arac-yonetimi/arac-marka";
    }
    else {
      this.aracMarkalarService.getAracMarka(this.extraInfo.UstID).subscribe(response=> this.aracMarka = response.Ad);
      this.aracMarkaId = this.extraInfo.UstID;
      this.dtOptions = this.dataTableService.getData("AracModel", 10, new AracModeller().jqueryDataTableAracModeller(), this.extraInfo);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getAracKategori(aracKategoriId:number){
    var finder = this.aracKategoriler.find(a=> a.AracKategoriID == aracKategoriId);
    return finder == undefined ? "-" : finder.Ad;
  }

  aracModelSil(id: number) {
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
        this.aracModellerService.aracModelSil(id).subscribe(response => {
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
