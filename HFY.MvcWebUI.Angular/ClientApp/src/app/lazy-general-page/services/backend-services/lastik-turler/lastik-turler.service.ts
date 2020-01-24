import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from '../../settings/settings.service';
import { AuthorizationService } from '../../authorization/authorization.service';
import { Observable } from 'rxjs';
import { LastikTurler } from 'src/app/lazy-general-page/classes/lastik-turler/lastik-turler';
import { LastikTurEkle } from 'src/app/lazy-general-page/classes/lastik-turler/models/lastik-tur-ekle';
import { LastikTurGuncelle } from 'src/app/lazy-general-page/classes/lastik-turler/models/lastik-tur-guncelle';
import { ServerJsonResult } from 'src/app/lazy-general-page/helpers/server-json-result/server-json-result';

@Injectable({
  providedIn: 'root'
})
export class LastikTurlerService {

  constructor(private http: HttpClient, private settingService: SettingsService, private authorize: AuthorizationService) { }

  getLastikTurler(): Observable<LastikTurler[]> {
    return this.http.get<LastikTurler[]>(this.settingService.siteAddressBack + "LastikTur", { headers: this.authorize._header });
  }

  getLastikTur(id: number): Observable<LastikTurler> {
    return this.http.get<LastikTurler>(this.settingService.siteAddressBack + "LastikTur/" + id, { headers: this.authorize._header });
  }

  lastikTurEkle(form: LastikTurEkle) {
    return this.http.post<ServerJsonResult>(this.settingService.siteAddressBack + "LastikTur/LastikTurEkle", JSON.stringify(form), { headers: this.authorize._header })
  }

  lastikTurGuncelle(form: LastikTurGuncelle) {
    return this.http.post<ServerJsonResult>(this.settingService.siteAddressBack + "LastikTur/LastikTurGuncelle", JSON.stringify(form), { headers: this.authorize._header })
  }

  lastikTurSil(id: number) {
    return this.http.get<ServerJsonResult>(this.settingService.siteAddressBack + "LastikTur/LastikTurSil/" + id, { headers: this.authorize._header })
  }
}
