import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from '../../settings/settings.service';
import { AuthorizationService } from '../../authorization/authorization.service';
import { Observable } from 'rxjs';
import { ServerJsonResult } from 'src/app/lazy-general-page/helpers/server-json-result/server-json-result';
import { AksPozisyonlar } from 'src/app/lazy-general-page/classes/aks-pozisyonlar/aks-pozisyonlar';
import { AksPozisyonEkle } from 'src/app/lazy-general-page/classes/aks-pozisyonlar/models/aks-pozisyon-ekle';
import { AksPozisyonGuncelle } from 'src/app/lazy-general-page/classes/aks-pozisyonlar/models/aks-pozisyon-guncelle';

@Injectable({
  providedIn: 'root'
})
export class AksPozisyonlarService {

  constructor(private http:HttpClient,private settingService:SettingsService,private authorize: AuthorizationService) { }

  getAksPozisyonlar(): Observable<AksPozisyonlar[]> {
    return this.http.get<AksPozisyonlar[]>(this.settingService.siteAddressBack + "AksPozisyon", { headers: this.authorize._header });
  }

  getAksPozisyon(id: number): Observable<AksPozisyonlar> {
    return this.http.get<AksPozisyonlar>(this.settingService.siteAddressBack + "AksPozisyon/" + id, { headers: this.authorize._header });
  }

  aksPozisyonEkle(form: AksPozisyonEkle) {
    return this.http.post<ServerJsonResult>(this.settingService.siteAddressBack + "AksPozisyon/AksPozisyonEkle", JSON.stringify(form), { headers: this.authorize._header })
  }

  aksPozisyonGuncelle(form: AksPozisyonGuncelle) {
    return this.http.post<ServerJsonResult>(this.settingService.siteAddressBack + "AksPozisyon/AksPozisyonGuncelle", JSON.stringify(form), { headers: this.authorize._header })
  }

  aksPozisyonSil(id:number){
    return this.http.get<ServerJsonResult>(this.settingService.siteAddressBack + "AksPozisyon/AksPozisyonSil/"+id, { headers: this.authorize._header })
  }
}
