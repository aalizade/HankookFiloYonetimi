import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from '../../settings/settings.service';
import { AuthorizationService } from '../../authorization/authorization.service';
import { Observable } from 'rxjs';
import { LastikOlcumler } from 'src/app/lazy-general-page/classes/lastik-olcumler/lastik-olcumler';
import { LastikOlcumEkle } from 'src/app/lazy-general-page/classes/lastik-olcumler/models/lastik-olcum-ekle';
import { ServerJsonResult } from 'src/app/lazy-general-page/helpers/server-json-result/server-json-result';
import { LastikOlcumEkleGozlem } from 'src/app/lazy-general-page/classes/lastik-olcumler/models/lastik-olcum-ekle-gozlem';

@Injectable({
  providedIn: 'root'
})
export class LastikOlcumlerService {

  constructor(private http: HttpClient, private settingService: SettingsService, private authorize: AuthorizationService) { }

  getLastikOlcumler(id:number): Observable<LastikOlcumler[]> {
    return this.http.get<LastikOlcumler[]>(this.settingService.siteAddressBack + "LastikOlcum/LastikOlcumler/"+id, { headers: this.authorize._header });
  }

  getLastikOlcum(id: number): Observable<LastikOlcumler> {
    return this.http.get<LastikOlcumler>(this.settingService.siteAddressBack + "LastikOlcum/" + id, { headers: this.authorize._header });
  }

  lastikOlcumEkle(form: LastikOlcumEkle) {
    return this.http.post<ServerJsonResult>(this.settingService.siteAddressBack + "LastikOlcum/LastikOlcumEkle", JSON.stringify(form), { headers: this.authorize._header })
  }

  lastikOlcumEkleGozlem(form: LastikOlcumEkleGozlem) {
    return this.http.post<ServerJsonResult>(this.settingService.siteAddressBack + "LastikOlcum/LastikOlcumEkleGozlem", JSON.stringify(form), { headers: this.authorize._header })
  }

  lastikOlcumSil(id: number) {
    return this.http.get<ServerJsonResult>(this.settingService.siteAddressBack + "LastikOlcum/LastikOlcumSil/" + id, { headers: this.authorize._header })
  }
}
