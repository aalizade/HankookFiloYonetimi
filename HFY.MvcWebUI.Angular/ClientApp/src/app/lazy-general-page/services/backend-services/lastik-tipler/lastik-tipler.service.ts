import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from '../../settings/settings.service';
import { AuthorizationService } from '../../authorization/authorization.service';
import { Observable } from 'rxjs';
import { LastikTipler } from 'src/app/lazy-general-page/classes/lastik-tipler/lastik-tipler';

@Injectable({
  providedIn: 'root'
})
export class LastikTiplerService {

  constructor(private http: HttpClient, private settingService: SettingsService, private authorize: AuthorizationService) { }

  getLastikTipler(): Observable<LastikTipler[]> {
    return this.http.get<LastikTipler[]>(this.settingService.siteAddressBack + "LastikTip", { headers: this.authorize._header });
  }

  getLastikTip(id: number): Observable<LastikTipler> {
    return this.http.get<LastikTipler>(this.settingService.siteAddressBack + "LastikTip/" + id, { headers: this.authorize._header });
  }
}
