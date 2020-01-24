import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from '../../settings/settings.service';
import { AuthorizationService } from '../../authorization/authorization.service';
import { Observable } from 'rxjs';
import { LastikKonumlar } from 'src/app/lazy-general-page/classes/lastik-konumlar/lastik-konumlar';

@Injectable({
  providedIn: 'root'
})
export class LastikKonumlarService {

  constructor(private http: HttpClient, private settingService: SettingsService, private authorize: AuthorizationService) { }

  getLastikKonumlar(): Observable<LastikKonumlar[]> {
    return this.http.get<LastikKonumlar[]>(this.settingService.siteAddressBack + "LastikKonum", { headers: this.authorize._header });
  }

  getLastikKonum(id: number): Observable<LastikKonumlar> {
    return this.http.get<LastikKonumlar>(this.settingService.siteAddressBack + "LastikKonum/" + id, { headers: this.authorize._header });
  }
}
