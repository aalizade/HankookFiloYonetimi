import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { AuthorizationService } from 'src/app/lazy-general-page/services/authorization/authorization.service';

@Component({
  selector: 'app-layout1',
  templateUrl: './layout1.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./layout1.component.css']
})
export class Layout1Component implements OnInit {

  userNameSurname: string = ""
  previousUrl: string = undefined;
  currentUrl: string = undefined;

  constructor(private authorize: AuthorizationService, private router: Router, private route: ActivatedRoute) {
    // this.authorize.CheckAuthorize("/login", this.authorize.role)
    // this.userNameSurname = this.authorize.userNameSurname

    // this.currentUrl = this.router.url;
    // router.events.subscribe(event => {
    //   if (event instanceof NavigationEnd) {
    //     this.previousUrl = this.currentUrl;
    //     this.currentUrl = event.url;
    //   };
    // });
    $('link[rel=stylesheet]').remove();
  }

  ngOnInit() {
  }

  getPreviousUrl(){
    this.router.navigate([this.previousUrl], {relativeTo: this.route});
  }  

  logout() {
    this.authorize.userToken = ""; this.authorize.userToken = "";
    this.authorize.userNameSurname = ""; this.authorize.userNameSurname = "";
    this.authorize.role = ""; this.authorize.role = "";
    window.location.href = "/login"
  }

  routerActivate() {
    this.authorize.CheckAuthorize("/login", this.authorize.role)
  }

}
