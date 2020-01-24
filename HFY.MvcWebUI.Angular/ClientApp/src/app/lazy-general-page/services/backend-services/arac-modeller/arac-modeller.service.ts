import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from '../../settings/settings.service';
import { AuthorizationService } from '../../authorization/authorization.service';
import { Observable } from 'rxjs';
import { AracModeller } from 'src/app/lazy-general-page/classes/arac-modeller/arac-modeller';
import { AracModelEkle } from 'src/app/lazy-general-page/classes/arac-modeller/models/arac-model-ekle';
import { AracModelGuncelle } from 'src/app/lazy-general-page/classes/arac-modeller/models/arac-model-guncelle';
import { ServerJsonResult } from 'src/app/lazy-general-page/helpers/server-json-result/server-json-result';

@Injectable({
  providedIn: 'root'
})
export class AracModellerService {

  constructor(private http: HttpClient, private settingService: SettingsService, private authorize: AuthorizationService) { }

  getAracModeller(): Observable<AracModeller[]> {
    return this.http.get<AracModeller[]>(this.settingService.siteAddressBack + "AracModel", { headers: this.authorize._header });
  }

  getAracModel(id: number): Observable<AracModeller> {
    return this.http.get<AracModeller>(this.settingService.siteAddressBack + "AracModel/" + id, { headers: this.authorize._header });
  }

  aracModelEkle(form: AracModelEkle) {
    return this.http.post<ServerJsonResult>(this.settingService.siteAddressBack + "AracModel/AracModelEkle", JSON.stringify(form), { headers: this.authorize._header })
  }

  aracModelGuncelle(form: AracModelGuncelle) {
    return this.http.post<ServerJsonResult>(this.settingService.siteAddressBack + "AracModel/AracModelGuncelle", JSON.stringify(form), { headers: this.authorize._header })
  }

  aracModelSil(id: number) {
    return this.http.get<ServerJsonResult>(this.settingService.siteAddressBack + "AracModel/AracModelSil/" + id, { headers: this.authorize._header })
  }

  // Araç modelini kullanan araç kaydı sayısını sorguluyoruz. Bu şekilde araç kategorisinin disabled olup olmayacağını client tarafında kontrol edeceğiz.
  aracModelKullaniliyorMu(modelId: number) {
    return this.http.get<boolean>(this.settingService.siteAddressBack + "AracModel/AracModelKullaniliyorMu/" + modelId, { headers: this.authorize._header })
  }
}
