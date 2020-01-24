import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { AuthorizationService } from 'src/app/lazy-general-page/services/authorization/authorization.service';
import { AracKategorilerService } from 'src/app/lazy-general-page/services/backend-services/arac-kategoriler/arac-kategoriler.service';
import { SettingsService } from 'src/app/lazy-general-page/services/settings/settings.service';
import { DataTablesService } from 'src/app/lazy-general-page/services/data-tables/data-tables.service';
import { DataTablesComponentMessageService } from 'src/app/lazy-general-page/services/rxjs/data-tables-component-message.service';
import { SweetAlertService } from 'src/app/lazy-general-page/services/extra-services/sweet-alert.service';
import { Subscription } from 'rxjs';
import { AracKategoriler } from 'src/app/lazy-general-page/classes/arac-kategoriler/arac-kategoriler';

declare var Swal: any

@Component({
  selector: 'app-arac-kategoriler',
  templateUrl: './arac-kategoriler.component.html',
  styleUrls: ['./arac-kategoriler.component.css']
})
export class AracKategorilerComponent implements OnInit {

  constructor(private http: HttpClient,private route: ActivatedRoute, private authorize: AuthorizationService,private aracKategorilerService:AracKategorilerService, private settingService: SettingsService,private dataTableService:DataTablesService,private dataTablesRxJs: DataTablesComponentMessageService,private sweetAlert:SweetAlertService) { 
    this.subscription = this.dataTablesRxJs.getMessage().subscribe(message => {
      if(message.componentRequest == "AracKategori") this.dataTablesData = message.data
    });
  }
  
  subscription: Subscription;

  dtOptions: DataTables.Settings = {};
  dataTablesData: AracKategoriler[];

  ngOnInit() {
    this.dtOptions = this.dataTableService.getData("AracKategori",10,new AracKategoriler().jqueryDataTableAracKategoriler());
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  aracKategoriSil(id: number) {
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
        this.aracKategorilerService.aracKategoriSil(id).subscribe(response => {
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
