import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'src/app/lazy-general-page/services/extra-services/toastr.service';
import { AuthorizationService } from 'src/app/lazy-general-page/services/authorization/authorization.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  constructor(private router: Router, private http: HttpClient, private toastr: ToastrService, private authorize: AuthorizationService) {
    let file = document.createElement('link');
    file.rel = 'stylesheet';
    file.href = 'assets/template/assets/css/app.min.css'
    //document.head.appendChild(file);
    // Eğer kullanıcının token'i varsa ve süresi bitmemişse direkt olarak admin sayfasına yönlendir.
    this.authorize.CheckAuthorizeObservable()
      .subscribe((data: { Result: boolean }) => {
        if (data.Result && this.authorize.userToken !== null && this.authorize.userToken !== "") this.goToHomePage();
      }, err => { console.log(err); this.authorize.userToken = ""; this.authorize.userToken = ""; this.authorize.userNameSurname = ""; this.authorize.userNameSurname = ""; this.authorize.role = ""; this.authorize.role = ""; })

    $(document).ready(function () {
      $("#show_hide_password a").on('click', function (event) {
        event.preventDefault();
        if ($('#show_hide_password input').attr("type") == "text") {
          $('#show_hide_password input').attr('type', 'password');
          $('#show_hide_password i').addClass("fa-eye-slash");
          $('#show_hide_password i').removeClass("fa-eye");
        } else if ($('#show_hide_password input').attr("type") == "password") {
          $('#show_hide_password input').attr('type', 'text');
          $('#show_hide_password i').removeClass("fa-eye-slash");
          $('#show_hide_password i').addClass("fa-eye");
        }
      });
    });

  }

  username: string = ""
  password: string = ""

  login() {
    if (this.username == "" || this.password == "") this.toastr.error("Lütfen kullanıcı adı ve şifre kısmını doldurunuz.");
    else {
      this.authorize.Authorization(this.username, this.password, "")
        .subscribe((data: { Token: string, UserNameSurname: string, DisDerinligiSayisi: number, Role: string, Message: string }) => {
          if (data.Token !== "" && data.Token !== undefined) {
            this.authorize.userToken = ""; this.authorize.userToken = data.Token;
            this.authorize.userNameSurname = ""; this.authorize.userNameSurname = data.UserNameSurname;
            this.authorize.role = ""; this.authorize.role = data.Role;
            this.authorize.disDerinligiSayisi = data.DisDerinligiSayisi;
            this.goToHomePage();
          }
          else {
            this.toastr.warning(data.Message)
          }
        });
    }
  }

  goToHomePage() {
    window.location.href = "/home"
    // this.router.navigate(["/home"], {relativeTo: this.route});
  }

  ngOnInit() {
  }

}
