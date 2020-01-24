import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from '../../settings/settings.service';
import { AuthorizationService } from '../../authorization/authorization.service';
import { Observable } from 'rxjs';
import { AracBakimlar } from 'src/app/lazy-general-page/classes/arac-bakimlar/arac-bakimlar';
import { ServerJsonResult } from 'src/app/lazy-general-page/helpers/server-json-result/server-json-result';
import { Lastikler } from 'src/app/lazy-general-page/classes/lastikler/lastikler';

@Injectable({
  providedIn: 'root'
})
export class AracBakimlarService {

  constructor(private http:HttpClient,private settingService:SettingsService,private authorize: AuthorizationService) { }

  getAracBakimlarForAracId(aracId:number): Observable<AracBakimlar[]> {
    return this.http.get<AracBakimlar[]>(this.settingService.siteAddressBack + "AracBakim/AracBakimForAracID/"+aracId, { headers: this.authorize._header });
  }

  getAracBakim(id: number): Observable<AracBakimlar> {
    return this.http.get<AracBakimlar>(this.settingService.siteAddressBack + "AracBakim/" + id, { headers: this.authorize._header });
  }

  aracBakimIslemleriKaydet(form: AracBakimlar[][]) {
    return this.http.post<ServerJsonResult>(this.settingService.siteAddressBack + "AracBakim/AracBakimIslemleriKaydet", JSON.stringify({model:form}), { headers: this.authorize._header })
  }

  // Araç Bakım ekranında depodan lastik sürüklendiğinde ve karşımıza çıkan ekrana seri no girildiğinde, giriş yapmış kullanıcının o seri no'nun var olup olmadığı ve o kullanıcının gerekli iznini kontrol eder. Duruma göre bir yanıt döndürür.
  seriNoErisimDogrula(seriNo:string,firmaId:number){
    return this.http.get<ServerJsonResult>(this.settingService.siteAddressBack + "AracBakim/SeriNoErisimDogrula/"+seriNo+"/"+firmaId, { headers: this.authorize._header })
  }

  // Bir araca takılı aktif lastiklerin listesini verir. Bu araç kilometresi istenilen ekranlarda diğer lastiklerin tamamının son araç kilometresini takip etmek gibi konularda işe yaramaktadır.
  aracaBagliAktifLastikler(aracId:number){
    return this.http.get<Lastikler[]>(this.settingService.siteAddressBack + "AracBakim/AracaBagliAktifLastikler/"+aracId, { headers: this.authorize._header });
  }
}
