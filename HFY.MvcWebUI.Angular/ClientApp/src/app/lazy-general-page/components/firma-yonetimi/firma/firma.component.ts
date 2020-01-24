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
import { Role } from 'src/app/lazy-general-page/services/authorization/roles/role';

declare var Swal: any

@Component({
  selector: 'app-firma',
  templateUrl: './firma.component.html',
  styleUrls: ['./firma.component.css']
})
export class FirmaComponent implements OnInit {

  adminRole: boolean = false;
  isletmeRole: boolean = false;
  subeRole: boolean = false;
  constructor(private http: HttpClient, private route: ActivatedRoute, private authorize: AuthorizationService, private settingService: SettingsService, private dataTableService: DataTablesService, private dataTablesRxJs: DataTablesComponentMessageService, private firmaService: FirmalarService, private sweetAlert: SweetAlertService) {
   
    this.adminRole = this.authorize.role === Role.Admin ? true : false;
    this.isletmeRole = (this.authorize.role === Role.IsletmeKullanicisi) ? true : false;
    this.subeRole = (this.authorize.role === Role.SubeKullanicisi) ? true : false;

    this.subscription = this.dataTablesRxJs.getMessage().subscribe(message => {
      if (message.componentRequest == "Firma") this.dataTablesData = message.data
    });

    this.firmaService.getIsletmeler().subscribe(firmaResponse=>{
      this.anaIsletmeler = firmaResponse;
    });
    
  }

  subscription: Subscription;

  dtOptions: DataTables.Settings = {};
  dataTablesData: Firmalar[];
  anaIsletmeler: Firmalar[];

  ngOnInit() {
    this.dtOptions = this.dataTableService.getData("Firma", 10, new Firmalar().jqueryDataTableFirmalar());
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getAnaIsletme(firmaId:number){
    var finder = this.anaIsletmeler.find(a=> a.FirmaID === firmaId);
    return finder === undefined ? "-" : finder.FirmaAd
  }

  firmaSil(id: number) {
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
        this.firmaService.firmaSil(id).subscribe(response => {
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
