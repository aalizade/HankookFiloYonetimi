import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from '../../settings/settings.service';
import { AuthorizationService } from '../../authorization/authorization.service';
import { Observable } from 'rxjs';
import { LastikMarkaDesenler } from 'src/app/lazy-general-page/classes/lastik-marka-desenler/lastik-marka-desenler';
import { LastikMarkaDesenEkle } from 'src/app/lazy-general-page/classes/lastik-marka-desenler/models/lastik-marka-desen-ekle';
import { LastikMarkaDesenGuncelle } from 'src/app/lazy-general-page/classes/lastik-marka-desenler/models/lastik-marka-desen-guncelle';
import { ServerJsonResult } from 'src/app/lazy-general-page/helpers/server-json-result/server-json-result';

@Injectable({
  providedIn: 'root'
})
export class LastikMarkaDesenlerService {

  constructor(private http: HttpClient, private settingService: SettingsService, private authorize: AuthorizationService) { }

  getLastikMarkaDesenler(): Observable<LastikMarkaDesenler[]> {
    return this.http.get<LastikMarkaDesenler[]>(this.settingService.siteAddressBack + "LastikMarkaDesen", { headers: this.authorize._header });
  }

  getLastikMarkaDesen(id: number): Observable<LastikMarkaDesenler> {
    return this.http.get<LastikMarkaDesenler>(this.settingService.siteAddressBack + "LastikMarkaDesen/" + id, { headers: this.authorize._header });
  }

  lastikMarkaDesenEkle(form: LastikMarkaDesenEkle) {
    return this.http.post<ServerJsonResult>(this.settingService.siteAddressBack + "LastikMarkaDesen/LastikMarkaDesenEkle", JSON.stringify(form), { headers: this.authorize._header })
  }

  lastikMarkaDesenGuncelle(form: LastikMarkaDesenGuncelle) {
    return this.http.post<ServerJsonResult>(this.settingService.siteAddressBack + "LastikMarkaDesen/LastikMarkaDesenGuncelle", JSON.stringify(form), { headers: this.authorize._header })
  }

  lastikMarkaDesenSil(id: number) {
    return this.http.get<ServerJsonResult>(this.settingService.siteAddressBack + "LastikMarkaDesen/LastikMarkaDesenSil/" + id, { headers: this.authorize._header })
  }
}
