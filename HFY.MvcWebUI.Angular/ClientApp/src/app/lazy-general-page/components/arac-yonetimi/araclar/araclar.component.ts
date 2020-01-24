import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { AuthorizationService } from 'src/app/lazy-general-page/services/authorization/authorization.service';
import { AraclarService } from 'src/app/lazy-general-page/services/backend-services/araclar/araclar.service';
import { SettingsService } from 'src/app/lazy-general-page/services/settings/settings.service';
import { DataTablesService } from 'src/app/lazy-general-page/services/data-tables/data-tables.service';
import { DataTablesComponentMessageService } from 'src/app/lazy-general-page/services/rxjs/data-tables-component-message.service';
import { SweetAlertService } from 'src/app/lazy-general-page/services/extra-services/sweet-alert.service';
import { Subscription } from 'rxjs';
import { Araclar } from 'src/app/lazy-general-page/classes/araclar/araclar';
import { FirmalarService } from 'src/app/lazy-general-page/services/backend-services/firmalar/firmalar.service';
import { AracMarkalarService } from 'src/app/lazy-general-page/services/backend-services/arac-markalar/arac-markalar.service';
import { AracModellerService } from 'src/app/lazy-general-page/services/backend-services/arac-modeller/arac-modeller.service';
import { Firmalar } from 'src/app/lazy-general-page/classes/firmalar/firmalar';
import { AracMarkalar } from 'src/app/lazy-general-page/classes/arac-markalar/arac-markalar';
import { AracModeller } from 'src/app/lazy-general-page/classes/arac-modeller/arac-modeller';
import { AracKategoriler } from 'src/app/lazy-general-page/classes/arac-kategoriler/arac-kategoriler';
import { AracKategorilerService } from 'src/app/lazy-general-page/services/backend-services/arac-kategoriler/arac-kategoriler.service';
import { AracBakimlarService } from 'src/app/lazy-general-page/services/backend-services/arac-bakimlar/arac-bakimlar.service';
import { ToastrService } from 'src/app/lazy-general-page/services/extra-services/toastr.service';

declare var Swal: any;

@Component({
  selector: 'app-araclar',
  templateUrl: './araclar.component.html',
  styleUrls: ['./araclar.component.css']
})
export class AraclarComponent implements OnInit {

  constructor(private http: HttpClient, private route: ActivatedRoute, private aracBakimService: AracBakimlarService, private authorize: AuthorizationService, private araclarService: AraclarService,
    private firmalarService: FirmalarService, private aracMarkalarService: AracMarkalarService, private aracModellerService: AracModellerService,
    private aracKategorilerService: AracKategorilerService, private settingService: SettingsService, private dataTableService: DataTablesService,
    private dataTablesRxJs: DataTablesComponentMessageService, private sweetAlert: SweetAlertService, private toastr: ToastrService) {
    this.subscription = this.dataTablesRxJs.getMessage().subscribe(message => {
      if (message.componentRequest == "Arac") this.dataTablesData = message.data
    });
    this.firmalarService.getFirmalar().subscribe(response => this.firmalar = response);
    this.aracMarkalarService.getAracMarkalar().subscribe(response => this.aracMarkalar = response);
    this.aracModellerService.getAracModeller().subscribe(response => this.aracModeller = response);
    this.aracKategorilerService.getAracKategoriler().subscribe(response => this.aracKategoriler = response);

  }

  subscription: Subscription;

  dtOptions: DataTables.Settings = {};
  dataTablesData: Araclar[];
  firmalar: Firmalar[];
  aracMarkalar: AracMarkalar[];
  aracModeller: AracModeller[];
  aracKategoriler: AracKategoriler[];

  ngOnInit() {
    this.dtOptions = this.dataTableService.getData("Arac", 10, new Araclar().jqueryDataTableAraclar());
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getFirma(firmaId: number) {
    var finder = this.firmalar.find(a => a.FirmaID == firmaId);
    return finder == undefined ? "-" : finder.FirmaAd;
  }

  getAracMarka(aracMarkaId: number) {
    var finder = this.aracMarkalar.find(a => a.AracMarkaID == aracMarkaId);
    return finder == undefined ? "-" : finder.Ad;
  }

  getAracModel(aracModelId: number) {
    var finder = this.aracModeller.find(a => a.AracModelID == aracModelId);
    return finder == undefined ? "-" : finder.Ad;
  }

  getAracKategori(aracModelId: number) {
    var finder = this.aracModeller.find(a => a.AracModelID == aracModelId);
    if (finder == undefined) { return "-" }
    else {
      var finderAracKategori = this.aracKategoriler.find(a => a.AracKategoriID == finder.AracKategoriID);
      return finderAracKategori == undefined ? "-" : finderAracKategori.Ad;
    }
  }

  async aracSil(id: number) {
    let aracaBagliLastikKontrol = await this.aracBakimService.aracaBagliAktifLastikler(id).toPromise().then(aracBagliResponse => {
      if (aracBagliResponse.length !== 0) return false;
      else return true;
    });
    if (!aracaBagliLastikKontrol) {
      this.toastr.error("Araç üzerinde lastik takılıyken silme işlemi yapılamaz.");
      return false;
    }
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

        this.araclarService.aracSil(id).subscribe(response => {
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
