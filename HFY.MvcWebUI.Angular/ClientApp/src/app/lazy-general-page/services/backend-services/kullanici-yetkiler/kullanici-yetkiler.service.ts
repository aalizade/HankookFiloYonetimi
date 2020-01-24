import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from '../../settings/settings.service';
import { AuthorizationService } from '../../authorization/authorization.service';
import { Observable } from 'rxjs';
import { KullaniciYetkiler } from 'src/app/lazy-general-page/classes/kullanici-yetkiler/kullanici-yetkiler';
import { KullaniciYetkiEkle } from 'src/app/lazy-general-page/classes/kullanici-yetkiler/models/kullanici-yetki-ekle';
import { ServerJsonResult } from 'src/app/lazy-general-page/helpers/server-json-result/server-json-result';

@Injectable({
  providedIn: 'root'
})
export class KullaniciYetkilerService {

  constructor(private http: HttpClient, private settingService: SettingsService, private authorize: AuthorizationService) { }

  getKullaniciYetkiler(ilgiliId: number): Observable<KullaniciYetkiler[]> {
    return this.http.get<KullaniciYetkiler[]>(this.settingService.siteAddressBack + "KullaniciYetki", { headers: this.authorize._header });
  }

  getKullaniciYetki(id: number): Observable<KullaniciYetkiler> {
    return this.http.get<KullaniciYetkiler>(this.settingService.siteAddressBack + "KullaniciYetki/" + id, { headers: this.authorize._header });
  }

  kullaniciYetkiEkle(form: KullaniciYetkiEkle) {
    return this.http.post<ServerJsonResult>(this.settingService.siteAddressBack + "KullaniciYetki/KullaniciYetkiEkle", JSON.stringify(form), { headers: this.authorize._header })
  }

  kullaniciYetkiSil(id: number) {
    return this.http.get<ServerJsonResult>(this.settingService.siteAddressBack + "KullaniciYetki/KullaniciYetkiSil/" + id, { headers: this.authorize._header })
  }
}
