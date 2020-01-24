import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from '../../settings/settings.service';
import { AuthorizationService } from '../../authorization/authorization.service';
import { Observable } from 'rxjs';
import { YukIndeksler } from 'src/app/lazy-general-page/classes/yuk-indeksler/yuk-indeksler';
import { YukIndeksEkle } from 'src/app/lazy-general-page/classes/yuk-indeksler/models/yuk-indeks-ekle';
import { ServerJsonResult } from 'src/app/lazy-general-page/helpers/server-json-result/server-json-result';
import { YukIndeksGuncelle } from 'src/app/lazy-general-page/classes/yuk-indeksler/models/yuk-indeks-guncelle';

@Injectable({
  providedIn: 'root'
})
export class YukIndekslerService {

  constructor(private http: HttpClient, private settingService: SettingsService, private authorize: AuthorizationService) { }

  getYukIndeksler(): Observable<YukIndeksler[]> {
    return this.http.get<YukIndeksler[]>(this.settingService.siteAddressBack + "YukIndeksler", { headers: this.authorize._header });
  }

  getYukIndeks(id: number): Observable<YukIndeksler> {
    return this.http.get<YukIndeksler>(this.settingService.siteAddressBack + "YukIndeks/" + id, { headers: this.authorize._header });
  }

  yukIndeksEkle(form: YukIndeksEkle) {
    return this.http.post<ServerJsonResult>(this.settingService.siteAddressBack + "YukIndeks/YukIndeksEkle", JSON.stringify(form), { headers: this.authorize._header })
  }

  yukIndeksGuncelle(form: YukIndeksGuncelle) {
    return this.http.post<ServerJsonResult>(this.settingService.siteAddressBack + "YukIndeks/YukIndeksGuncelle", JSON.stringify(form), { headers: this.authorize._header })
  }

  yukIndeksSil(id: number) {
    return this.http.get<ServerJsonResult>(this.settingService.siteAddressBack + "YukIndeks/YukIndeksSil/" + id, { headers: this.authorize._header })
  }
}
