import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from '../../settings/settings.service';
import { AuthorizationService } from '../../authorization/authorization.service';
import { Observable } from 'rxjs';
import { Araclar } from 'src/app/lazy-general-page/classes/araclar/araclar';
import { AracEkle } from 'src/app/lazy-general-page/classes/araclar/models/arac-ekle';
import { AracGuncelle } from 'src/app/lazy-general-page/classes/araclar/models/arac-guncelle';
import { ServerJsonResult } from 'src/app/lazy-general-page/helpers/server-json-result/server-json-result';

@Injectable({
  providedIn: 'root'
})
export class AraclarService {
  
  constructor(private http:HttpClient,private settingService:SettingsService,private authorize: AuthorizationService) { }

  getAraclar(): Observable<Araclar[]> {
    return this.http.get<Araclar[]>(this.settingService.siteAddressBack + "Arac", { headers: this.authorize._header });
  }

  getArac(id: number): Observable<Araclar> {
    return this.http.get<Araclar>(this.settingService.siteAddressBack + "Arac/" + id, { headers: this.authorize._header });
  }

  aracEkle(form: AracEkle) {
    return this.http.post<ServerJsonResult>(this.settingService.siteAddressBack + "Arac/AracEkle", JSON.stringify(form), { headers: this.authorize._header })
  }

  aracGuncelle(form: AracGuncelle) {
    return this.http.post<ServerJsonResult>(this.settingService.siteAddressBack + "Arac/AracGuncelle", JSON.stringify(form), { headers: this.authorize._header })
  }

  aracSil(id:number){
    return this.http.get<ServerJsonResult>(this.settingService.siteAddressBack + "Arac/AracSil/"+id, { headers: this.authorize._header })
  }

  //

  // Araç Bakım alanına tıklandığında ve plaka girildiğinde, giriş yapmış kullanıcının o plakaya erişim iznini kontrol eder. Duruma göre bir yanıt döndürür.
  aracErisimDogrulama(plaka:string){
    return this.http.get<ServerJsonResult>(this.settingService.siteAddressBack + "Arac/AracErisimDogrula/"+plaka, { headers: this.authorize._header })
  }
}
