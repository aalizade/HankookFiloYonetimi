import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from '../../settings/settings.service';
import { AuthorizationService } from '../../authorization/authorization.service';
import { Observable } from 'rxjs';
import { HizIndeksler } from 'src/app/lazy-general-page/classes/hiz-indeksler/hiz-indeksler';
import { HizIndeksEkle } from 'src/app/lazy-general-page/classes/hiz-indeksler/models/hiz-indeks-ekle';
import { HizIndeksGuncelle } from 'src/app/lazy-general-page/classes/hiz-indeksler/models/hiz-indeks-guncelle';
import { ServerJsonResult } from 'src/app/lazy-general-page/helpers/server-json-result/server-json-result';

@Injectable({
  providedIn: 'root'
})
export class HizIndekslerService {

  constructor(private http: HttpClient, private settingService: SettingsService, private authorize: AuthorizationService) { }

  getHizIndeksler(): Observable<HizIndeksler[]> {
    return this.http.get<HizIndeksler[]>(this.settingService.siteAddressBack + "HizIndeksler", { headers: this.authorize._header });
  }

  getHizIndeks(id: number): Observable<HizIndeksler> {
    return this.http.get<HizIndeksler>(this.settingService.siteAddressBack + "HizIndeks/" + id, { headers: this.authorize._header });
  }

  hizIndeksEkle(form: HizIndeksEkle) {
    return this.http.post<ServerJsonResult>(this.settingService.siteAddressBack + "HizIndeks/HizIndeksEkle", JSON.stringify(form), { headers: this.authorize._header })
  }

  hizIndeksGuncelle(form: HizIndeksGuncelle) {
    return this.http.post<ServerJsonResult>(this.settingService.siteAddressBack + "HizIndeks/HizIndeksGuncelle", JSON.stringify(form), { headers: this.authorize._header })
  }

  hizIndeksSil(id: number) {
    return this.http.get<ServerJsonResult>(this.settingService.siteAddressBack + "HizIndeks/HizIndeksSil/" + id, { headers: this.authorize._header })
  }
}
