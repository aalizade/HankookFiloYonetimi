import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthorizationService } from 'src/app/lazy-general-page/services/authorization/authorization.service';
import { LastiklerService } from 'src/app/lazy-general-page/services/backend-services/lastikler/lastikler.service';
import { SettingsService } from 'src/app/lazy-general-page/services/settings/settings.service';
import { SweetAlertService } from 'src/app/lazy-general-page/services/extra-services/sweet-alert.service';
import { FirmalarService } from 'src/app/lazy-general-page/services/backend-services/firmalar/firmalar.service';
import { LastikMarkalarService } from 'src/app/lazy-general-page/services/backend-services/lastik-markalar/lastik-markalar.service';
import { LastikMarkaDesenlerService } from 'src/app/lazy-general-page/services/backend-services/lastik-marka-desenler/lastik-marka-desenler.service';
import { EbatlarService } from 'src/app/lazy-general-page/services/backend-services/ebatlar/ebatlar.service';
import { LastikTiplerService } from 'src/app/lazy-general-page/services/backend-services/lastik-tipler/lastik-tipler.service';
import { LastikKonumlarService } from 'src/app/lazy-general-page/services/backend-services/lastik-konumlar/lastik-konumlar.service';
import { Select2OptionData } from 'ng-select2';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { LastikEkle } from 'src/app/lazy-general-page/classes/lastikler/models/lastik-ekle';
import { ToastrService } from 'src/app/lazy-general-page/services/extra-services/toastr.service';
import { LastikTurlerService } from 'src/app/lazy-general-page/services/backend-services/lastik-turler/lastik-turler.service';
import { DatePipe, Location } from '@angular/common';
import { LastikMarkaDesenOzelliklerService } from 'src/app/lazy-general-page/services/backend-services/lastik-marka-desen-ozellikler/lastik-marka-desen-ozellikler.service';
import { Role } from 'src/app/lazy-general-page/services/authorization/roles/role';

@Component({
  selector: 'app-lastik-ekle',
  templateUrl: './lastik-ekle.component.html',
  styleUrls: ['./lastik-ekle.component.css']
})
export class LastikEkleComponent implements OnInit {

  lastikKonumId: string = "";
  myDate = new Date();
  anaSayfayaDonBtn: boolean = false;
  lastikKilometreKapali = true;

  // araç sayfasından seri no girmek yerine yeni lastik eklemek isteyen kullanıcı, firmaId bilgisini de bize gönderir.
  firmaId: number;
  // araç sayfasından seri no girmek yerine yeni lastik eklemek isteyen kullanıcı, aracId bilgisini de bize gönderir. Böylelikle kayıt işlemi tamamlanınca araç sayfasına tekrar döner.
  aracId: number
  // araç sayfasından seri no girmek yerine yeni lastik eklemek isteyen kullanıcı, aks pozisyon bilgisini de bize gönderir.
  aksPozisyonListName: string;
  // araç sayfasından seri no girmek yerine yeni lastik eklemek isteyen kullanıcı, aks pozisyon bilgisini de bize gönderir.
  aksPozisyonId: number;
  // araç sayfasından seri no girmek yerine yeni lastik eklemek isteyen kullanıcı, aks pozisyon bilgisini de bize gönderir.
  aksNumarasi: number


  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient, private route: ActivatedRoute, private authorize: AuthorizationService,
    private lastikService: LastiklerService, private firmalarService: FirmalarService, private lastikMarkalarService: LastikMarkalarService,
    private lastikMarkaDesenlerService: LastikMarkaDesenlerService, private lastikMarkaDesenOzelliklerService: LastikMarkaDesenOzelliklerService, private ebatlarService: EbatlarService, private lastikTurlerService: LastikTurlerService, private lastikTiplerService: LastikTiplerService,
    private lastikKonumlarService: LastikKonumlarService, private datePipe: DatePipe, private location:Location,
    private settingService: SettingsService, private sweetAlert: SweetAlertService, private toastr: ToastrService) {

    // araç sayfasından seri no girmek yerine yeni lastik eklemek isteyen kullanıcı, firmaId bilgisini de bize gönderir.
    const urlParams = new URLSearchParams(window.location.search);
    this.firmaId = Number(urlParams.get('firmaId'));
    this.aracId = Number(urlParams.get('aracId'));
    this.aksPozisyonListName = String(urlParams.get('aksPozisyonListName'));
    this.aksPozisyonId = Number(urlParams.get('aksPozisyonId'));
    this.aksNumarasi = Number(urlParams.get('aksNumarasi'));

    this.location.replaceState(window.location.pathname);

    // initialize FormGroup  
    this.regiForm = fb.group({
      'KayitTarihi': [this.datePipe.transform(this.myDate, 'yyyy-MM-dd'), Validators.compose([Validators.required])],
      'FirmaID': [null, Validators.compose([Validators.required])], // select
      'LastikMarkaID': [null, Validators.compose([Validators.required])], // select
      'LastikMarkaDesenID': [null, Validators.compose([Validators.required])], // select
      'SeriNo': [null, Validators.compose([Validators.required, Validators.maxLength(14)])], // input=text
      'Fiyat': [null, Validators.compose([Validators.required, Validators.maxLength(4)])], // input=text
      'EbatID': [null, Validators.compose([Validators.required])], // select
      'LastikTurID': [null, Validators.compose([Validators.required])], // select
      'LastikTipID': [null, Validators.compose([Validators.required])], // select
      'DisSeviyesi': [null, Validators.compose([Validators.required, , Validators.max(99)])], // input=text
      'LastikKilometre': [null, Validators.compose([Validators.maxLength(7)])], // input=text
      'LastikKonumID': [null, Validators.compose([Validators.required])], // select
    });

    this.firmalarService.getFirmalar().subscribe(response => {
      this.firmalar = [];
      response.filter(a => a.ListeAktiflik == true).forEach(item => {
        this.firmalar.push({
          id: String(item.FirmaID),
          text: item.Rol === Role.Sube ? item.FirmaAd + " [ŞUBE]" : item.FirmaAd
        });
      });

      // araç sayfasından seri no girmek yerine yeni lastik eklemek isteyen kullanıcı, firmaId bilgisini de bize gönderir.
      if (this.firmaId !== undefined && this.firmaId !== 0) {
        var firmaIceriyorMu = this.firmalar.find(a => a.id === this.firmaId.toString());

        if (firmaIceriyorMu !== undefined) {
          this.regiForm.controls["FirmaID"].setValue(this.firmaId);
        }
      }
    });
    //
    this.lastikMarkalarService.getLastikMarkalar().subscribe(response => {
      this.lastikMarkalar = [];
      response.filter(a => a.ListeAktiflik == true).forEach(item => {
        this.lastikMarkalar.push({
          id: String(item.LastikMarkaID),
          text: item.Ad
        });
      })
    });
    //
    // this.lastikMarkaDesenlerService.getLastikMarkaDesenler().subscribe(response => {
    //   this.lastikMarkaDesenler = [];
    //   response.filter(a => a.ListeAktiflik == true).forEach(item => {
    //     this.lastikMarkaDesenler.push({
    //       id: String(item.LastikMarkaDesenID),
    //       text: item.Ad
    //     });
    //   })
    // });
    //
    this.ebatlarService.getEbatlar().subscribe(response => {
      this.ebatlar = [];
      response.filter(a => a.ListeAktiflik == true).forEach(item => {
        this.ebatlar.push({
          id: String(item.EbatID),
          text: item.Ad
        });
      })
    });
    //
    this.lastikTurlerService.getLastikTurler().subscribe(response => {
      this.lastikTurler = [];
      this.varsayilanLastikTur = response.find(a => a.Kod === "TBR") !== undefined ? response.find(a => a.Kod === "TBR").LastikTurID.toString() : "";
      response.filter(a => a.ListeAktiflik == true).forEach(item => {
        this.lastikTurler.push({
          id: String(item.LastikTurID),
          text: item.Kod
        });
      })
    });
    //
    this.lastikTiplerService.getLastikTipler().subscribe(response => {
      this.lastikTipler = [];
      response.filter(a => a.ListeAktiflik == true).forEach(item => {
        this.lastikTipler.push({
          id: String(item.LastikTipID),
          text: item.Ad
        });
      })
    });
    //
    this.lastikKonumlarService.getLastikKonumlar().subscribe(response => {
      this.lastikKonumlar = [];
      response.filter(a => a.ListeAktiflik == true && a.Ad !== "Araç Üstünde").forEach(item => {
        if (item.Ad === "Depo") this.lastikKonumId = String(item.LastikKonumID);
        this.lastikKonumlar.push({
          id: String(item.LastikKonumID),
          text: item.Ad,
        });
      })
    });



    if (window.innerWidth <= 800) {
      this.anaSayfayaDonBtn = true;
    }
  }

  regiForm: FormGroup;

  firmalar: Array<Select2OptionData> = [];
  lastikMarkalar: Array<Select2OptionData> = [];
  lastikMarkaDesenler: Array<Select2OptionData> = [];
  ebatlar: Array<Select2OptionData> = [];
  lastikTurler: Array<Select2OptionData> = []; varsayilanLastikTur: string;
  lastikTipler: Array<Select2OptionData> = [];
  lastikKonumlar: Array<Select2OptionData> = [];

  ngOnInit() {
  }

  getDesen(event: any) {
    this.lastikMarkaDesenlerService.getLastikMarkaDesenler().subscribe(response => {
      this.lastikMarkaDesenler = [];
      this.regiForm.controls["LastikMarkaDesenID"].setValue(null);
      response.filter(a => a.ListeAktiflik == true && a.LastikMarkaID == Number(event.value)).forEach(item => {
        this.lastikMarkaDesenler.push({
          id: String(item.LastikMarkaDesenID),
          text: item.Ad
        });
      })
    });
  }

  onFormSubmit(form: LastikEkle) {
    if (form.LastikKilometre === null) form.LastikKilometre = 0;
    this.lastikService.lastikEkle(form).subscribe(response => {
      if (response.MessageType === 1) {
        this.toastr.success(response.Message);
        setTimeout(() => {
          if (this.aracId !== undefined && this.aracId !== 0) {
            window.location.href = "/islemler/arac-bakim/arac/" + this.aracId + "?seriNo=" + form.SeriNo +
            "&aksPozisyonListName=" + this.aksPozisyonListName + "&aksPozisyonId=" + this.aksPozisyonId + "&aksNumarasi=" + this.aksNumarasi;
          }
          else {
            if (window.innerWidth > 800) {
              // mobilde yönlendirme yapma, aynı sayfada kalsın.
              this.router.navigate(['/admin/lastik-yonetimi/lastik']);
            }
          }
        }, 500);
      }
      else {
        if (response.ErrorList !== undefined) {
          response.ErrorList.forEach(item => {
            this.toastr.error(item.ErrorMessage);
          })
        }
        if (response.Error !== "" && response.Error !== undefined) {
          this.toastr.error(response.Error);
        }
      }
    }, error => {
      this.toastr.error("Lütfen doldurulması gereken alanları doldurun.");
    })
  }

  getLastikMarkaDesenOzellik_DisDerinligi() {
    setTimeout(() => {
      let lastikMarkaDesenId = this.regiForm.controls["LastikMarkaDesenID"].value;
      let ebatId = this.regiForm.controls["EbatID"].value;

      if (lastikMarkaDesenId !== null && ebatId !== null) {
        this.lastikMarkaDesenOzelliklerService.getLastikMarkaDesenOzellikDisDerinligi(lastikMarkaDesenId, ebatId).subscribe(response => {
          if (response["Error"] === undefined) {
            this.regiForm.controls["DisSeviyesi"].setValue(response.DisDerinligi);
          }
        });
      }
    });
  }

  lastikKilometreAcKapat(event: any) {
    this.regiForm.controls["LastikKilometre"].setValue(null);
    let lastikTip = this.lastikTipler.find(a => a.id === event.value);
    if (lastikTip.text === "Kullanılmış") this.lastikKilometreKapali = false;
    else this.lastikKilometreKapali = true;
  }

  goToHomePage() {
    window.location.href = "/home";
  }
}
