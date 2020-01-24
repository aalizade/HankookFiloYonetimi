import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from '../../settings/settings.service';
import { AuthorizationService } from '../../authorization/authorization.service';
import { Observable } from 'rxjs';
import { LastikHareketler } from 'src/app/lazy-general-page/classes/lastik-hareketler/lastik-hareketler';
import { ServerJsonResult } from 'src/app/lazy-general-page/helpers/server-json-result/server-json-result';

@Injectable({
  providedIn: 'root'
})
export class LastikHareketlerService {

  constructor(private http: HttpClient, private settingService: SettingsService, private authorize: AuthorizationService) { }

  getLastikHareketler(lastikId:number): Observable<LastikHareketler[]> {
    return this.http.get<LastikHareketler[]>(this.settingService.siteAddressBack + "LastikHareket/LastikHareketler/"+lastikId, { headers: this.authorize._header });
  }

  getLastikHareketlerWithArac(lastikId:number,aracId:number):Observable<LastikHareketler[]>{
    return this.http.get<LastikHareketler[]>(this.settingService.siteAddressBack + "LastikHareket/LastikHareketlerWithArac/"+lastikId+"/"+aracId, { headers: this.authorize._header });
  }

  getLastikHareketlerTotalCount(lastikId: number): Observable<{ TotalCount: number }> {
    return this.http.get<{ TotalCount: number }>(this.settingService.siteAddressBack + "LastikHareket/TotalCount/" + lastikId, { headers: this.authorize._header });
  }

  lastikHareketSil(id: number, oncekiId: number, yapilanIslem: string) {
    return this.http.get<ServerJsonResult>(this.settingService.siteAddressBack + "LastikHareket/LastikHareketSil/" + id + "/" + oncekiId + "/" + yapilanIslem, { headers: this.authorize._header })
  }
}
