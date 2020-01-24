import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Ebatlar } from '../../../classes/ebat/ebatlar';
import { AuthorizationService } from '../../../services/authorization/authorization.service';
import { SettingsService } from '../../../services/settings/settings.service';
import { DataTablesService } from '../../../services/data-tables/data-tables.service';
import { DataTablesComponentMessageService } from '../../../services/rxjs/data-tables-component-message.service';
import { EbatlarService } from 'src/app/lazy-general-page/services/backend-services/ebatlar/ebatlar.service';
import { SweetAlertService } from 'src/app/lazy-general-page/services/extra-services/sweet-alert.service';

declare var Swal:any;

@Component({
  selector: 'app-ebat',
  templateUrl: './ebat.component.html',
  styleUrls: ['./ebat.component.css']
})
export class EbatComponent implements OnInit {

  constructor(private http: HttpClient, private authorize: AuthorizationService, private ebatService:EbatlarService,private sweetAlert:SweetAlertService, private settingService: SettingsService,private dataTableService:DataTablesService,private dataTablesRxJs: DataTablesComponentMessageService) { 
    this.subscription = this.dataTablesRxJs.getMessage().subscribe(message => {
      if(message.componentRequest == "Ebat") this.dataTablesData = message.data
    });
  }
  
  subscription: Subscription;

  dtOptions: DataTables.Settings = {};
  dataTablesData: Ebatlar[];

  ngOnInit() {
    this.dtOptions = this.dataTableService.getData("Ebat",10,new Ebatlar().jqueryDataTableEbatlar());
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ebatSil(id: number) {
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
        this.ebatService.ebatSil(id).subscribe(response => {
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
