import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from '../../settings/settings.service';
import { AuthorizationService } from '../../authorization/authorization.service';
import { Observable } from 'rxjs';
import { Lastikler } from 'src/app/lazy-general-page/classes/lastikler/lastikler';
import { LastikEkle } from 'src/app/lazy-general-page/classes/lastikler/models/lastik-ekle';
import { LastikGuncelle } from 'src/app/lazy-general-page/classes/lastikler/models/lastik-guncelle';
import { ServerJsonResult } from 'src/app/lazy-general-page/helpers/server-json-result/server-json-result';
import { LastikKopyala } from 'src/app/lazy-general-page/classes/lastikler/models/lastik-kopyala';
import { LastikRotasyonaKopyala } from 'src/app/lazy-general-page/classes/lastikler/models/lastik-rotasyona-kopyala';

@Injectable({
  providedIn: 'root'
})
export class LastiklerService {

  constructor(private http: HttpClient, private settingService: SettingsService, private authorize: AuthorizationService) { }

  getLastikler(): Observable<Lastikler[]> {
    return this.http.get<Lastikler[]>(this.settingService.siteAddressBack + "Lastik", { headers: this.authorize._header });
  }

  getLastik(id: number): Observable<Lastikler> {
    return this.http.get<Lastikler>(this.settingService.siteAddressBack + "Lastik/" + id, { headers: this.authorize._header });
  }

  lastikEkle(form: LastikEkle) {
    return this.http.post<ServerJsonResult>(this.settingService.siteAddressBack + "Lastik/LastikEkle", JSON.stringify(form), { headers: this.authorize._header })
  }

  lastikKopyala(form: LastikKopyala) {
    return this.http.post<ServerJsonResult>(this.settingService.siteAddressBack + "Lastik/LastikKopyala", JSON.stringify(form), { headers: this.authorize._header })
  }

  lastikGuncelle(form: LastikGuncelle) {
    return this.http.post<ServerJsonResult>(this.settingService.siteAddressBack + "Lastik/LastikGuncelle", JSON.stringify(form), { headers: this.authorize._header })
  }

  lastikSil(id: number) {
    return this.http.get<ServerJsonResult>(this.settingService.siteAddressBack + "Lastik/LastikSil/" + id, { headers: this.authorize._header })
  }

  //

  // Lastik Bakım alanına tıklandığında ve seri no girildiğinde, giriş yapmış kullanıcının o lastiğe erişim iznini kontrol eder. Duruma göre bir yanıt döndürür.
  lastikErisimDogrulama(seriNo: string) {
    return this.http.get<ServerJsonResult>(this.settingService.siteAddressBack + "Lastik/LastikErisimDogrula/" + seriNo, { headers: this.authorize._header })
  }

  // Lastiği hurdaya taşımak için gereklidir.
  lastigiHurdayaTasi(lastikId: number) {
    return this.http.get<ServerJsonResult>(this.settingService.siteAddressBack + "Lastik/LastigiHurdayaTasi/" + lastikId, { headers: this.authorize._header });
  }

  // Eğer lastik rotasyondan kopyalanacaksa burası işlenir. Önce depoya, sonra araca olmak üzere 2 adımda tamamlanır.
  lastigiRotasyonaKopyala(form: LastikRotasyonaKopyala) {
    return this.http.post<ServerJsonResult>(this.settingService.siteAddressBack + "Lastik/LastigiRotasyonaKopyala", JSON.stringify(form), { headers: this.authorize._header });
  }
}
