import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from '../../settings/settings.service';
import { Observable } from 'rxjs';
import { AuthorizationService } from '../../authorization/authorization.service';

@Injectable({
  providedIn: 'root'
})
export class AracBakimHareketlerService {

  constructor(private http: HttpClient, private settingService: SettingsService, private authorize: AuthorizationService) { }

  getAracBakimHareketlerAracaTakilisTarihi(lastikId:number,aracId:number):Observable<{AracaTakilisTarihi:string}>{
    return this.http.get<{AracaTakilisTarihi:string}>(this.settingService.siteAddressBack + "AracBakim/AracaTakilisTarihi/"+lastikId+"/"+aracId, { headers: this.authorize._header });
  }
}
