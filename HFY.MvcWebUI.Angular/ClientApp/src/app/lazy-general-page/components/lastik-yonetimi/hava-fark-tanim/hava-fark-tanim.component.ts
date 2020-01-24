import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { AuthorizationService } from 'src/app/lazy-general-page/services/authorization/authorization.service';
import { SettingsService } from 'src/app/lazy-general-page/services/settings/settings.service';
import { DataTablesService } from 'src/app/lazy-general-page/services/data-tables/data-tables.service';
import { DataTablesComponentMessageService } from 'src/app/lazy-general-page/services/rxjs/data-tables-component-message.service';
import { SweetAlertService } from 'src/app/lazy-general-page/services/extra-services/sweet-alert.service';
import { Subscription } from 'rxjs';
import { HavaFarkTanimlarService } from 'src/app/lazy-general-page/services/backend-services/hava-fark-tanimlar/hava-fark-tanimlar.service';
import { HavaFarkTanimlar } from 'src/app/lazy-general-page/classes/hava-fark-tanimlar/hava-fark-tanimlar';

declare var Swal: any;

@Component({
  selector: 'app-hava-fark-tanim',
  templateUrl: './hava-fark-tanim.component.html',
  styleUrls: ['./hava-fark-tanim.component.css']
})
export class HavaFarkTanimComponent implements OnInit {

  constructor(private http: HttpClient, private route: ActivatedRoute, private authorize: AuthorizationService, private havaFarkTanimlarService: HavaFarkTanimlarService, private settingService: SettingsService, private dataTableService: DataTablesService, private dataTablesRxJs: DataTablesComponentMessageService, private sweetAlert: SweetAlertService) {
    this.subscription = this.dataTablesRxJs.getMessage().subscribe(message => {
      if (message.componentRequest == "HavaFarkTanim") this.dataTablesData = message.data
    });
  }

  subscription: Subscription;

  dtOptions: DataTables.Settings = {};
  dataTablesData: HavaFarkTanimlar[];

  ngOnInit() {
    this.dtOptions = this.dataTableService.getData("HavaFarkTanim", 10, new HavaFarkTanimlar().jqueryDataTableHavaFarkTanimlar());
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  havaFarkSil(id: number) {
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
        this.havaFarkTanimlarService.havaFarkTanimSil(id).subscribe(response => {
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
