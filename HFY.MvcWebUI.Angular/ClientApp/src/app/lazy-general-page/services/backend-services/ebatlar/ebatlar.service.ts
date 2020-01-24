import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from '../../settings/settings.service';
import { AuthorizationService } from '../../authorization/authorization.service';
import { Observable } from 'rxjs';
import { Ebatlar } from 'src/app/lazy-general-page/classes/ebat/ebatlar';
import { EbatEkle } from 'src/app/lazy-general-page/classes/ebat/models/ebat-ekle';
import { EbatGuncelle } from 'src/app/lazy-general-page/classes/ebat/models/ebat-guncelle';
import { ServerJsonResult } from 'src/app/lazy-general-page/helpers/server-json-result/server-json-result';

@Injectable({
  providedIn: 'root'
})
export class EbatlarService {

  constructor(private http:HttpClient,private settingService:SettingsService,private authorize: AuthorizationService) { }

  getEbatlar(): Observable<Ebatlar[]> {
    return this.http.get<Ebatlar[]>(this.settingService.siteAddressBack + "Ebat", { headers: this.authorize._header });
  }

  getEbat(id: number): Observable<Ebatlar> {
    return this.http.get<Ebatlar>(this.settingService.siteAddressBack + "Ebat/" + id, { headers: this.authorize._header });
  }

  ebatEkle(form: EbatEkle) {
    return this.http.post<ServerJsonResult>(this.settingService.siteAddressBack + "Ebat/EbatEkle", JSON.stringify(form), { headers: this.authorize._header })
  }

  ebatGuncelle(form: EbatGuncelle) {
    return this.http.post<ServerJsonResult>(this.settingService.siteAddressBack + "Ebat/EbatGuncelle", JSON.stringify(form), { headers: this.authorize._header })
  }

  ebatSil(id: number) {
    return this.http.get<ServerJsonResult>(this.settingService.siteAddressBack + "Ebat/EbatSil/" + id, { headers: this.authorize._header })
  }

}
