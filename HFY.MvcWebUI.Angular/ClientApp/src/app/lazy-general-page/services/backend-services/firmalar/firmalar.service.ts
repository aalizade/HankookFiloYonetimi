import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from '../../settings/settings.service';
import { AuthorizationService } from '../../authorization/authorization.service';
import { Observable } from 'rxjs';
import { Firmalar } from 'src/app/lazy-general-page/classes/firmalar/firmalar';
import { FirmaEkle } from 'src/app/lazy-general-page/classes/firmalar/models/firma-ekle';
import { FirmaGuncelle } from 'src/app/lazy-general-page/classes/firmalar/models/firma-guncelle';
import { ServerJsonResult } from 'src/app/lazy-general-page/helpers/server-json-result/server-json-result';

@Injectable({
  providedIn: 'root'
})
export class FirmalarService {

  constructor(private http: HttpClient, private settingService: SettingsService, private authorize: AuthorizationService) { }

  getFirmalar(): Observable<Firmalar[]> {
    return this.http.get<Firmalar[]>(this.settingService.siteAddressBack + "Firma/GetAllActives", { headers: this.authorize._header });
  }

  getFirma(id: number): Observable<Firmalar> {
    return this.http.get<Firmalar>(this.settingService.siteAddressBack + "Firma/" + id, { headers: this.authorize._header });
  }

  getFirmaWithUsername(userName: string): Observable<Firmalar> {
    return this.http.get<Firmalar>(this.settingService.siteAddressBack + "Rezervasyon/GetFirmaWithUsername/" + userName);
  }

  firmaEkle(form: FirmaEkle) {
    return this.http.post<ServerJsonResult>(this.settingService.siteAddressBack + "Firma/FirmaEkle", JSON.stringify(form), { headers: this.authorize._header })
  }

  firmaGuncelle(form: FirmaGuncelle) {
    return this.http.post<ServerJsonResult>(this.settingService.siteAddressBack + "Firma/FirmaGuncelle", JSON.stringify(form), { headers: this.authorize._header })
  }

  UfirmaGuncelle(form: FirmaGuncelle) {
    return this.http.post<ServerJsonResult>(this.settingService.siteAddressBack + "Firma/UFirmaGuncelle", JSON.stringify(form), { headers: this.authorize._header })
  }

  firmaSil(id: number) {
    return this.http.get<ServerJsonResult>(this.settingService.siteAddressBack + "Firma/FirmaSil/" + id, { headers: this.authorize._header })
  }

  //
  getTumKullanicilar(): Observable<Firmalar[]> {
    return this.http.get<Firmalar[]>(this.settingService.siteAddressBack + "Firma/TumKullanicilar", { headers: this.authorize._header });
  }
  // Örneğin; İşletme kullanıcısı bu fonksiyonu çağırırsa, aynı işletmeye bağlı işletme kullanıcısı olan arkadaşlarını çeker.
  getEmsalIsletmeKullanicilari(firmaId:number): Observable<Firmalar[]> {
    return this.http.get<Firmalar[]>(this.settingService.siteAddressBack + "Firma/EmsalIsletmeKullanicilar/"+firmaId, { headers: this.authorize._header });
  }
  //
  getIsletmeler(): Observable<Firmalar[]> {
    return this.http.get<Firmalar[]>(this.settingService.siteAddressBack + "Firma/Isletmeler", { headers: this.authorize._header });
  }
  //
  getSubeler(): Observable<Firmalar[]> {
    return this.http.get<Firmalar[]>(this.settingService.siteAddressBack + "Firma/Subeler", { headers: this.authorize._header });
  }

  //
  getAllActivesWithBagliID(): Observable<Firmalar[]> {
    return this.http.get<Firmalar[]>(this.settingService.siteAddressBack + "Firma/GetAllActivesWithBagliID", { headers: this.authorize._header });
  }


}
