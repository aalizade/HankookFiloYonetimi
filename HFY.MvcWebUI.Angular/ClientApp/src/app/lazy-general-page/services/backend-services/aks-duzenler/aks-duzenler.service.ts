import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from '../../settings/settings.service';
import { AuthorizationService } from '../../authorization/authorization.service';
import { Observable } from 'rxjs';
import { AksDuzenler } from 'src/app/lazy-general-page/classes/aks-duzenler/aks-duzenler';
import { AksDuzenEkle } from 'src/app/lazy-general-page/classes/aks-duzenler/models/aks-duzen-ekle';
import { AksDuzenGuncelle } from 'src/app/lazy-general-page/classes/aks-duzenler/models/aks-duzen-guncelle';
import { ServerJsonResult } from 'src/app/lazy-general-page/helpers/server-json-result/server-json-result';

@Injectable({
  providedIn: 'root'
})
export class AksDuzenlerService {

  constructor(private http:HttpClient,private settingService:SettingsService,private authorize: AuthorizationService) { }

  getAksDuzenler(): Observable<AksDuzenler[]> {
    return this.http.get<AksDuzenler[]>(this.settingService.siteAddressBack + "AksDuzen", { headers: this.authorize._header });
  }

  getAksDuzen(id: number): Observable<AksDuzenler> {
    return this.http.get<AksDuzenler>(this.settingService.siteAddressBack + "AksDuzen/" + id, { headers: this.authorize._header });
  }

  aksDuzenEkle(form: AksDuzenEkle) {
    return this.http.post<ServerJsonResult>(this.settingService.siteAddressBack + "AksDuzen/AksDuzenEkle", JSON.stringify(form), { headers: this.authorize._header })
  }

  aksDuzenGuncelle(form: AksDuzenGuncelle) {
    return this.http.post<ServerJsonResult>(this.settingService.siteAddressBack + "AksDuzen/AksDuzenGuncelle", JSON.stringify(form), { headers: this.authorize._header })
  }

  aksDuzenSil(id:number){
    return this.http.get<ServerJsonResult>(this.settingService.siteAddressBack + "AksDuzen/AksDuzenSil/"+id, { headers: this.authorize._header })
  }
}
