import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '../../services/authorization/authorization.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Role } from '../../services/authorization/roles/role';

@Component({
  selector: 'app-layout1',
  templateUrl: './layout1.component.html',
  styleUrls: ['./layout1.component.css']
})
export class Layout1Component implements OnInit {

  userNameSurname: string = "";
  previousUrl: string = undefined;
  currentUrl: string = undefined;
  adminRole: boolean = false;
  firmaRole: boolean = false;
  subeRole: boolean = false;
  role: string = "";
  mobilGorunum:boolean = false;

  constructor(private authorize: AuthorizationService, private router: Router, private route: ActivatedRoute) {

    if (window.innerWidth <= 800) {
      this.mobilGorunum = true;
    }

    this.authorize.CheckAuthorize("/login", this.authorize.role)
    this.userNameSurname = this.authorize.userNameSurname;
    this.role = this.authorize.role;
    this.adminRole = this.authorize.role === Role.Admin ? true : false;
    if (!this.adminRole) {
      this.firmaRole = ( this.authorize.role === Role.FirmaKullanicisi || Role.IsletmeKullanicisi) ? true : false;
    }

    this.subeRole = (this.authorize.role === Role.SubeKullanicisi) ? true : false;


    this.currentUrl = this.router.url;
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
      };
    });

    let file = document.createElement('link');
    file.rel = 'stylesheet';
    file.href = 'assets/template/assets/css/app.min.css'
    //document.head.appendChild(file)

    const dynamicScripts = [
      'assets/template/assets/js/app.js',
    ];
    for (let i = 0; i < dynamicScripts.length; i++) {
      const node = document.createElement('script');
      node.src = dynamicScripts[i];
      node.type = 'text/javascript';
      node.async = false;
      node.charset = 'utf-8';
      document.getElementsByTagName('head')[0].appendChild(node);
    }
  }

  ngOnInit() {
  }

  getPreviousUrl() {
    this.router.navigate([this.previousUrl], { relativeTo: this.route })
    // .then(() => {
    //   window.location.reload();
    // });
  }

  logout() {
    this.authorize.userToken = ""; this.authorize.userToken = "";
    this.authorize.userNameSurname = ""; this.authorize.userNameSurname = "";
    this.authorize.role = ""; this.authorize.role = "";
    this.authorize.disDerinligiSayisi = null; this.authorize.disDerinligiSayisi = null;
    window.location.href = "/login"
  }

  routerActivate() {
    this.authorize.CheckAuthorize("/login", this.authorize.role)
  }

}
