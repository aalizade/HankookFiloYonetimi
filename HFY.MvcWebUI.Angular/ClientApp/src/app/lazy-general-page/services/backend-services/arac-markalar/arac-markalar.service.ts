import { Injectable } from '@angular/core';
import { AracMarkalar } from 'src/app/lazy-general-page/classes/arac-markalar/arac-markalar';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from '../../settings/settings.service';
import { AuthorizationService } from '../../authorization/authorization.service';
import { AracMarkaEkle } from 'src/app/lazy-general-page/classes/arac-markalar/models/arac-marka-ekle';
import { AracMarkaGuncelle } from 'src/app/lazy-general-page/classes/arac-markalar/models/arac-marka-guncelle';
import { ServerJsonResult } from 'src/app/lazy-general-page/helpers/server-json-result/server-json-result';

@Injectable({
  providedIn: 'root'
})
export class AracMarkalarService {

  constructor(private http:HttpClient,private settingService:SettingsService,private authorize: AuthorizationService) { }

  getAracMarkalar(): Observable<AracMarkalar[]> {
    return this.http.get<AracMarkalar[]>(this.settingService.siteAddressBack + "AracMarka", { headers: this.authorize._header });
  }

  getAracMarka(id: number): Observable<AracMarkalar> {
    return this.http.get<AracMarkalar>(this.settingService.siteAddressBack + "AracMarka/" + id, { headers: this.authorize._header });
  }

  aracMarkaEkle(form: AracMarkaEkle) {
    return this.http.post<ServerJsonResult>(this.settingService.siteAddressBack + "AracMarka/AracMarkaEkle", JSON.stringify(form), { headers: this.authorize._header })
  }

  aracMarkaGuncelle(form: AracMarkaGuncelle) {
    return this.http.post<ServerJsonResult>(this.settingService.siteAddressBack + "AracMarka/AracMarkaGuncelle", JSON.stringify(form), { headers: this.authorize._header })
  }

  aracMarkaSil(id:number){
    return this.http.get<ServerJsonResult>(this.settingService.siteAddressBack + "AracMarka/AracMarkaSil/"+id, { headers: this.authorize._header })
  }
}
