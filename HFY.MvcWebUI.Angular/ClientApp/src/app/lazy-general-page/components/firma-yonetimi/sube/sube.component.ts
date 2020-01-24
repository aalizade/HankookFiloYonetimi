import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthorizationService } from 'src/app/lazy-general-page/services/authorization/authorization.service';
import { SettingsService } from 'src/app/lazy-general-page/services/settings/settings.service';
import { DataTablesService } from 'src/app/lazy-general-page/services/data-tables/data-tables.service';
import { DataTablesComponentMessageService } from 'src/app/lazy-general-page/services/rxjs/data-tables-component-message.service';
import { FirmalarService } from 'src/app/lazy-general-page/services/backend-services/firmalar/firmalar.service';
import { SweetAlertService } from 'src/app/lazy-general-page/services/extra-services/sweet-alert.service';
import { Role } from 'src/app/lazy-general-page/services/authorization/roles/role';
import { Subscription } from 'rxjs';
import { Firmalar } from 'src/app/lazy-general-page/classes/firmalar/firmalar';

declare var Swal:any;

@Component({
  selector: 'app-sube',
  templateUrl: './sube.component.html',
  styleUrls: ['./sube.component.css']
})
export class SubeComponent implements OnInit {

  role: string = "";
  adminRole: boolean = false;
  isletmeRole:boolean = false;
  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, private authorize: AuthorizationService, private settingService: SettingsService, private dataTableService: DataTablesService, private dataTablesRxJs: DataTablesComponentMessageService, private firmaService: FirmalarService, private sweetAlert: SweetAlertService) {
    this.role = this.authorize.role;
    this.adminRole = this.role === Role.Admin ? true : false;
    this.isletmeRole = this.role === Role.IsletmeKullanicisi ? true : false;
    // if (this.role !== Role.Admin) {
    //   this.router.navigate(['/admin/firma-yonetimi/firma']);
    // }
    this.subscription = this.dataTablesRxJs.getMessage().subscribe(message => {
      if (message.componentRequest == "Firma/Subeler") this.dataTablesData = message.data
    });

    this.firmaService.getTumKullanicilar().subscribe(firmaResponse=>{
      this.anaFirmalar = firmaResponse;
    });
    
  }

  subscription: Subscription;

  dtOptions: DataTables.Settings = {};
  dataTablesData: Firmalar[];
  anaFirmalar: Firmalar[];

  ngOnInit() {
    this.dtOptions = this.dataTableService.getData("Firma/Subeler", 10, new Firmalar().jqueryDataTableFirmalar());
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getAnaFirma(firmaId:number){
    var finder = this.anaFirmalar.find(a=> a.FirmaID === firmaId);
    return finder === undefined ? "-" : finder.FirmaAd
  }

  subeSil(id: number) {
    if (this.adminRole) {
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

}
