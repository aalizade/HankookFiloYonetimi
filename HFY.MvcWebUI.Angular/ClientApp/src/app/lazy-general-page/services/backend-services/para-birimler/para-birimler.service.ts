import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from '../../settings/settings.service';
import { AuthorizationService } from '../../authorization/authorization.service';
import { Observable } from 'rxjs';
import { ParaBirimler } from 'src/app/lazy-general-page/classes/para-birimler/para-birimler';

@Injectable({
  providedIn: 'root'
})
export class ParaBirimlerService {

  constructor(private http: HttpClient, private settingService: SettingsService, private authorize: AuthorizationService) { }

  getParaBirimler(): Observable<ParaBirimler[]> {
    return this.http.get<ParaBirimler[]>(this.settingService.siteAddressBack + "ParaBirim", { headers: this.authorize._header });
  }

  getParaBirim(id: number): Observable<ParaBirimler> {
    return this.http.get<ParaBirimler>(this.settingService.siteAddressBack + "ParaBirim/" + id, { headers: this.authorize._header });
  }
}
