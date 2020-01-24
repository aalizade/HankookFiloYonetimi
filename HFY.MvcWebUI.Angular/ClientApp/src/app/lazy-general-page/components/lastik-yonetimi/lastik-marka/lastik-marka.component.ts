import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthorizationService } from '../../../services/authorization/authorization.service';
import { SettingsService } from '../../../services/settings/settings.service';
import { DataTablesService } from '../../../services/data-tables/data-tables.service';
import { DataTablesComponentMessageService } from '../../../services/rxjs/data-tables-component-message.service';
import { LastikMarkalar } from '../../../classes/lastik-markalar/lastik-markalar';
import { LastikMarkalarService } from 'src/app/lazy-general-page/services/backend-services/lastik-markalar/lastik-markalar.service';
import { SweetAlertService } from 'src/app/lazy-general-page/services/extra-services/sweet-alert.service';

declare var Swal: any;

@Component({
  selector: 'app-lastik-marka',
  templateUrl: './lastik-marka.component.html',
  styleUrls: ['./lastik-marka.component.css']
})
export class LastikMarkaComponent implements OnInit {

  constructor(private http: HttpClient, private authorize: AuthorizationService, private lastikMarkalarService: LastikMarkalarService, private sweetAlert: SweetAlertService, private settingService: SettingsService, private dataTableService: DataTablesService, private dataTablesRxJs: DataTablesComponentMessageService) {
    this.subscription = this.dataTablesRxJs.getMessage().subscribe(message => {
      if (message.componentRequest == "LastikMarka") this.dataTablesData = message.data
    });
  }

  subscription: Subscription;

  dtOptions: DataTables.Settings = {};
  dataTablesData: LastikMarkalar[];

  ngOnInit() {
    this.dtOptions = this.dataTableService.getData("LastikMarka", 10, new LastikMarkalar().jqueryDataTableLastikMarkalar());
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  lastikMarkaSil(id: number) {
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
        this.lastikMarkalarService.lastikMarkaSil(id).subscribe(response => {
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
