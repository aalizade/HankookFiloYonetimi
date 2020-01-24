import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from '../../settings/settings.service';
import { AuthorizationService } from '../../authorization/authorization.service';
import { Observable } from 'rxjs';
import { LastikMarkalar } from 'src/app/lazy-general-page/classes/lastik-markalar/lastik-markalar';
import { LastikMarkaEkle } from 'src/app/lazy-general-page/classes/lastik-markalar/models/lastik-marka-ekle';
import { LastikMarkaGuncelle } from 'src/app/lazy-general-page/classes/lastik-markalar/models/lastik-marka-guncelle';
import { ServerJsonResult } from 'src/app/lazy-general-page/helpers/server-json-result/server-json-result';

@Injectable({
  providedIn: 'root'
})
export class LastikMarkalarService {

  constructor(private http: HttpClient, private settingService: SettingsService, private authorize: AuthorizationService) { }

  getLastikMarkalar(): Observable<LastikMarkalar[]> {
    return this.http.get<LastikMarkalar[]>(this.settingService.siteAddressBack + "LastikMarka", { headers: this.authorize._header });
  }

  getLastikMarka(id: number): Observable<LastikMarkalar> {
    return this.http.get<LastikMarkalar>(this.settingService.siteAddressBack + "LastikMarka/" + id, { headers: this.authorize._header });
  }

  lastikMarkaEkle(form: LastikMarkaEkle) {
    return this.http.post<ServerJsonResult>(this.settingService.siteAddressBack + "LastikMarka/LastikMarkaEkle", JSON.stringify(form), { headers: this.authorize._header })
  }

  lastikMarkaGuncelle(form: LastikMarkaGuncelle) {
    return this.http.post<ServerJsonResult>(this.settingService.siteAddressBack + "LastikMarka/LastikMarkaGuncelle", JSON.stringify(form), { headers: this.authorize._header })
  }

  lastikMarkaSil(id: number) {
    return this.http.get<ServerJsonResult>(this.settingService.siteAddressBack + "LastikMarka/LastikMarkaSil/" + id, { headers: this.authorize._header })
  }

}
