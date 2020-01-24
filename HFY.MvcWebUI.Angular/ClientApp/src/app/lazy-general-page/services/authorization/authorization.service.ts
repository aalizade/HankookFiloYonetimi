import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SettingsService } from '../settings/settings.service';
import { LocalStorage } from 'ngx-store';
import { Observable } from 'rxjs';
import { ServerJsonResult } from '../../helpers/server-json-result/server-json-result';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  @LocalStorage() userToken: string
  @LocalStorage() userNameSurname: string
  @LocalStorage() role: string
  @LocalStorage() disDerinligiSayisi: number
  
  _header = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${this.userToken}`
  });
  constructor(private http: HttpClient, private settingService: SettingsService) { }

  Authorization(userName: string = "", password: string = "", role: string = ""): Observable<any> {
    return this.http.post<any>(this.settingService.siteAddressBack + "token/gettoken", { UserName: userName, Password: password, Role: role });
  }

  CheckAuthorize(goURL: string,role:string=this.role) {
    if (this.userToken !== null && this.userToken !== "") {
      this.http.get(this.settingService.siteAddressBack + "token/checktoken/"+role, { headers: this._header }).subscribe((data: { Result: boolean }) => {
        if (!data.Result || this.userToken === null) window.location.href = goURL
      }, err => {
        window.location.href = goURL
      })
    }
    else window.location.href = goURL
  }

  CheckAuthorizeObservable(role:string=this.role): Observable<any> {
    return this.http.get(this.settingService.siteAddressBack + "token/checktoken/"+role, { headers: this._header })
  }

  GetUserTokenInfo(){
    return this.http.get<ServerJsonResult>(this.settingService.siteAddressBack + "Token/GetUserTokenInfo/", { headers: this._header })
  }

}
