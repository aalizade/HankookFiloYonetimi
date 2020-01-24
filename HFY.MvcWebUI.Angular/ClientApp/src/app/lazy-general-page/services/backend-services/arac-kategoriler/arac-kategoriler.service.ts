import { Injectable } from '@angular/core';
import { SettingsService } from '../../settings/settings.service';
import { AuthorizationService } from '../../authorization/authorization.service';
import { Observable } from 'rxjs';
import { AracKategoriler } from 'src/app/lazy-general-page/classes/arac-kategoriler/arac-kategoriler';
import { AracKategoriEkle } from 'src/app/lazy-general-page/classes/arac-kategoriler/models/arac-kategori-ekle';
import { AracKategoriGuncelle } from 'src/app/lazy-general-page/classes/arac-kategoriler/models/arac-kategori-guncelle';
import { ServerJsonResult } from 'src/app/lazy-general-page/helpers/server-json-result/server-json-result';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AracKategorilerService {

  constructor(private http:HttpClient,private settingService:SettingsService,private authorize: AuthorizationService) { }

  getAracKategoriler(): Observable<AracKategoriler[]> {
    return this.http.get<AracKategoriler[]>(this.settingService.siteAddressBack + "AracKategori", { headers: this.authorize._header });
  }

  getAracKategori(id: number): Observable<AracKategoriler> {
    return this.http.get<AracKategoriler>(this.settingService.siteAddressBack + "AracKategori/" + id, { headers: this.authorize._header });
  }

  aracKategoriEkle(form: AracKategoriEkle) {
    return this.http.post<ServerJsonResult>(this.settingService.siteAddressBack + "AracKategori/AracKategoriEkle", JSON.stringify(form), { headers: this.authorize._header })
  }

  aracKategoriGuncelle(form: AracKategoriGuncelle) {
    return this.http.post<ServerJsonResult>(this.settingService.siteAddressBack + "AracKategori/AracKategoriGuncelle", JSON.stringify(form), { headers: this.authorize._header })
  }

  aracKategoriSil(id:number){
    return this.http.get<ServerJsonResult>(this.settingService.siteAddressBack + "AracKategori/AracKategoriSil/"+id, { headers: this.authorize._header })
  }
}
