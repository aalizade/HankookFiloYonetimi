import { Component, OnInit, ComponentFactoryResolver, ViewContainerRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthorizationService } from 'src/app/lazy-general-page/services/authorization/authorization.service';
import { AraclarService } from 'src/app/lazy-general-page/services/backend-services/araclar/araclar.service';
import { LastiklerService } from 'src/app/lazy-general-page/services/backend-services/lastikler/lastikler.service';
import { LastikDialogComponent } from 'src/app/lazy-lastik-bakim-page/components/lastik-bakim/lastik-dialog/lastik-dialog.component';

declare var Swal: any;

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  aracBakimMenu: boolean = false;
  lastikBakimMenu: boolean = false;
  mobilGorunum: boolean = false;
  userNameSurname: string = "";

  @ViewChild('LastikDialogContainer', { read: ViewContainerRef, static: false }) container: ViewContainerRef;

  constructor(private authorize: AuthorizationService, private router: Router, private route: ActivatedRoute, private araclarService: AraclarService,
    private lastiklerService: LastiklerService, private componentFactoryResolver: ComponentFactoryResolver) {
    this.authorize.CheckAuthorize("/login", this.authorize.role)
    this.userNameSurname = this.authorize.userNameSurname

    setTimeout(function () {
      $('link[rel=stylesheet]').remove();
      let file = document.createElement('link');
      file.rel = 'stylesheet';
      file.href = 'assets/lazy-home-page/default.css'
      document.head.appendChild(file);
      file = document.createElement('link');
      file.rel = 'stylesheet';
      file.href = 'assets/lazy-home-page/style.css'
      document.head.appendChild(file);
      file = document.createElement('link');
      file.rel = 'stylesheet';
      file.href = 'assets/lazy-home-page/plaka-giris-dialog.css'
      document.head.appendChild(file);


    }, 80)

    if (window.innerWidth <= 800) {
      this.mobilGorunum = true;
    }
  }

  ngOnInit() {
  }

  openDialog() {
    Swal.fire({
      title: 'Plaka Giriniz',
      input: 'text',
      inputValue: "",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Araca Git',
      inputAttributes: {
        maxlength: 9
      },
      cancelButtonText: "Kapat",
      inputValidator: (value) => {
        if (!value) {
          return 'Lütfen plaka giriniz.'
        }

        var v;
        var val = value;
        v = val.toString().toLocaleUpperCase().trim();
        if (v.length > 9) {
          value = v.substring(0, 9);
        }

      },
      preConfirm: (okay) => {
        return this.araclarService.aracErisimDogrulama(okay).toPromise().then(response => {
          if (response.MessageType === 1) {
            window.location.href = "/islemler/arac-bakim/arac/" + response.Result;
          }
          else {
            Swal.showValidationMessage(
              `${response.Error}`
            );
          }
        }).catch(err => {
          Swal.showValidationMessage(
            `Bir hata oluştu, lütfen daha sonra tekrar deneyin.`
          );
          console.log(err);
        });
      }
    })
    $(".swal2-confirm").css("background", "none");
    $(".swal2-confirm").html("<img src='assets/lazy-home-page/img/reply.png'>");
    $(".swal2-cancel").css("background", "none");
    $(".swal2-cancel").html("<img src='assets/lazy-home-page/img/cancel.png'>");
  }

  aracBakimIslemi() {
    let file = document.createElement('link');
    file.rel = 'stylesheet';
    file.href = 'assets/lazy-home-page/plaka-giris-dialog.css'
    document.head.appendChild(file);
    if (window.innerWidth <= 800) {
      this.aracBakimMenu = true;
    }
    else {
      this.openDialog();
    }
  }

  lastikBakimIslemi() {
    if (window.innerWidth <= 800) {
      this.lastikBakimMenu = true;
    }
    else {
      this.lastikBakimOpenDialog();
    }
  }

  lastikBakimOpenDialog() {
    $('link[href="assets/lazy-home-page/plaka-giris-dialog.css"]').remove();
    Swal.fire({
      title: 'Seri No Giriniz',
      input: 'text',
      inputValue: "",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Lastiğe Git',
      inputAttributes: {
        maxlength: 12
      },
      cancelButtonText: "Kapat",
      inputValidator: (value) => {
        if (!value) {
          return 'Lütfen seri no giriniz.'
        }
      },
      preConfirm: (okay) => {
        return this.lastiklerService.lastikErisimDogrulama(okay).toPromise().then(response => {
          if (response.MessageType === 1) {
            this.container.clear();
            const componentFactory = this.componentFactoryResolver.resolveComponentFactory(LastikDialogComponent);
            const componentRef = this.container.createComponent(componentFactory);
            componentRef.instance.lastikId = Number(response.Result);
            console.log(Number(response.Result))
          }
          else if (response.MessageType === 2) {
            this.aracaGit(Number(response.Result));
          }
          else {
            Swal.showValidationMessage(
              `${response.Error}`
            );
          }
        }).catch(err => {
          Swal.showValidationMessage(
            `Bir hata oluştu, lütfen daha sonra tekrar deneyin.`
          );
          console.log(err);
        });
      }
    });
    $(".swal2-input").attr('style', "text-align:center !important;text-transform: uppercase !important;font-weight: bold !important;font-size:30px !important;");
    $(".swal2-confirm").css("background", "none");
    $(".swal2-confirm").html("<img src='assets/aks-iskeletleri/lastik-dialog/img/tireOk.png'>");
    $(".swal2-cancel").css("background", "none");
    $(".swal2-cancel").html("<img src='assets/lazy-home-page/img/cancel.png'>");
  }

  aracaGit(aracId: number) {
    setTimeout(() => {
      Swal.fire({
        title: 'Bu lastik araç üzerinde görünmektedir. Araca Gitmek İstiyor Musunuz?',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Evet',
        cancelButtonText: "Hayır",
        preConfirm: (onay) => {
          if (onay) {
            window.location.href = "/islemler/arac-bakim/arac/" + aracId;
          }
        }
      })
    }, 100);

  }

  logout() {
    this.authorize.userToken = ""; this.authorize.userToken = "";
    this.authorize.userNameSurname = ""; this.authorize.userNameSurname = "";
    this.authorize.role = ""; this.authorize.role = "";
    this.authorize.disDerinligiSayisi = null; this.authorize.disDerinligiSayisi = null;
    window.location.href = "/login"
  }

  routeAnyLazyModule(address: string) {
    window.location.href = address;
    //this.router.navigate([address], {relativeTo: this.route});
  }

}
