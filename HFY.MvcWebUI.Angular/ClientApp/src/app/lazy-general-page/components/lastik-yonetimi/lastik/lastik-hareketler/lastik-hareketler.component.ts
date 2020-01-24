import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataTablesService } from 'src/app/lazy-general-page/services/data-tables/data-tables.service';
import { DataTablesComponentMessageService } from 'src/app/lazy-general-page/services/rxjs/data-tables-component-message.service';
import { SweetAlertService } from 'src/app/lazy-general-page/services/extra-services/sweet-alert.service';
import { LastikHareketler } from 'src/app/lazy-general-page/classes/lastik-hareketler/lastik-hareketler';
import { LastikHareketlerService } from 'src/app/lazy-general-page/services/backend-services/lastik-hareketler/lastik-hareketler.service';
import { ExtraInfoHelper } from 'src/app/lazy-general-page/helpers/extra-info-helper/extra-info-helper';
import { LastikTiplerService } from 'src/app/lazy-general-page/services/backend-services/lastik-tipler/lastik-tipler.service';
import { LastikTipler } from 'src/app/lazy-general-page/classes/lastik-tipler/lastik-tipler';
import { LastikMarkalar } from 'src/app/lazy-general-page/classes/lastik-markalar/lastik-markalar';
import { LastikMarkalarService } from 'src/app/lazy-general-page/services/backend-services/lastik-markalar/lastik-markalar.service';
import { AksPozisyonlarService } from 'src/app/lazy-general-page/services/backend-services/aks-pozisyonlar/aks-pozisyonlar.service';
import { AksPozisyonlar } from 'src/app/lazy-general-page/classes/aks-pozisyonlar/aks-pozisyonlar';
import { LastikKonumlarService } from 'src/app/lazy-general-page/services/backend-services/lastik-konumlar/lastik-konumlar.service';
import { LastiklerService } from 'src/app/lazy-general-page/services/backend-services/lastikler/lastikler.service';
import { FirmalarService } from 'src/app/lazy-general-page/services/backend-services/firmalar/firmalar.service';
import { Firmalar } from 'src/app/lazy-general-page/classes/firmalar/firmalar';

declare var Swal: any;

@Component({
  selector: 'app-lastik-hareketler',
  templateUrl: './lastik-hareketler.component.html',
  styleUrls: ['./lastik-hareketler.component.css']
})
export class LastikHareketlerComponent implements OnInit {

  lastikId: number;
  lastikHareketKilit:boolean = true;

  constructor(private route: ActivatedRoute, private dataTableService: DataTablesService,
    private lastiklerService:LastiklerService, private firmalarService:FirmalarService,
    private lastikTiplerService: LastikTiplerService, private lastikMarkalarService: LastikMarkalarService,
     private lastikHareketService: LastikHareketlerService, private aksPozisyonlarService: AksPozisyonlarService,
    private lastikKonumlarService:LastikKonumlarService,
    private dataTablesRxJs: DataTablesComponentMessageService, private sweetAlert: SweetAlertService) {
    let id = this.route.snapshot.params.lastikId === undefined ? 0 : this.route.snapshot.params.lastikId;
    if (isNaN(id)) {
      window.location.href = "/admin/lastik-yonetimi/lastik";
    }
    else {
      this.lastikId = id;
      this.extraInfo.UstID = id;
      //
      this.lastikTiplerService.getLastikTipler().subscribe(response => this.lastikTipler = response);
      this.lastikMarkalarService.getLastikMarkalar().subscribe(response => this.lastikMarkalar = response);
      this.aksPozisyonlarService.getAksPozisyonlar().subscribe(response => this.aksPozisyonlar = response);

      this.subscription = this.dataTablesRxJs.getMessage().subscribe(message => {
        if (message.componentRequest == "LastikHareket") this.dataTablesData = message.data
      });

      this.lastikKonumlarService.getLastikKonumlar().subscribe(lastikKonumResponse=>{
        this.lastiklerService.getLastik(this.lastikId).subscribe(lastikResponse=>{
          let hurdaBulucu = lastikKonumResponse.find(a=> a.LastikKonumID === lastikResponse.LastikKonumID);
          if(hurdaBulucu.Ad !== "Hurda"){
            this.lastikHareketKilit = false;
          }
        })
      });

      this.firmalarService.getTumKullanicilar().subscribe(kullanicilarResponse=>this.firmalar = kullanicilarResponse);

    }
  }

  subscription: Subscription;

  dtOptions: DataTables.Settings = {};
  dataTablesData: LastikHareketler[];
  extraInfo = new ExtraInfoHelper();
  lastikTipler: LastikTipler[];
  lastikMarkalar: LastikMarkalar[];
  aksPozisyonlar: AksPozisyonlar[];
  firmalar:Firmalar[];
  lastikHareketSonKayit: boolean = false;

  ngOnInit() {
    this.dtOptions = this.dataTableService.getData("LastikHareket", 10, new LastikHareketler().jqueryDataTableLastikHareketler(), this.extraInfo);
  }

  @HostListener('click', ['$event'])
  onClick(event) {
    if (event.target.className.trim() === 'paginate_button') {
      this.lastikHareketSonKayit = false;
      setTimeout(() => {
        if ($(".paginate_button.last.disabled").length === 1) {
          this.lastikHareketSonKayit = true;
        }
        else {
          this.lastikHareketSonKayit = false;
        }
      }, 500);
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if ($(".paginate_button.last.disabled").length === 1) {
        this.lastikHareketSonKayit = true;
      }
      else {
        this.lastikHareketSonKayit = false;
      }
    }, 500);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getOrtalamaDisDerinligi(disDerinligiJSON: string) {
    try {
      let disDerinligiFakeJSON = JSON.parse(disDerinligiJSON);
      let topla = 0;
      Object.keys(disDerinligiFakeJSON).forEach(key => {
        let keys = Object.values(disDerinligiFakeJSON[key])
        let key_to_use = keys[0];
        topla += Number(key_to_use);
      });
      return Number(topla / disDerinligiFakeJSON.length).toFixed(1);
    }
    catch{
      return "-";
    }
  }

  getLastikTip(lastikTipId: number) {
    var finder = this.lastikTipler.find(a => a.LastikTipID === lastikTipId);
    return finder === undefined ? "-" : finder.Ad;
  }

  getLastikMarka(lastikMarkaId: number) {
    var finder = this.lastikMarkalar.find(a => a.LastikMarkaID === lastikMarkaId);
    return finder === undefined ? "-" : finder.Ad;
  }

  getAksPozisyon(lastikPozisyonId: number) {
    var finder = this.aksPozisyonlar.find(a => a.AksPozisyonID === lastikPozisyonId);
    return finder === undefined ? "-" : finder.Ad;
  }

  getOlusturan(olusturanId:number){
    var finder = this.firmalar.find(a=> a.FirmaID === olusturanId);
    return finder === undefined ? "-" : finder.FirmaAd;
  }

  lastikHareketSil(index: number, id: number, yapilanIslem: string) {
    Swal.fire({
      title: 'Emin misiniz?',
      text: (yapilanIslem === "Montaj" || yapilanIslem === "Rotasyon") ? yapilanIslem + " yapılmış bir kaydı siliyorsunuz. Bu işlem sonrasında lastik depoya taşınacaktır. Onaylıyor Musunuz?" : "Seçtiğiniz kayıt silinecektir. Bu işlem geri alınamaz.",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Evet!',
      cancelButtonText: "Hayır!"
    }).then((result) => {
      if (result.value) {
        if (yapilanIslem === "Ölçüm + Gözlem") yapilanIslem = "OlcumGozlem";
        let oncekiId = this.dataTablesData[index - 1] == undefined ? 0 : this.dataTablesData[index - 1].LastikHareketID;
        this.lastikHareketService.lastikHareketSil(id, oncekiId, yapilanIslem).subscribe(response => {
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
