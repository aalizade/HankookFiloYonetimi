import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { AuthorizationService } from 'src/app/lazy-general-page/services/authorization/authorization.service';
import { LastikMarkaDesenlerService } from 'src/app/lazy-general-page/services/backend-services/lastik-marka-desenler/lastik-marka-desenler.service';
import { SettingsService } from 'src/app/lazy-general-page/services/settings/settings.service';
import { DataTablesService } from 'src/app/lazy-general-page/services/data-tables/data-tables.service';
import { DataTablesComponentMessageService } from 'src/app/lazy-general-page/services/rxjs/data-tables-component-message.service';
import { SweetAlertService } from 'src/app/lazy-general-page/services/extra-services/sweet-alert.service';
import { Subscription } from 'rxjs';
import { LastikMarkaDesenler } from 'src/app/lazy-general-page/classes/lastik-marka-desenler/lastik-marka-desenler';
import { ExtraInfoHelper } from 'src/app/lazy-general-page/helpers/extra-info-helper/extra-info-helper';
import { LastikMarkalarService } from 'src/app/lazy-general-page/services/backend-services/lastik-markalar/lastik-markalar.service';
import { LastikMarkaDesenOzelliklerService } from 'src/app/lazy-general-page/services/backend-services/lastik-marka-desen-ozellikler/lastik-marka-desen-ozellikler.service';
import { LastikMarkaDesenOzellikler } from 'src/app/lazy-general-page/classes/lastik-marka-desen-ozellikler/lastik-marka-desen-ozellikler';

declare var Swal:any;

@Component({
  selector: 'app-lastik-marka-desenler',
  templateUrl: './lastik-marka-desenler.component.html',
  styleUrls: ['./lastik-marka-desenler.component.css']
})
export class LastikMarkaDesenlerComponent implements OnInit {

  constructor(private http: HttpClient, private route: ActivatedRoute, private authorize: AuthorizationService, private lastikMarkalarService:LastikMarkalarService, private lastikMarkaDesenlerService:LastikMarkaDesenlerService,
     private settingService: SettingsService, private lastikMarkaDesenOzelliklerService:LastikMarkaDesenOzelliklerService, private dataTableService: DataTablesService, private dataTablesRxJs: DataTablesComponentMessageService, private sweetAlert: SweetAlertService) {
    this.subscription = this.dataTablesRxJs.getMessage().subscribe(message => {
      if (message.componentRequest == "LastikMarkaDesen") this.dataTablesData = message.data
    });
  }

  subscription: Subscription;

  dtOptions: DataTables.Settings = {};
  dataTablesData: LastikMarkaDesenler[];

  lastikMarka: string = "";
  lastikMarkaId: number;
  extraInfo = new ExtraInfoHelper();

  ngOnInit() {
    this.extraInfo.UstID = this.route.snapshot.params.lastikMarkaId === undefined ? 0 : this.route.snapshot.params.lastikMarkaId;
    if (isNaN(this.extraInfo.UstID)) {
      window.location.href = "/admin/lastik-yonetimi/lastik-marka";
    }
    else {
      this.lastikMarkalarService.getLastikMarka(this.extraInfo.UstID).subscribe(response=> this.lastikMarka = response.Ad);
      this.lastikMarkaId = this.extraInfo.UstID;
      this.dtOptions = this.dataTableService.getData("LastikMarkaDesen", 10, new LastikMarkaDesenler().jqueryDataTableLastikMarkaDesenler(), this.extraInfo);

      this.lastikMarkaDesenOzelliklerService.getLastikMarkaDesenOzellikler().subscribe(lastikMarkaDesenOzellikResponse=> this.lastikMarkaDesenOzellikler = lastikMarkaDesenOzellikResponse);

    }
  }

  lastikMarkaDesenOzellikler:LastikMarkaDesenOzellikler[];
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getOzellikSayisi(lastikMarkaDesenId:number){
    var finder = this.lastikMarkaDesenOzellikler.filter(a=> a.LastikMarkaDesenID === lastikMarkaDesenId && a.Aktif == true);
    return finder.length;
  }

  lastikMarkaDesenSil(id: number) {
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
        this.lastikMarkaDesenlerService.lastikMarkaDesenSil(id).subscribe(response => {
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
