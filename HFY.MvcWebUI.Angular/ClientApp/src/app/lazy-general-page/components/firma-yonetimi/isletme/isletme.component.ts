import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
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
  selector: 'app-isletme',
  templateUrl: './isletme.component.html',
  styleUrls: ['./isletme.component.css']
})
export class IsletmeComponent implements OnInit {

  role: string = "";
  adminRole: boolean = false;
  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, private authorize: AuthorizationService, private settingService: SettingsService, private dataTableService: DataTablesService, private dataTablesRxJs: DataTablesComponentMessageService, private firmaService: FirmalarService, private sweetAlert: SweetAlertService) {
    this.role = this.authorize.role;
    this.adminRole = this.role === Role.Admin ? true : false;
    if (this.role !== Role.Admin) {
      this.router.navigate(['/admin/firma-yonetimi/firma']);
    }
    this.subscription = this.dataTablesRxJs.getMessage().subscribe(message => {
      if (message.componentRequest == "Firma/Isletmeler") this.dataTablesData = message.data
    });
  }

  subscription: Subscription;

  dtOptions: DataTables.Settings = {};
  dataTablesData: Firmalar[];

  ngOnInit() {
    this.dtOptions = this.dataTableService.getData("Firma/Isletmeler", 10, new Firmalar().jqueryDataTableIsletmeler());
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  isletmeSil(id: number) {
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
