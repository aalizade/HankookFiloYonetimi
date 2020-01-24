import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { AuthorizationService } from 'src/app/lazy-general-page/services/authorization/authorization.service';
import { LastiklerService } from 'src/app/lazy-general-page/services/backend-services/lastikler/lastikler.service';
import { SettingsService } from 'src/app/lazy-general-page/services/settings/settings.service';
import { DataTablesService } from 'src/app/lazy-general-page/services/data-tables/data-tables.service';
import { DataTablesComponentMessageService } from 'src/app/lazy-general-page/services/rxjs/data-tables-component-message.service';
import { SweetAlertService } from 'src/app/lazy-general-page/services/extra-services/sweet-alert.service';
import { Subscription } from 'rxjs';
import { Lastikler } from 'src/app/lazy-general-page/classes/lastikler/lastikler';
import { FirmalarService } from 'src/app/lazy-general-page/services/backend-services/firmalar/firmalar.service';
import { LastikMarkalarService } from 'src/app/lazy-general-page/services/backend-services/lastik-markalar/lastik-markalar.service';
import { LastikMarkaDesenlerService } from 'src/app/lazy-general-page/services/backend-services/lastik-marka-desenler/lastik-marka-desenler.service';
import { EbatlarService } from 'src/app/lazy-general-page/services/backend-services/ebatlar/ebatlar.service';
import { LastikTiplerService } from 'src/app/lazy-general-page/services/backend-services/lastik-tipler/lastik-tipler.service';
import { LastikKonumlarService } from 'src/app/lazy-general-page/services/backend-services/lastik-konumlar/lastik-konumlar.service';
import { Firmalar } from 'src/app/lazy-general-page/classes/firmalar/firmalar';
import { LastikMarkalar } from 'src/app/lazy-general-page/classes/lastik-markalar/lastik-markalar';
import { LastikMarkaDesenler } from 'src/app/lazy-general-page/classes/lastik-marka-desenler/lastik-marka-desenler';
import { Ebatlar } from 'src/app/lazy-general-page/classes/ebat/ebatlar';
import { LastikTipler } from 'src/app/lazy-general-page/classes/lastik-tipler/lastik-tipler';
import { LastikKonumlar } from 'src/app/lazy-general-page/classes/lastik-konumlar/lastik-konumlar';
import { AraclarService } from 'src/app/lazy-general-page/services/backend-services/araclar/araclar.service';
import { Araclar } from 'src/app/lazy-general-page/classes/araclar/araclar';

declare var Swal: any;

@Component({
  selector: 'app-lastik',
  templateUrl: './lastik.component.html',
  styleUrls: ['./lastik.component.css']
})
export class LastikComponent implements OnInit {

  constructor(private http: HttpClient, private route: ActivatedRoute, private authorize: AuthorizationService,
    private lastikService: LastiklerService, private firmalarService: FirmalarService, private lastikMarkalarService: LastikMarkalarService,
    private lastikMarkaDesenlerService: LastikMarkaDesenlerService, private ebatlarService: EbatlarService, private lastikTiplerService: LastikTiplerService,
    private lastikKonumlarService: LastikKonumlarService, private araclarService: AraclarService,
    private settingService: SettingsService, private dataTableService: DataTablesService, private dataTablesRxJs: DataTablesComponentMessageService, private sweetAlert: SweetAlertService) {
    this.subscription = this.dataTablesRxJs.getMessage().subscribe(message => {
      if (message.componentRequest == "Lastik") this.dataTablesData = message.data
    });
    this.firmalarService.getFirmalar().subscribe(response => this.firmalar = response);
    //
    this.lastikMarkalarService.getLastikMarkalar().subscribe(response => this.lastikMarkalar = response);
    //
    this.lastikMarkaDesenlerService.getLastikMarkaDesenler().subscribe(response => this.lastikMarkaDesenler = response);
    //
    this.ebatlarService.getEbatlar().subscribe(response => this.ebatlar = response);
    //
    this.lastikTiplerService.getLastikTipler().subscribe(response => this.lastikTipler = response);
    //
    this.lastikKonumlarService.getLastikKonumlar().subscribe(response => this.lastikKonumlar = response);
    //
    this.araclarService.getAraclar().subscribe(response=> this.araclar = response);
  }

  subscription: Subscription;

  dtOptions: DataTables.Settings = {};
  dataTablesData: Lastikler[];
  firmalar: Firmalar[];
  lastikMarkalar: LastikMarkalar[];
  lastikMarkaDesenler: LastikMarkaDesenler[];
  ebatlar: Ebatlar[];
  lastikTipler: LastikTipler[];
  lastikKonumlar: LastikKonumlar[];
  araclar: Araclar[];

  ngOnInit() {
    this.dtOptions = this.dataTableService.getData("Lastik", 10, new Lastikler().jqueryDataTableLastikler());
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getFirma(firmaId: number) {
    var finder = this.firmalar.find(a => a.FirmaID === firmaId);
    return finder === undefined ? "-" : finder.FirmaKisaAd;
  }
  getMarka(lastikMarkaId: number) {
    var finder = this.lastikMarkalar.find(a => a.LastikMarkaID === lastikMarkaId);
    return finder === undefined ? "-" : finder.Kod;
  }
  getDesen(lastikMarkaDesenId: number) {
    var finder = this.lastikMarkaDesenler.find(a => a.LastikMarkaDesenID === lastikMarkaDesenId);
    return finder === undefined ? "-" : finder.Ad;
  }
  getEbat(ebatId: number) {
    var finder = this.ebatlar.find(a => a.EbatID === ebatId);
    return finder === undefined ? "-" : finder.Ad;
  }
  getLastikTip(lastikTipId: number) {
    var finder = this.lastikTipler.find(a => a.LastikTipID === lastikTipId);
    return finder === undefined ? "-" : finder.Ad;
  }
  getLastikKonum(lastikKonumId: number) {
    var finder = this.lastikKonumlar.find(a => a.LastikKonumID === lastikKonumId);
    return finder === undefined ? "-" : finder.Ad;
  }

  getAracPlaka(aracId: number) {
    var finder = this.araclar.find(a => a.AracID === aracId);
    return finder === undefined ? "-" : finder.Plaka;
  }

  lastikSil(id: number) {
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
        this.lastikService.lastikSil(id).subscribe(response => {
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
