import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from '../../settings/settings.service';
import { AuthorizationService } from '../../authorization/authorization.service';
import { LastikMarkaDesenOzellikler } from 'src/app/lazy-general-page/classes/lastik-marka-desen-ozellikler/lastik-marka-desen-ozellikler';
import { Observable } from 'rxjs';
import { LastikMarkaDesenOzellikEkle } from 'src/app/lazy-general-page/classes/lastik-marka-desen-ozellikler/models/lastik-marka-desen-ozellik-ekle';
import { LastikMarkaDesenOzellikGuncelle } from 'src/app/lazy-general-page/classes/lastik-marka-desen-ozellikler/models/lastik-marka-desen-ozellik-guncelle';
import { ServerJsonResult } from 'src/app/lazy-general-page/helpers/server-json-result/server-json-result';

@Injectable({
  providedIn: 'root'
})
export class LastikMarkaDesenOzelliklerService {

  constructor(private http: HttpClient, private settingService: SettingsService, private authorize: AuthorizationService) { }

  getLastikMarkaDesenOzellikler(): Observable<LastikMarkaDesenOzellikler[]> {
    return this.http.get<LastikMarkaDesenOzellikler[]>(this.settingService.siteAddressBack + "LastikMarkaDesenOzellik/", { headers: this.authorize._header });
  }

  getLastikMarkaDesenOzellik(id: number): Observable<LastikMarkaDesenOzellikler> {
    return this.http.get<LastikMarkaDesenOzellikler>(this.settingService.siteAddressBack + "LastikMarkaDesenOzellik/" + id, { headers: this.authorize._header });
  }

  lastikMarkaDesenOzellikEkle(form: LastikMarkaDesenOzellikEkle) {
    return this.http.post<ServerJsonResult>(this.settingService.siteAddressBack + "LastikMarkaDesenOzellik/LastikMarkaDesenOzellikEkle", JSON.stringify(form), { headers: this.authorize._header })
  }

  lastikMarkaDesenOzellikGuncelle(form: LastikMarkaDesenOzellikGuncelle) {
    return this.http.post<ServerJsonResult>(this.settingService.siteAddressBack + "LastikMarkaDesenOzellik/LastikMarkaDesenOzellikGuncelle", JSON.stringify(form), { headers: this.authorize._header })
  }

  lastikMarkaDesenOzellikSil(id: number) {
    return this.http.get<ServerJsonResult>(this.settingService.siteAddressBack + "LastikMarkaDesenOzellik/LastikMarkaDesenOzellikSil/" + id, { headers: this.authorize._header })
  }

  // Diş Derinliğini lastik ekleme ekranında otomatik getirmek için, lastik marka desen id'sine ve ebat id'sine ihtiyacımız vardır.
  getLastikMarkaDesenOzellikDisDerinligi(lastikMarkaDesenId:number, ebatId:number){
    return this.http.get<LastikMarkaDesenOzellikler>(this.settingService.siteAddressBack + "LastikMarkaDesenOzellik/LastikMarkaDesenOzellikDisDerinligi/" + lastikMarkaDesenId+"/"+ebatId, { headers: this.authorize._header })
  }
}
