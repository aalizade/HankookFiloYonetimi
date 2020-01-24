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
import { ToastrService } from 'src/app/lazy-general-page/services/extra-services/toastr.service';
import { LastikTurlerService } from 'src/app/lazy-general-page/services/backend-services/lastik-turler/lastik-turler.service';
import { LastikGuncelle } from 'src/app/lazy-general-page/classes/lastikler/models/lastik-guncelle';
import { DatePipe } from '@angular/common';
import { Role } from 'src/app/lazy-general-page/services/authorization/roles/role';
import { LastikHareketlerService } from 'src/app/lazy-general-page/services/backend-services/lastik-hareketler/lastik-hareketler.service';
import { LastikMarkaDesenOzelliklerService } from 'src/app/lazy-general-page/services/backend-services/lastik-marka-desen-ozellikler/lastik-marka-desen-ozellikler.service';

declare var Swal:any;


@Component({
  selector: 'app-lastik-guncelle',
  templateUrl: './lastik-guncelle.component.html',
  styleUrls: ['./lastik-guncelle.component.css']
})
export class LastikGuncelleComponent implements OnInit {

  lastikId: number;
  lastikGuncelleKilit: boolean = true;
  aracUstundeKonum: boolean = true;
  olcumVarKilitle: boolean = false;
  disSeviyesiKilitle:boolean = true;

  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient, private route: ActivatedRoute, private authorize: AuthorizationService,
    private lastikService: LastiklerService, private lastikHareketlerService: LastikHareketlerService, private lastikMarkaDesenOzelliklerService: LastikMarkaDesenOzelliklerService, private firmalarService: FirmalarService, private lastikMarkalarService: LastikMarkalarService,
    private lastikMarkaDesenlerService: LastikMarkaDesenlerService, private ebatlarService: EbatlarService, private lastikTurlerService: LastikTurlerService, private lastikTiplerService: LastikTiplerService,
    private lastikKonumlarService: LastikKonumlarService, private datePipe: DatePipe,
    private settingService: SettingsService, private sweetAlert: SweetAlertService, private toastr: ToastrService) {

    // initialize FormGroup  
    this.regiForm = fb.group({
      'KayitTarihi': [{ disabled: true, value: null }, Validators.compose([Validators.required])],
      'FirmaID': [null, Validators.compose([Validators.required])], // select
      'LastikMarkaID': [null, Validators.compose([Validators.required])], // select
      'LastikMarkaDesenID': [null, Validators.compose([Validators.required])], // select
      'SeriNo': [null, Validators.compose([Validators.required, Validators.maxLength(14)])], // input=text
      'Fiyat': [null, Validators.compose([Validators.required, Validators.maxLength(4)])], // input=text
      'EbatID': [null, Validators.compose([Validators.required])], // select
      'LastikTurID': [null, Validators.compose([Validators.required])], // select
      'LastikTipID': [null, Validators.compose([Validators.required])], // select
      'DisSeviyesi': [null, Validators.compose([Validators.required, Validators.maxLength(4)])], // input=text
      'LastikKilometre': [null, Validators.compose([Validators.required, Validators.maxLength(7)])], // input=text
      'LastikKonumID': [null, Validators.compose([Validators.required])], // select
      'ListeAktiflik': [null, Validators.compose([Validators.required])], // select
    });

    let id = this.route.snapshot.params.lastikId === undefined ? 0 : this.route.snapshot.params.lastikId;
    if (isNaN(id)) {
      window.location.href = "/admin/lastik-yonetimi/lastik";
    }
    else {
      this.lastikId = id;
      this.lastikService.getLastik(id).toPromise().then(response => {
        this.regiForm = fb.group({
          'LastikID': [response.LastikID, Validators.compose([Validators.required])],
          'KayitTarihi': [{ disabled: true, value: this.datePipe.transform(response.KayitTarihi, 'yyyy-MM-dd') }, Validators.compose([Validators.required])],
          'FirmaID': [response.FirmaID, Validators.compose([Validators.required])], // select
          'LastikMarkaID': [response.LastikMarkaID, Validators.compose([Validators.required])], // select
          'LastikMarkaDesenID': [response.LastikMarkaDesenID, Validators.compose([Validators.required])], // select
          'SeriNo': [response.SeriNo, Validators.compose([Validators.required, Validators.maxLength(14)])], // input=text
          'Fiyat': [response.Fiyat, Validators.compose([Validators.required, Validators.maxLength(4)])], // input=text
          'EbatID': [response.EbatID, Validators.compose([Validators.required])], // select
          'LastikTurID': [response.LastikTurID, Validators.compose([Validators.required])], // select
          'LastikTipID': [response.LastikTipID, Validators.compose([Validators.required])], // select
          'DisSeviyesi': [response.DisSeviyesi, Validators.compose([Validators.required, Validators.maxLength(4)])], // input=text
          'LastikKilometre': [response.LastikKilometre, Validators.compose([Validators.required, Validators.maxLength(7)])], // input=text
          'LastikKonumID': [response.LastikKonumID, Validators.compose([Validators.required])], // select
          'ListeAktiflik': [response.ListeAktiflik, Validators.compose([Validators.required])], // select
        });

        let lastikKonumId = response.LastikKonumID;

        this.lastikHareketlerService.getLastikHareketler(this.lastikId).toPromise().then(lastikHareketResponse1 => {
          var olcumBulucu = lastikHareketResponse1.find(a => a.YapilanIslem === "Ölçüm" || a.YapilanIslem === "Ölçüm + Gözlem");
          if (olcumBulucu !== undefined) this.olcumVarKilitle = true;
        });

        this.firmalarService.getFirmalar().subscribe(response => {
          this.firmalar = [];
          response.filter(a => a.ListeAktiflik == true).forEach(item => {
            this.firmalar.push({
              id: String(item.FirmaID),
              text: item.Rol === Role.Sube ? item.FirmaAd + " [ŞUBE]" : item.FirmaAd
            });
          })
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
        this.lastikMarkaDesenlerService.getLastikMarkaDesenler().subscribe(response2 => {
          this.lastikMarkaDesenler = [];
          response2.filter(a => a.ListeAktiflik == true && a.LastikMarkaID == response.LastikMarkaID).forEach(item => {
            this.lastikMarkaDesenler.push({
              id: String(item.LastikMarkaDesenID),
              text: item.Ad
            });
          })
        });
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
          try {
            let aracUstundeBulucu = response.find(a => a.Ad === "Araç Üstünde").LastikKonumID === lastikKonumId ? true : false;
            let responseFilter = response.filter(a => a.ListeAktiflik == true);

            if (!aracUstundeBulucu) {
              responseFilter = response.filter(a => a.ListeAktiflik == true && a.Ad !== "Araç Üstünde");
              this.aracUstundeKonum = false;
            }
            responseFilter.forEach(item => {
              if (item.LastikKonumID === lastikKonumId) {
                this.lastikGuncelleKilit = item.Ad === "Hurda" ? true : false;
              }
              this.lastikKonumlar.push({
                id: String(item.LastikKonumID),
                text: item.Ad
              });
            })
          } catch{ }

        });
      });
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
      var filterDesen = response.filter(a => a.ListeAktiflik == true && a.LastikMarkaID == Number(event.value));
      filterDesen.forEach(item => {
        this.lastikMarkaDesenler.push({
          id: String(item.LastikMarkaDesenID),
          text: item.Ad
        });
      })
    });
  }

  onFormSubmit(form: LastikGuncelle) {

    this.lastikService.lastikGuncelle(form).subscribe(response => {
      if (response.MessageType === 1) {
        this.toastr.success(response.Message);
        setTimeout(() => {
          this.router.navigate(['/admin/lastik-yonetimi/lastik']);
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
          console.log(response)
          if (response["Error"] === undefined) {
            this.regiForm.controls["DisSeviyesi"].setValue(response.DisDerinligi);
          }
          else{
            this.manuelDisDerinligiPopup();
          }
        });
      }
    });
  }

  manuelDisDerinligiPopup() {
    setTimeout(() => {
      let that = this;
      Swal.fire({
        title: 'Belirttiğiniz desen ve ebat bilgilerine uygun diş derinliği bulunmamaktadır. Diş derinliğini manuel olarak girmek istiyor musunuz?',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Evet',
        cancelButtonText: "Hayır",
        preConfirm: (onay) => {
          that.regiForm.controls["DisSeviyesi"].setValue(0);
          if (onay) {
            that.disSeviyesiKilitle = false;
          }
        }
      }).then(function (result) {
        console.log(result)
        if (result.value) {
          that.disSeviyesiKilitle = false;
        } else if (result.dismiss == 'cancel') {
          that.regiForm.controls["DisSeviyesi"].setValue(0);
        }
      });
    }, 100);

  }

}
