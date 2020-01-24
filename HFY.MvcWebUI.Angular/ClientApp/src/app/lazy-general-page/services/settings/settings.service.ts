import { Injectable, Inject } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  domain: string;
  constructor(@Inject(DOCUMENT) private document: any, private http: HttpClient, private router: Router) { }
  siteAdress = this.returnHostname()
  siteAddressBack = this.returnHostname() + "/api/"

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };


  returnHostname() {
    this.domain = this.document.location.hostname;
    if (this.domain === "localhost") return ""
    return "" // "http://netcore.kirpii.com"
  }
}
