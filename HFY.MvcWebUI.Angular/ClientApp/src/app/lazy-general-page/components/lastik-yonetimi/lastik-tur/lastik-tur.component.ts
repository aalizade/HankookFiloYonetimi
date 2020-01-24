import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { AuthorizationService } from 'src/app/lazy-general-page/services/authorization/authorization.service';
import { LastikTurlerService } from 'src/app/lazy-general-page/services/backend-services/lastik-turler/lastik-turler.service';
import { SettingsService } from 'src/app/lazy-general-page/services/settings/settings.service';
import { DataTablesService } from 'src/app/lazy-general-page/services/data-tables/data-tables.service';
import { DataTablesComponentMessageService } from 'src/app/lazy-general-page/services/rxjs/data-tables-component-message.service';
import { SweetAlertService } from 'src/app/lazy-general-page/services/extra-services/sweet-alert.service';
import { Subscription } from 'rxjs';
import { LastikTurler } from 'src/app/lazy-general-page/classes/lastik-turler/lastik-turler';

declare var Swal: any;

@Component({
  selector: 'app-lastik-tur',
  templateUrl: './lastik-tur.component.html',
  styleUrls: ['./lastik-tur.component.css']
})
export class LastikTurComponent implements OnInit {

  constructor(private http: HttpClient, private route: ActivatedRoute, private authorize: AuthorizationService, private lastikTurService: LastikTurlerService, private settingService: SettingsService, private dataTableService: DataTablesService, private dataTablesRxJs: DataTablesComponentMessageService, private sweetAlert: SweetAlertService) {
    this.subscription = this.dataTablesRxJs.getMessage().subscribe(message => {
      if (message.componentRequest == "LastikTur") this.dataTablesData = message.data
    });
  }

  subscription: Subscription;

  dtOptions: DataTables.Settings = {};
  dataTablesData: LastikTurler[];

  ngOnInit() {
    this.dtOptions = this.dataTableService.getData("LastikTur", 10, new LastikTurler().jqueryDataTableLastikTurler());
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  lastikTurSil(id: number) {
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
        this.lastikTurService.lastikTurSil(id).subscribe(response => {
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
