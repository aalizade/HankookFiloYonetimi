import { Component, AfterViewInit, Input } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { DatePipe } from '@angular/common';
import { AraclarService } from 'src/app/lazy-general-page/services/backend-services/araclar/araclar.service';
import { AracMarkalarService } from 'src/app/lazy-general-page/services/backend-services/arac-markalar/arac-markalar.service';
import { AracModellerService } from 'src/app/lazy-general-page/services/backend-services/arac-modeller/arac-modeller.service';
import { AracBakimlarService } from 'src/app/lazy-general-page/services/backend-services/arac-bakimlar/arac-bakimlar.service';
import { AsyncForeachService } from 'src/app/lazy-general-page/helpers/async-foreach/async-foreach.service';
import { LastikHareketlerService } from 'src/app/lazy-general-page/services/backend-services/lastik-hareketler/lastik-hareketler.service';
import { LastikHareketler } from 'src/app/lazy-general-page/classes/lastik-hareketler/lastik-hareketler';
import { FirmalarService } from 'src/app/lazy-general-page/services/backend-services/firmalar/firmalar.service';

@Component({
  selector: 'app-arac-bilgi',
  templateUrl: './arac-bilgi.component.html',
  styleUrls: ['./arac-bilgi.component.css']
})
export class AracBilgiComponent implements AfterViewInit {

  @Input() aracId: number;

  myDate = new Date();
  firmaKisaAd:string;
  plaka: string;
  marka: string;
  model: string;
  aracKm: string;
  sonIslemTarihi: Date | string
  lastikHareketler: LastikHareketler[] = [];

  constructor(public ngxSmartModalService: NgxSmartModalService, private aracBakimlarService: AracBakimlarService, private firmalarService:FirmalarService,
    private araclarService: AraclarService, private aracMarkalarService: AracMarkalarService, private aracModellerService: AracModellerService,
    private datePipe: DatePipe, private asyncForeachService: AsyncForeachService, private lastikHareketlerService: LastikHareketlerService) {
  }

  ngAfterViewInit() {
    this.araclarService.getArac(this.aracId).subscribe(async aracResponse => {
      this.plaka = aracResponse.Plaka;
      this.aracMarkalarService.getAracMarka(aracResponse.MarkaID).subscribe(aracMarkaResponse => this.marka = aracMarkaResponse.Ad);
      this.aracModellerService.getAracModel(aracResponse.ModelID).subscribe(aracModelResponse => this.model = aracModelResponse.Ad);

      await this.aracBakimlarService.aracaBagliAktifLastikler(this.aracId).toPromise().then(async aracaBagliLastiklerResponse => {
        await this.asyncForeachService.asyncForEach(aracaBagliLastiklerResponse, async (item) => {
          await this.lastikHareketlerService.getLastikHareketlerWithArac(item.LastikID, this.aracId).toPromise().then(async lastikHareketResponse => {
            lastikHareketResponse.forEach(item => {
              this.lastikHareketler.push(item);
            })
          });
        });
      });
      //
      this.firmalarService.getFirma(aracResponse.FirmaID).subscribe(firmaResponse=> this.firmaKisaAd = firmaResponse.FirmaKisaAd);
      //
      let sonIslemLastikHareket = JSON.parse(JSON.stringify(this.lastikHareketler.sort((a: LastikHareketler, b: LastikHareketler) => {
        return this.getTime(new Date(b.OlusturmaTarihi)) - this.getTime(new Date(a.OlusturmaTarihi));
      })));
      //
      let sonAracKm = JSON.parse(JSON.stringify(this.lastikHareketler.sort((a: LastikHareketler, b: LastikHareketler) => {
        return this.getTime(new Date(b.AracKilometre)) - this.getTime(new Date(a.AracKilometre));
      })));

      this.sonIslemTarihi = sonIslemLastikHareket[0].Tarih;
      this.aracKm = sonAracKm[0].AracKilometre
    });
    setTimeout(() => {
      this.ngxSmartModalService.getModal('aracBilgisi').open();
    });
  }

  private getTime(date?: Date) {
    return date != null ? new Date(date).getTime() : 0;
  }
}
