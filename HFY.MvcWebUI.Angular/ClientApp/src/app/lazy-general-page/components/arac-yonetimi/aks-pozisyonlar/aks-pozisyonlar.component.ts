import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { AuthorizationService } from '../../../services/authorization/authorization.service';
import { SettingsService } from '../../../services/settings/settings.service';
import { DataTablesService } from '../../../services/data-tables/data-tables.service';
import { DataTablesComponentMessageService } from '../../../services/rxjs/data-tables-component-message.service';
import { SweetAlertService } from '../../../services/extra-services/sweet-alert.service';
import { Firmalar } from '../../../classes/firmalar/firmalar';
import { FirmalarService } from '../../../services/backend-services/firmalar/firmalar.service';
import { AksPozisyonlar } from 'src/app/lazy-general-page/classes/aks-pozisyonlar/aks-pozisyonlar';
import { AksPozisyonlarService } from 'src/app/lazy-general-page/services/backend-services/aks-pozisyonlar/aks-pozisyonlar.service';

declare var Swal: any

@Component({
  selector: 'app-aks-pozisyonlar',
  templateUrl: './aks-pozisyonlar.component.html',
  styleUrls: ['./aks-pozisyonlar.component.css']
})
export class AksPozisyonlarComponent implements OnInit {

  constructor(private http: HttpClient,private route: ActivatedRoute, private authorize: AuthorizationService,private aksPozisyonlarService:AksPozisyonlarService, private settingService: SettingsService,private dataTableService:DataTablesService,private dataTablesRxJs: DataTablesComponentMessageService,private sweetAlert:SweetAlertService) { 
    this.subscription = this.dataTablesRxJs.getMessage().subscribe(message => {
      if(message.componentRequest == "AksPozisyon") this.dataTablesData = message.data
    });
  }
  
  subscription: Subscription;

  dtOptions: DataTables.Settings = {};
  dataTablesData: Firmalar[];

  ngOnInit() {
    this.dtOptions = this.dataTableService.getData("AksPozisyon",10,new AksPozisyonlar().jqueryDataTableAksPozisyonlar());
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  aksPozisyonSil(id: number) {
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
        this.aksPozisyonlarService.aksPozisyonSil(id).subscribe(response => {
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

