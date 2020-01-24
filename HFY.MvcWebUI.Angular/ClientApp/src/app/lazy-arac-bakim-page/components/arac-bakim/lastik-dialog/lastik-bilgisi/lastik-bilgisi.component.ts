import { Component, AfterViewInit, Input, ViewEncapsulation } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { LastiklerService } from 'src/app/lazy-general-page/services/backend-services/lastikler/lastikler.service';
import { Lastikler } from 'src/app/lazy-general-page/classes/lastikler/lastikler';
import { LastikOlcumlerService } from 'src/app/lazy-general-page/services/backend-services/lastik-olcumler/lastik-olcumler.service';
import { DatePipe } from '@angular/common';
import { LastikMarkalarService } from 'src/app/lazy-general-page/services/backend-services/lastik-markalar/lastik-markalar.service';
import { LastikMarkaDesenlerService } from 'src/app/lazy-general-page/services/backend-services/lastik-marka-desenler/lastik-marka-desenler.service';
import { EbatlarService } from 'src/app/lazy-general-page/services/backend-services/ebatlar/ebatlar.service';
import { AracBakimHareketlerService } from 'src/app/lazy-general-page/services/backend-services/arac-bakim-hareketler/arac-bakim-hareketler.service';
import { Select2OptionData } from 'ng-select2';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LastikEkle } from 'src/app/lazy-general-page/classes/lastikler/models/lastik-ekle';
import { LastikGuncelle } from 'src/app/lazy-general-page/classes/lastikler/models/lastik-guncelle';
import { ToastrService } from 'src/app/lazy-general-page/services/extra-services/toastr.service';
import { LastikHareketlerService } from 'src/app/lazy-general-page/services/backend-services/lastik-hareketler/lastik-hareketler.service';
import { LastikMarkaDesenOzelliklerService } from 'src/app/lazy-general-page/services/backend-services/lastik-marka-desen-ozellikler/lastik-marka-desen-ozellikler.service';

declare var Swal:any;

@Component({
  selector: 'app-lastik-bilgisi',
  templateUrl: './lastik-bilgisi.component.html',
  styleUrls: ['./lastik-bilgisi.component.css'],
})
export class LastikBilgisiComponent implements AfterViewInit {

  @Input() lastikId: number;
  @Input() aracId: number;

  lastikBilgi: Lastikler = new Lastikler();

  myDate = new Date();
  seriNo:string;
  sonServisTarihi: string;
  lastikMarka: string;
  lastikMarkaDesen: string;
  ebat: string;
  aracaTakilmaTarihi: string;
  ngSelect2Width: string = "180";
  olcumVarKilitle:boolean = false;
  disSeviyesiKilitle:boolean = true;
  disSeviyesiInputWidth:string = String(Number(this.ngSelect2Width)-13)+"px";

  constructor(public ngxSmartModalService: NgxSmartModalService, private fb: FormBuilder, private lastiklerService: LastiklerService, private aracBakimHareketlerService: AracBakimHareketlerService,
    private lastikOlcumService: LastikOlcumlerService, private lastikHareketlerService: LastikHareketlerService, private lastikMarkaDesenOzelliklerService:LastikMarkaDesenOzelliklerService, private lastikMarkalarService: LastikMarkalarService, private lastikMarkaDesenlerService: LastikMarkaDesenlerService,
    private ebatlarService: EbatlarService, private toastr: ToastrService,
    private datePipe: DatePipe) {
    let file = document.createElement('link');
    file.rel = 'stylesheet';
    file.href = 'assets/template/assets/css/select2/select2.min.css'
    document.head.appendChild(file);
    //
    this.regiForm = fb.group({
      'LastikID': [null],
      'LastikMarkaID': [false, Validators.compose([Validators.required])],
      'LastikMarkaDesenID': [false, Validators.compose([Validators.required])],
      'EbatID': [false, Validators.compose([Validators.required])],
      'DisSeviyesi': [null, Validators.compose([Validators.required, Validators.maxLength(4)])]
    });

    if (window.innerWidth <= 800) {
      this.ngSelect2Width = "115";
      this.disSeviyesiInputWidth = String(Number(this.ngSelect2Width) - 13) + "px";
    }
  }

  regiForm: FormGroup;
  lastikMarkalar: Array<Select2OptionData> = [];
  lastikMarkaDesenler: Array<Select2OptionData> = [];
  ebatlar: Array<Select2OptionData> = [];

  ngAfterViewInit() {
    this.lastiklerService.getLastik(this.lastikId).subscribe(lastikResponse => {

      this.lastikBilgi = lastikResponse;
      this.seriNo = this.lastikBilgi.SeriNo.toLocaleUpperCase();

      this.regiForm = this.fb.group({
        'LastikID': [this.lastikId],
        'LastikMarkaID': [this.lastikBilgi.LastikMarkaID, Validators.compose([Validators.required])],
        'LastikMarkaDesenID': [this.lastikBilgi.LastikMarkaDesenID, Validators.compose([Validators.required])],
        'EbatID': [this.lastikBilgi.EbatID, Validators.compose([Validators.required])],
        'DisSeviyesi': [this.lastikBilgi.DisSeviyesi, Validators.compose([Validators.required, Validators.maxLength(4)])]
      });

      // this.lastikMarkalarService.getLastikMarka(lastikResponse.LastikMarkaID).subscribe(a => { this.lastikMarka = a["Error"] !== undefined ? "-" : a.Ad });

      // this.lastikMarkaDesenlerService.getLastikMarkaDesen(lastikResponse.LastikMarkaDesenID).subscribe(a => { this.lastikMarkaDesen = a["Error"] !== undefined ? "-" : a.Ad });

      // this.ebatlarService.getEbat(lastikResponse.EbatID).subscribe(a => { this.ebat = a["Error"] !== undefined ? "-" : a.Ad });

      this.lastikMarkalarService.getLastikMarkalar().subscribe(response => {
        this.lastikMarkalar = [];
        response.filter(a => a.ListeAktiflik == true).forEach(item => {
          this.lastikMarkalar.push({
            id: String(item.LastikMarkaID),
            text: item.Ad
          });
        })
      });

      this.lastikMarkaDesenlerService.getLastikMarkaDesenler().subscribe(response => {
        this.lastikMarkaDesenler = [];
        response.filter(a => a.ListeAktiflik == true && a.LastikMarkaID === this.lastikBilgi.LastikMarkaID).forEach(item => {
          this.lastikMarkaDesenler.push({
            id: String(item.LastikMarkaDesenID),
            text: item.Ad
          });
        })
      });

      this.ebatlarService.getEbatlar().subscribe(response => {
        this.ebatlar = [];
        response.filter(a => a.ListeAktiflik == true).forEach(item => {
          this.ebatlar.push({
            id: String(item.EbatID),
            text: item.Ad
          });
        })
      });

      this.aracBakimHareketlerService.getAracBakimHareketlerAracaTakilisTarihi(this.lastikId, this.aracId).subscribe(aracBakimHareketResponse => this.aracaTakilmaTarihi = aracBakimHareketResponse.AracaTakilisTarihi);
    });

    // this.lastikOlcumService.getLastikOlcumler(this.lastikId).subscribe(lastikOlcumResponse => {

    //   let sonOlcumler = lastikOlcumResponse;
    //   if (sonOlcumler.length > 0) {
    //     this.sonServisTarihi = this.datePipe.transform(String(sonOlcumler[sonOlcumler.length - 1].Tarih), 'yyyy-MM-dd');
    //   }
    // });

    // 24.09.2019 tarihinden itibaren ölçüm bilgisi son servis tarihi olarak işlenmeyecek. Son servis tarihi, aslında lastiğin son hareketidir.

    this.lastikHareketlerService.getLastikHareketler(this.lastikId).toPromise().then(lastikHareketResponse1=>{
      var olcumBulucu = lastikHareketResponse1.find(a=> a.YapilanIslem === "Ölçüm" || a.YapilanIslem === "Ölçüm + Gözlem");
      if(olcumBulucu !== undefined) this.olcumVarKilitle = true;
    });

    this.lastikHareketlerService.getLastikHareketlerWithArac(this.lastikId, this.aracId).toPromise().then(lastikHareketResponse => {
      let filter = lastikHareketResponse[lastikHareketResponse.length - 1];
      try {
        this.sonServisTarihi = this.datePipe.transform(String(filter.Tarih), 'yyyy-MM-dd');
      }
      catch{
        alert("Aracın Montaj yapılırken kayıt edilen, ilk kilometre bilgisine ulaşılamadı. Teknik desteğe haber veriniz.");
        this.ngxSmartModalService.getModal('lastikBilgisi').close();
      }
    });

    setTimeout(() => {
      this.ngxSmartModalService.getModal('lastikBilgisi').open();
    });
  }

  getDesen(event: any) {
    this.lastikMarkaDesenlerService.getLastikMarkaDesenler().subscribe(response => {
      this.lastikMarkaDesenler = [];
      this.regiForm.controls["LastikMarkaDesenID"].setValue(null);
      let responseFilter = response.filter(a => a.ListeAktiflik == true && a.LastikMarkaID == Number(event.value));
      responseFilter.forEach(item => {
        this.lastikMarkaDesenler.push({
          id: String(item.LastikMarkaDesenID),
          text: item.Ad
        });
      })
    });
  }

  toLocaleUpperCaseText(text:string){
    return text.toLocaleUpperCase();
  }

  onFormSubmit(form: LastikGuncelle) {
    this.lastiklerService.getLastik(form.LastikID).subscribe(lastikResponse => {
      lastikResponse.LastikMarkaID = form.LastikMarkaID;
      lastikResponse.LastikMarkaDesenID = form.LastikMarkaDesenID;
      lastikResponse.EbatID = form.EbatID;
      lastikResponse.DisSeviyesi = form.DisSeviyesi;
      //
      this.lastiklerService.lastikGuncelle(lastikResponse).subscribe(response => {
        if (response.MessageType === 1) {
          this.toastr.success(response.Message);
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
