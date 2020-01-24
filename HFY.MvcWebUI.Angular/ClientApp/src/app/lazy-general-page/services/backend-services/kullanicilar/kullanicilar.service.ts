import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from '../../settings/settings.service';
import { AuthorizationService } from '../../authorization/authorization.service';
import { Observable } from 'rxjs';
import { Firmalar } from 'src/app/lazy-general-page/classes/firmalar/firmalar';
import { FirmaEkle } from 'src/app/lazy-general-page/classes/firmalar/models/firma-ekle';
import { ServerJsonResult } from 'src/app/lazy-general-page/helpers/server-json-result/server-json-result';
import { FirmaGuncelle } from 'src/app/lazy-general-page/classes/firmalar/models/firma-guncelle';

@Injectable({
  providedIn: 'root'
})
export class KullanicilarService {

  constructor(private http: HttpClient, private settingService: SettingsService, private authorize: AuthorizationService) { }

  getKullanicilar(firmaId:number): Observable<Firmalar[]> {
    return this.http.get<Firmalar[]>(this.settingService.siteAddressBack + "Kullanici/Kullanicilar/"+firmaId, { headers: this.authorize._header });
  }

  getKullanici(id: number): Observable<Firmalar> {
    return this.http.get<Firmalar>(this.settingService.siteAddressBack + "Kullanici/" + id, { headers: this.authorize._header });
  }

  // kullaniciEkle(form: FirmaEkle) {
  //   return this.http.post<ServerJsonResult>(this.settingService.siteAddressBack + "Firma/FirmaEkle", JSON.stringify(form), { headers: this.authorize._header })
  // }

  // kullaniciGuncelle(form: FirmaGuncelle) {
  //   return this.http.post<ServerJsonResult>(this.settingService.siteAddressBack + "Firma/FirmaGuncelle", JSON.stringify(form), { headers: this.authorize._header })
  // }

  kullaniciSil(id: number) {
    return this.http.get<ServerJsonResult>(this.settingService.siteAddressBack + "Kullanici/KullaniciSil/" + id, { headers: this.authorize._header })
  }
}
