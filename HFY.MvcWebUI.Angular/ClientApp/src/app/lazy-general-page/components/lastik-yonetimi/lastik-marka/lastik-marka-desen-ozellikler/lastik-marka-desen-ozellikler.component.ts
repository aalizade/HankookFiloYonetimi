import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { AuthorizationService } from 'src/app/lazy-general-page/services/authorization/authorization.service';
import { LastikMarkaDesenOzelliklerService } from 'src/app/lazy-general-page/services/backend-services/lastik-marka-desen-ozellikler/lastik-marka-desen-ozellikler.service';
import { LastikMarkaDesenlerService } from 'src/app/lazy-general-page/services/backend-services/lastik-marka-desenler/lastik-marka-desenler.service';
import { SettingsService } from 'src/app/lazy-general-page/services/settings/settings.service';
import { DataTablesService } from 'src/app/lazy-general-page/services/data-tables/data-tables.service';
import { DataTablesComponentMessageService } from 'src/app/lazy-general-page/services/rxjs/data-tables-component-message.service';
import { SweetAlertService } from 'src/app/lazy-general-page/services/extra-services/sweet-alert.service';
import { Subscription } from 'rxjs';
import { LastikMarkaDesenOzellikler } from 'src/app/lazy-general-page/classes/lastik-marka-desen-ozellikler/lastik-marka-desen-ozellikler';
import { ExtraInfoHelper } from 'src/app/lazy-general-page/helpers/extra-info-helper/extra-info-helper';
import { EbatlarService } from 'src/app/lazy-general-page/services/backend-services/ebatlar/ebatlar.service';
import { Ebatlar } from 'src/app/lazy-general-page/classes/ebat/ebatlar';

declare var Swal:any;

@Component({
  selector: 'app-lastik-marka-desen-ozellikler',
  templateUrl: './lastik-marka-desen-ozellikler.component.html',
  styleUrls: ['./lastik-marka-desen-ozellikler.component.css']
})
export class LastikMarkaDesenOzelliklerComponent implements OnInit {

  constructor(private http: HttpClient, private route: ActivatedRoute, private ebatlarService:EbatlarService, private authorize: AuthorizationService, private lastikMarkaDesenOzelliklerService:LastikMarkaDesenOzelliklerService, private lastikMarkaDesenlerService:LastikMarkaDesenlerService,
    private settingService: SettingsService, private dataTableService: DataTablesService, private dataTablesRxJs: DataTablesComponentMessageService, private sweetAlert: SweetAlertService) {
   this.subscription = this.dataTablesRxJs.getMessage().subscribe(message => {
     if (message.componentRequest == "LastikMarkaDesenOzellik") this.dataTablesData = message.data
   });
 }

 subscription: Subscription;

 dtOptions: DataTables.Settings = {};
 dataTablesData: LastikMarkaDesenOzellikler[];

 lastikMarkaDesen: string = "";
 lastikMarkaDesenId: number;
 extraInfo = new ExtraInfoHelper();

 ngOnInit() {
   this.extraInfo.UstID = this.route.snapshot.params.lastikMarkaDesenId === undefined ? 0 : this.route.snapshot.params.lastikMarkaDesenId;
   if (isNaN(this.extraInfo.UstID)) {
     window.location.href = "/admin/lastik-yonetimi/lastik-marka";
   }
   else {
     this.lastikMarkaDesenlerService.getLastikMarkaDesen(this.extraInfo.UstID).subscribe(response=> this.lastikMarkaDesen = response.Ad);
     this.lastikMarkaDesenId = this.extraInfo.UstID;
     this.dtOptions = this.dataTableService.getData("LastikMarkaDesenOzellik", 10, new LastikMarkaDesenOzellikler().jqueryDataTableLastikMarkaDesenOzellikler(), this.extraInfo);
     this.ebatlarService.getEbatlar().subscribe(response => this.ebatlar = response);
    }
 }

 ngOnDestroy() {
   this.subscription.unsubscribe();
 }

 ebatlar:Ebatlar[];

 getEbat(ebatId: number) {
  var finder = this.ebatlar.find(a=> a.EbatID === ebatId);
  return finder === undefined ? "-" : finder.Ad;
}

 lastikMarkaDesenOzellikSil(id: number) {
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
       this.lastikMarkaDesenOzelliklerService.lastikMarkaDesenOzellikSil(id).subscribe(response => {
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
