import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from '../../settings/settings.service';
import { AuthorizationService } from '../../authorization/authorization.service';
import { Observable } from 'rxjs';
import { ServerJsonResult } from 'src/app/lazy-general-page/helpers/server-json-result/server-json-result';
import { HavaFarkTanimlar } from 'src/app/lazy-general-page/classes/hava-fark-tanimlar/hava-fark-tanimlar';
import { HavaFarkTanimEkle } from 'src/app/lazy-general-page/classes/hava-fark-tanimlar/models/hava-fark-tanim-ekle';
import { HavaFarkTanimGuncelle } from 'src/app/lazy-general-page/classes/hava-fark-tanimlar/models/hava-fark-tanim-guncelle';

@Injectable({
  providedIn: 'root'
})
export class HavaFarkTanimlarService {

  constructor(private http: HttpClient, private settingService: SettingsService, private authorize: AuthorizationService) { }

  getHavaFarkTanimlar(): Observable<HavaFarkTanimlar[]> {
    return this.http.get<HavaFarkTanimlar[]>(this.settingService.siteAddressBack + "HavaFarkTanim", { headers: this.authorize._header });
  }

  getHavaFarkTanim(id: number): Observable<HavaFarkTanimlar> {
    return this.http.get<HavaFarkTanimlar>(this.settingService.siteAddressBack + "HavaFarkTanim/" + id, { headers: this.authorize._header });
  }

  havaFarkTanimEkle(form: HavaFarkTanimEkle) {
    return this.http.post<ServerJsonResult>(this.settingService.siteAddressBack + "HavaFarkTanim/HavaFarkTanimEkle", JSON.stringify(form), { headers: this.authorize._header })
  }

  havaFarkTanimGuncelle(form: HavaFarkTanimGuncelle) {
    return this.http.post<ServerJsonResult>(this.settingService.siteAddressBack + "HavaFarkTanim/HavaFarkTanimGuncelle", JSON.stringify(form), { headers: this.authorize._header })
  }

  havaFarkTanimSil(id: number) {
    return this.http.get<ServerJsonResult>(this.settingService.siteAddressBack + "HavaFarkTanim/HavaFarkTanimSil/" + id, { headers: this.authorize._header })
  }
}
