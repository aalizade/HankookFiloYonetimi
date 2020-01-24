import { Component, AfterViewInit, Input } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ToastrService } from 'src/app/lazy-general-page/services/extra-services/toastr.service';
import { LastikOlcumlerService } from 'src/app/lazy-general-page/services/backend-services/lastik-olcumler/lastik-olcumler.service';
import { LastikOlcumEkleGozlem } from 'src/app/lazy-general-page/classes/lastik-olcumler/models/lastik-olcum-ekle-gozlem';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-gozlemle',
  templateUrl: './gozlemle.component.html',
  styleUrls: ['./gozlemle.component.css']
})
export class GozlemleComponent implements AfterViewInit {

  @Input() aracId: number;
  @Input() lastikId: number;
  @Input() lastikPozisyonId: number;
  @Input() aracKilometre: number;
  @Input() servisTarihi:string;
  @Input() gelenTip:string;
  // Ölçümle kısmından bir lastik ölçümü girilirse ve ardından gözlem yapılmak istenirse bu input değeri dolu gelmelidir.
  @Input() lastikOlcumId:number = 0;

  gozlemleArray: Array<{ Ad: string, KisaAd: string }> = [
    {
      Ad: "Düzensiz Aşınma",
      KisaAd: "DuzensizAsinma"
    },
    {
      Ad: "Düşük Hava | Aşırı Yük",
      KisaAd: "DusukHavaAsiriYuk"
    },
    {
      Ad: "Darbe | Kesik | Kopma",
      KisaAd: "DarbeKesikKopma"
    }
  ]

  myDate = new Date();

  constructor(public ngxSmartModalService: NgxSmartModalService,private lastikOlcumService:LastikOlcumlerService, private toastr: ToastrService,private datePipe: DatePipe) { }

  ngAfterViewInit() {
    setTimeout(() => {
      if(this.aracKilometre === 0 && this.gelenTip !== "LBOlcumleComponent" && this.gelenTip !== "LBOlcumleComponent_Hurda"){
        this.toastr.error("Araç kilometresi değeri alınamadı, lütfen sayfayı yenileyip tekrar deneyiniz.");
        this.ngxSmartModalService.getModal('gozlemle').close();
        return false;
      }
      this.lastikOlcumService.getLastikOlcumler(this.lastikId).subscribe(lastikOlcumResponse => {
        let filter = lastikOlcumResponse.find(a => this.datePipe.transform(a.Tarih, 'yyyy-MM-dd') === this.datePipe.transform(this.myDate, 'yyyy-MM-dd'));
        if (filter !== undefined) {
          if(this.lastikOlcumId===0)
          {
            this.toastr.error("Belirttiğiniz tarihte daha önceden lastik ölçümü/gözlemi girilmiştir.");
          }
          else{
            this.ngxSmartModalService.getModal('gozlemle').open();
          }
        }
        else {
          this.ngxSmartModalService.getModal('gozlemle').open();
        }
      });
      
    });
  }

  gozlemleSave() {
    let gozlemVerileri = [];
    this.gozlemleArray.forEach((item, index) => {
      let checked = $("#" + item.KisaAd).is(':checked');
      gozlemVerileri.push({ [item.KisaAd]: checked });
    })

    if ($(".gozlemleCheckboxClass:checked").length === 0) {
      this.toastr.error("Lütfen minimum 1 alanı işaretleyiniz.");
      return;
    }

    let GozlemJSON = JSON.stringify(gozlemVerileri);
    console.log(GozlemJSON)
    
    let lastikOlcumEkleGozlem = new LastikOlcumEkleGozlem();
    lastikOlcumEkleGozlem.GozlemJSON = GozlemJSON;
    lastikOlcumEkleGozlem.AracID = this.aracId;
    lastikOlcumEkleGozlem.LastikID = this.lastikId;
    lastikOlcumEkleGozlem.LastikPozisyonID = this.lastikPozisyonId;
    lastikOlcumEkleGozlem.LastikOlcumID = this.lastikOlcumId;
    lastikOlcumEkleGozlem.ServisTarihi = this.servisTarihi;
    lastikOlcumEkleGozlem.AracKilometre = this.aracKilometre;

    this.lastikOlcumService.lastikOlcumEkleGozlem(lastikOlcumEkleGozlem).subscribe(response => {
      if (response.MessageType === 1) {
        this.toastr.success(response.Message);
        this.ngxSmartModalService.getModal('gozlemle').close();
      }
      else {
        if (response.ErrorList !== undefined) {
          response.ErrorList.forEach(item => {
            this.toastr.error(item.ErrorMessage);
          })
        }
        if (response.Error !== "" && response.Error !== undefined) {
          this.toastr.error(response.Error);
        }
      }
    }, error => {
      this.toastr.error("Lütfen doldurulması gereken alanları doldurun.");
    })
  }

}
