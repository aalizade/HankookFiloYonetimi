import { Component, AfterViewInit, Input, Output, EventEmitter, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthorizationService } from 'src/app/lazy-general-page/services/authorization/authorization.service';
import { FirmalarService } from 'src/app/lazy-general-page/services/backend-services/firmalar/firmalar.service';
import { ToastrService } from 'src/app/lazy-general-page/services/extra-services/toastr.service';
import { LastikOlcumEkle } from 'src/app/lazy-general-page/classes/lastik-olcumler/models/lastik-olcum-ekle';
import { LastiklerService } from 'src/app/lazy-general-page/services/backend-services/lastikler/lastikler.service';
import { Lastikler } from 'src/app/lazy-general-page/classes/lastikler/lastikler';
import { DatePipe } from '@angular/common';
import { LastikOlcumlerService } from 'src/app/lazy-general-page/services/backend-services/lastik-olcumler/lastik-olcumler.service';
import { AraclarService } from 'src/app/lazy-general-page/services/backend-services/araclar/araclar.service';
import { GozlemleComponent } from '../gozlemle/gozlemle.component';
import { LastikHareketlerService } from 'src/app/lazy-general-page/services/backend-services/lastik-hareketler/lastik-hareketler.service';
import { AracBakimlarService } from 'src/app/lazy-general-page/services/backend-services/arac-bakimlar/arac-bakimlar.service';
import { AsyncForeachService } from 'src/app/lazy-general-page/helpers/async-foreach/async-foreach.service';
import { ExtraAracBilgiService } from 'src/app/lazy-general-page/services/extra-services/extras/arac-bilgi/extra-arac-bilgi.service';

@Component({
  selector: 'app-olcumle',
  templateUrl: './olcumle.component.html',
  styleUrls: ['./olcumle.component.css']
})
export class OlcumleComponent implements AfterViewInit {

  @Input() aracId: number;
  @Input() lastikId: number;
  @Input() aksNumarasi: number;
  @Input() lastikPozisyonId: number;
  @Input() aracKilometre: number;
  @Output() gozlemleMenusuAcildi: EventEmitter<boolean> = new EventEmitter<boolean>();


  @ViewChild('GozlemleContainer_Olcumle', { read: ViewContainerRef, static: false }) gozlemleContainer: ViewContainerRef;

  regiForm: FormGroup;
  olcumleFirstScreenForm: FormGroup;

  psiBar: string = "DEĞER GELECEK";
  disDerinligiSayisi: number;
  disDerinligiSayiArray: number[] = [];

  lastikBilgi: Lastikler
  myDate = new Date();
  olcumIslemleriAcik: boolean = false;
  sonServisTarihi: Date | string;
  sonAracKilometre: number;
  gozlemYapActive: boolean = false;
  lastikOlcumId: number = 0;
  basincDisable: boolean = false;
  sonDisDerinligiOrtalamasi: number = 0;
  orjinalDisDerinligi: number = 0;
  sonHareketDepodanAraca: boolean = false;
  guncelAracKM:number = 0;

  constructor(public ngxSmartModalService: NgxSmartModalService, private fb: FormBuilder, private authorize: AuthorizationService,
    private firmalarService: FirmalarService, private lastiklerService: LastiklerService, private lastikHareketlerService: LastikHareketlerService, private toastr: ToastrService, private datePipe: DatePipe,
    private lastikOlcumService: LastikOlcumlerService, private araclarService: AraclarService, private aracBakimlarService: AracBakimlarService, private extraAracBilgiService:ExtraAracBilgiService,
    private asyncForeachService: AsyncForeachService, private componentFactoryResolver: ComponentFactoryResolver) {


    // this.authorize.GetUserTokenInfo().subscribe(response => {
    // })

    // initialize FormGroup  
    this.olcumleFirstScreenForm = fb.group({
      'ServisTarihi': [this.datePipe.transform(this.myDate, 'yyyy-MM-dd'), Validators.compose([Validators.required])],
      'AracKilometre': [{ value: this.aracKilometre, disabled: false }, Validators.compose([Validators.required, Validators.maxLength(7)])],
    });


    this.regiForm = fb.group({
      'LastikKilometre': [{ value: null, disabled: true }, Validators.compose([Validators.required, Validators.maxLength(7)])],
      'Basinc': [{ value: null, disabled: false }, Validators.compose([Validators.min(0), Validators.max(180)])],
      'TavsiyeBasinc': [{ value: 0, disabled: true }],
      'BasincAlinamadi': [false, Validators.compose([Validators.required])],
      'OlcumAlinamadi': [false, Validators.compose([Validators.required])]
    });


  }

  ngAfterViewInit() {
    setTimeout(async () => {
      this.olcumleFirstScreenForm.get("AracKilometre").setValue(this.aracKilometre);

      this.ngxSmartModalService.getModal('olcumleFirstScreen').open();

      this.guncelAracKM = await this.extraAracBilgiService.getAracSonKM(this.aracId);

      this.lastiklerService.getLastik(this.lastikId).subscribe(lastikResponse => {
        this.orjinalDisDerinligi = lastikResponse.DisSeviyesi;

        // lastik hangi firmanın ise ona göre diş derinliği bilgisi çekilmektedir.
        let firmaId = Number(lastikResponse.FirmaID);
        this.firmalarService.getFirma(firmaId).subscribe(firmaResponse => {
          this.psiBar = firmaResponse.PsiBar;
          this.disDerinligiSayisi = firmaResponse.DisDerinligiSayisi;
          console.log(this.disDerinligiSayisi)
          for (let index = 1; index <= this.disDerinligiSayisi; index++) {
            this.disDerinligiSayiArray.push(index);
          }
        });

      });

      this.lastikOlcumService.getLastikOlcumler(this.lastikId).subscribe(async lastikOlcumResponse => {
        let filter = lastikOlcumResponse.find(a => this.datePipe.transform(a.Tarih, 'yyyy-MM-dd') === this.datePipe.transform(this.myDate, 'yyyy-MM-dd'));
        if (filter !== undefined) {
          this.toastr.error("Belirttiğiniz tarihte daha önceden lastik ölçümü/gözlemi girilmiştir.");
          setTimeout(() => {
            this.ngxSmartModalService.getModal('olcumleFirstScreen').close();
          }, 250);
        }
        else {
          this.olcumIslemleriAcik = true;

          // Son ölçüm, son işlem tarihi olarak değiştirildi. Dolayısıyla rotasyon yapılsa bile artık bu bir son işlemdir.

          // let sonOlcumler = lastikOlcumResponse.filter(a => this.datePipe.transform(a.Tarih, 'yyyy-MM-dd') !== this.datePipe.transform(this.myDate, 'yyyy-MM-dd'));
          // if (sonOlcumler.length > 0) {
          //   this.sonServisTarihi = this.datePipe.transform(String(sonOlcumler[sonOlcumler.length - 1].Tarih), 'yyyy-MM-dd');
          //   this.sonAracKilometre = sonOlcumler[sonOlcumler.length - 1].AracKilometre;
          // }
          // else {
          await this.lastikHareketlerService.getLastikHareketlerWithArac(this.lastikId, this.aracId).toPromise().then(lastikHareketResponse => {
            let filter = lastikHareketResponse[lastikHareketResponse.length - 1];
            try {
              this.sonServisTarihi = this.datePipe.transform(String(filter.Tarih), 'yyyy-MM-dd');
              this.sonAracKilometre = filter.AracKilometre;
              if (filter.Hareket === "Depo" && filter.HareketYonu === "Araç") {
                this.sonHareketDepodanAraca = true;
              }
            }
            catch{
              alert("Aracın Montaj yapılırken kayıt edilen, ilk kilometre bilgisine ulaşılamadı. Teknik desteğe haber veriniz.");
              this.ngxSmartModalService.getModal('olcumleFirstScreen').close();
            }
          });
          // }
        }
      });
    });
  }

  async olcumleOpen(form: { ServisTarihi: string, AracKilometre: number }) {

    if (form.AracKilometre === undefined) form.AracKilometre = this.aracKilometre;

    if (this.sonServisTarihi === form.ServisTarihi) {
      // eğer lastiğin son hareket kaydı, Depo'dan Araca şeklinde ise, aynı gün hem depoya lastik kaydı, hem araca montaj hem de ölçüm alabiliyoruz.
      if (!this.sonHareketDepodanAraca) {
        this.toastr.error("Servis tarihi, önceki servis tarihiyle aynı olamaz.");
        return false;
      }
    }
    if ((new Date(form.ServisTarihi) < new Date(this.sonServisTarihi)) || (new Date() < new Date(form.ServisTarihi))) {
      this.toastr.error("Servis tarihi, önceki servis tarihinden küçük olamaz. Günümüz tarihinden'de büyük olamaz.");
      return false;
    }
    else if (this.sonAracKilometre > Number(form.AracKilometre)) {
      this.toastr.error("Araç Kilometresi, son araç kilometresinden büyük ya da eşit olmalıdır.");
      return false;
    }
    else {
      console.log(1)
      let sorunYok = true;
      let sorunAra1 = await this.aracBakimlarService.aracaBagliAktifLastikler(this.aracId).toPromise().then(async aracaBagliLastiklerResponse => {
        let sorunAra2 = await this.asyncForeachService.asyncForEach(aracaBagliLastiklerResponse, async (item) => {
          let sorunAra3 = await this.lastikHareketlerService.getLastikHareketlerWithArac(item.LastikID, this.aracId).toPromise().then(async lastikHareketResponse => {
            let filter = await lastikHareketResponse[lastikHareketResponse.length - 1];

            let filterOlcumVarMi = await lastikHareketResponse.find(a=> a.YapilanIslem === "Ölçüm" || a.YapilanIslem === "Ölçüm + Gözlem");

            let trueFalse = true;
            if (this.lastikId === item.LastikID) {
              // eğer mevcut (tıklanmış lastiğin son hareketine bakıyorsak, son diş derinliğini de çekebiliriz.)
              try {
                if(filterOlcumVarMi === undefined){
                  // eğer lastik üzerinde ölçüm yada ölçüm + gözlem yoksa, diş derinliğinin sonradan değiştirilme ihtimaline karşın lastik kaydındaki diş seviyesi değerini alıyoruz.
                  await this.lastiklerService.getLastik(this.lastikId).toPromise().then(lastikResponse => {
                    this.sonDisDerinligiOrtalamasi = lastikResponse.DisSeviyesi;
                  })
                }
                else{
                  this.sonDisDerinligiOrtalamasi = this.getOrtalamaDisDerinligi(filter.DisDerinligiJSON);
                  if (this.sonDisDerinligiOrtalamasi === 0) {
                    await this.lastiklerService.getLastik(this.lastikId).toPromise().then(lastikResponse => {
                      this.sonDisDerinligiOrtalamasi = lastikResponse.DisSeviyesi;
                    })
                  }
                }
              }
              catch{
                this.toastr.error("Son Diş Derinliği bulunamadı. Lütfen teknik destek ile iletişime geçiniz.");
                trueFalse = false;
              }
            }
            else {
              try {
                let sonServisTarihi = this.datePipe.transform(String(filter.Tarih), 'yyyy-MM-dd');
                let sonAracKilometre = filter.AracKilometre;

                if (sonAracKilometre > Number(form.AracKilometre)) {
                  this.toastr.error("Araç Kilometresi, son araç kilometresinden büyük ya da eşit olmalıdır.");
                  trueFalse = false;
                }
                else if ((new Date(form.ServisTarihi) < new Date(sonServisTarihi))) {
                  this.toastr.error("Servis tarihi, önceki servis tarihinden küçük olamaz. Günümüz tarihinden'de büyük olamaz.");
                  trueFalse = false;
                }
              }
              catch{
                alert("Aracın Montaj yapılırken kayıt edilen, ilk kilometre bilgisine ulaşılamadı. Teknik desteğe haber veriniz.");
                this.ngxSmartModalService.getModal('olcumleFirstScreen').close();
                trueFalse = false;
              }
              // değer yalnız false ise güncelle.
              sorunYok = trueFalse == false ? false : sorunYok;
              return trueFalse;
            }


          });
        });
        console.log(2)
      });

      if (!sorunYok) return false;
      console.log(3)

      this.aracKilometre = form.AracKilometre;
      // problem yok, buradan sonra işleme devam edilebilir.
    }

    setTimeout(() => {
      console.log(this.aracId, this.lastikId);

      this.lastiklerService.getLastik(this.lastikId).subscribe(lastikResponse => {
        this.lastikBilgi = lastikResponse;
        this.araclarService.getArac(this.aracId).subscribe(aracResponse => {
          this.regiForm = this.fb.group({
            'LastikID': [this.lastikId],
            'AracID': [this.aracId],
            'Tarih': [form.ServisTarihi, Validators.compose([Validators.required])],
            'AracKilometre': [Number(form.AracKilometre), Validators.compose([Validators.required, Validators.maxLength(7)])],
            'LastikKilometre': [{ value: this.lastikBilgi.LastikKilometre, disabled: true }, Validators.compose([Validators.required, Validators.maxLength(7)])],
            'GuvenliDisSeviyesi': [0, Validators.compose([Validators.required, Validators.maxLength(5)])],
            'LastikKonumID': [this.lastikBilgi.LastikKonumID, Validators.compose([Validators.required])],
            'Basinc': [{ value: null, disabled: false }, Validators.compose([Validators.min(0), Validators.max(180)])], // input=text
            'TavsiyeBasinc': [{ value: aracResponse["Aks" + this.aksNumarasi], disabled: true }], // select,
            'Plaka': [aracResponse.Plaka],
            'LastikPozisyonID': [this.lastikPozisyonId],
            'BasincAlinamadi': [false, Validators.compose([Validators.required])], // select
            'OlcumAlinamadi': [false, Validators.compose([Validators.required])]
          })
          console.log(this.lastikPozisyonId)

          // Kullanıcı "Ölçüm Alınamadı" seçeneğini "Evet" e getirirse, Diş Derinliğini giriş seçeneklerine veri girişi yapamaz. Kullanıcı önce diş derinliklerini doldurur sonra Ölçüm Alınamadı seçeneğini işaretlerse yazılımın otomatik olarak girilmiş verileri sıfırlar ve yeni veri girişini engeller. 
          this.regiForm.controls.OlcumAlinamadi.valueChanges.subscribe(values => {
            this.gozlemYapActive = values;
            if (values) {
              this.disDerinligiSayiArray.forEach((item, index) => {
                let indexValue = $("#disDerinligi_" + (index + 1)).val();
                if (indexValue !== "") {
                  $("#disDerinligi_" + (index + 1)).val("0");
                  $("#disDerinligi_" + (index + 1)).attr("disabled", "disabled");
                }
              });
              this.regiForm.controls.Basinc.setValue(null);
              this.basincDisable = true;
            }
            else {
              this.disDerinligiSayiArray.forEach((item, index) => {
                let indexValue = $("#disDerinligi_" + (index + 1)).val();
                if (indexValue !== "") {
                  $("#disDerinligi_" + (index + 1)).val("0");
                  $("#disDerinligi_" + (index + 1)).removeAttr("disabled");
                }
              });
              this.regiForm.controls.Basinc.setValue(null);
              this.basincDisable = false;
            }
          });

          // Kullanıcı "Basınç Alınamadı" seçeneğini "Evet" e getirirse, Basınç'a veri girişi yapamaz. Kullanıcı önce Basınç'a veri girişi yapıp sonra "Basınç Alınamadı" seçeneğini işaretlerse yazılımın otomatik olarak girilmiş veriyi sıfırlar ve yeni veri girişini engeller. 
          this.regiForm.controls.BasincAlinamadi.valueChanges.subscribe(values => {
            if (values) {
              this.regiForm.controls.Basinc.setValue(null)
              this.basincDisable = true;
            }
            else {
              this.regiForm.controls.Basinc.setValue(null);
              this.basincDisable = false;
            }
          })

          this.ngxSmartModalService.getModal('olcumleFirstScreen').close();
          this.ngxSmartModalService.getModal('olcumle').open();

        })

      });
    });
  }

  onFormSubmit(form: LastikOlcumEkle) {

    
    if (form.BasincAlinamadi && form.Basinc !== null) {
      this.toastr.error("Basınç değeri girilmiş ise, Basınç Alınamadı değeri 'Hayır' olmalıdır.");
      return;
    }
    else if (!form.BasincAlinamadi && form.Basinc === null) {
      this.toastr.error("Basınç değeri girilmemiş ise, Basınç Alınamadı değeri 'Evet' olmalıdır.");
      return;
    }

    form.Basinc = form.Basinc === null ? 0 : form.Basinc;

    let disDerinligiVerileri = [];
    let disDerinligiOrtalamasi = 0;
    this.disDerinligiSayiArray.forEach((item, index) => {
      let indexValue = $("#disDerinligi_" + (index + 1)).val();
      if (indexValue !== "") {
        let fullName = "DisDerinligi" + (index + 1);
        if ((indexValue <= 0 || indexValue > 30)) {
          this.toastr.error("Diş Derinliği, minimum 1, maksimum 30 olabilir.");
          return false;
        }
        else {
          disDerinligiVerileri.push({ [fullName]: indexValue });
          disDerinligiOrtalamasi += Number(indexValue);
        }
      }
    })

    // if (disDerinligiVerileri.length !== this.disDerinligiSayisi) {
    //   this.toastr.error("Lütfen Tüm Diş Derinliklerini giriniz.");
    //   return;
    // }

    if (disDerinligiVerileri.length === 0) {
      this.toastr.error("Lütfen en az 1 Diş Derinliği giriniz.");
      return;
    }

    if (Number(Number(disDerinligiOrtalamasi / disDerinligiVerileri.length).toFixed(1)) > this.sonDisDerinligiOrtalamasi) {
      this.toastr.error("Girmiş olduğunuz diş derinliği ortalaması, bir önceki diş derinliği ortalamasını ya da lastik diş derinliği'ni aşmaktadır.");
      return;
    }

    form.DisDerinligiJSON = JSON.stringify(disDerinligiVerileri);
    form.AracKilometre = this.aracKilometre;
    form.LastikKilometre = this.lastikBilgi.LastikKilometre;
    form.TavsiyeBasinc = this.regiForm.controls["TavsiyeBasinc"].value;
    console.log(form)

    this.lastikOlcumService.lastikOlcumEkle(form).subscribe(response => {
      if (response.MessageType === 1) {
        this.toastr.success(response.Message);
        this.gozlemYapActive = true;
        this.lastikOlcumId = Number(response["LastikOlcumID"]);
        //this.ngxSmartModalService.getModal('olcumle').close();
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

  gozlemYap() {
    // Output'tan yakalayacak ve lastik-dialog modelini kapatacak.
    this.gozlemleMenusuAcildi.next(true);
    this.ngxSmartModalService.getModal('olcumle').close();
    this.gozlemleContainer.clear();
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(GozlemleComponent);
    const componentRef = this.gozlemleContainer.createComponent(componentFactory);
    componentRef.instance.lastikOlcumId = this.lastikOlcumId;
    componentRef.instance.aracId = this.aracId;
    componentRef.instance.lastikId = this.lastikId;
    componentRef.instance.lastikPozisyonId = this.lastikPozisyonId;
    componentRef.instance.aracKilometre = this.aracKilometre;
  }

  getOrtalamaDisDerinligi(disDerinligiJSON: string): number {
    try {
      let disDerinligiFakeJSON = JSON.parse(disDerinligiJSON);
      let topla = 0;
      Object.keys(disDerinligiFakeJSON).forEach(key => {
        let keys = Object.values(disDerinligiFakeJSON[key])
        let key_to_use = keys[0];
        topla += Number(key_to_use);
      });
      return Number(Number(topla / disDerinligiFakeJSON.length).toFixed(1));
    }
    catch{
      return 0;
    }
  }

  sonAracKilometreYeniyeAktar(){
    this.olcumleFirstScreenForm.controls["AracKilometre"].setValue(this.guncelAracKM);
  }


}
