import { Injectable } from '@angular/core';
import { AracBakimlarService } from '../../../backend-services/arac-bakimlar/arac-bakimlar.service';
import { AsyncForeachService } from 'src/app/lazy-general-page/helpers/async-foreach/async-foreach.service';
import { LastikHareketlerService } from '../../../backend-services/lastik-hareketler/lastik-hareketler.service';
import { LastikHareketler } from 'src/app/lazy-general-page/classes/lastik-hareketler/lastik-hareketler';

@Injectable({
  providedIn: 'root'
})
export class ExtraAracBilgiService {

  constructor(private aracBakimlarService:AracBakimlarService,private asyncForeachService:AsyncForeachService,private lastikHareketlerService:LastikHareketlerService) { }

  async getAracSonKM(aracId:number): Promise<number>{
    let lastikHareketler: LastikHareketler[] = [];
    await this.aracBakimlarService.aracaBagliAktifLastikler(aracId).toPromise().then(async aracaBagliLastiklerResponse => {
      await this.asyncForeachService.asyncForEach(aracaBagliLastiklerResponse, async (item) => {
        await this.lastikHareketlerService.getLastikHareketlerWithArac(item.LastikID, aracId).toPromise().then(async lastikHareketResponse => {
          lastikHareketResponse.forEach(item => {
            lastikHareketler.push(item);
          })
        });
      });
    });

    let sonAracKm = JSON.parse(JSON.stringify(lastikHareketler.sort((a: LastikHareketler, b: LastikHareketler) => {
      return this.getTime(new Date(b.AracKilometre)) - this.getTime(new Date(a.AracKilometre));
    })));

    return sonAracKm[0] === undefined ? 0 : sonAracKm[0].AracKilometre;
  }

  private getTime(date?: Date) {
    return date != null ? new Date(date).getTime() : 0;
  }
}
