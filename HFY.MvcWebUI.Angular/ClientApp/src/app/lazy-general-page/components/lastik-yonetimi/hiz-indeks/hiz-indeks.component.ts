import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { AuthorizationService } from 'src/app/lazy-general-page/services/authorization/authorization.service';
import { HizIndekslerService } from 'src/app/lazy-general-page/services/backend-services/hiz-indeksler/hiz-indeksler.service';
import { SettingsService } from 'src/app/lazy-general-page/services/settings/settings.service';
import { DataTablesService } from 'src/app/lazy-general-page/services/data-tables/data-tables.service';
import { DataTablesComponentMessageService } from 'src/app/lazy-general-page/services/rxjs/data-tables-component-message.service';
import { SweetAlertService } from 'src/app/lazy-general-page/services/extra-services/sweet-alert.service';
import { Subscription } from 'rxjs';
import { HizIndeksler } from 'src/app/lazy-general-page/classes/hiz-indeksler/hiz-indeksler';

declare var Swal: any;

@Component({
  selector: 'app-hiz-indeks',
  templateUrl: './hiz-indeks.component.html',
  styleUrls: ['./hiz-indeks.component.css']
})
export class HizIndeksComponent implements OnInit {

  constructor(private http: HttpClient, private route: ActivatedRoute, private authorize: AuthorizationService, private hizIndekslerService: HizIndekslerService, private settingService: SettingsService, private dataTableService: DataTablesService, private dataTablesRxJs: DataTablesComponentMessageService, private sweetAlert: SweetAlertService) {
    this.subscription = this.dataTablesRxJs.getMessage().subscribe(message => {
      if (message.componentRequest == "HizIndeks") this.dataTablesData = message.data
    });
  }

  subscription: Subscription;

  dtOptions: DataTables.Settings = {};
  dataTablesData: HizIndeksler[];

  ngOnInit() {
    this.dtOptions = this.dataTableService.getData("HizIndeks", 10, new HizIndeksler().jqueryDataTableHizIndeksler());
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  hizIndeksSil(id: number) {
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
        this.hizIndekslerService.hizIndeksSil(id).subscribe(response => {
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
