import { Component, AfterViewInit, ComponentFactoryResolver, Input, Output, EventEmitter, ViewChild, ViewContainerRef } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AuthorizationService } from 'src/app/lazy-general-page/services/authorization/authorization.service';
import { FirmalarService } from 'src/app/lazy-general-page/services/backend-services/firmalar/firmalar.service';
import { LastiklerService } from 'src/app/lazy-general-page/services/backend-services/lastikler/lastikler.service';
import { LastikHareketlerService } from 'src/app/lazy-general-page/services/backend-services/lastik-hareketler/lastik-hareketler.service';
import { ToastrService } from 'src/app/lazy-general-page/services/extra-services/toastr.service';
import { LastikOlcumlerService } from 'src/app/lazy-general-page/services/backend-services/lastik-olcumler/lastik-olcumler.service';
import { AraclarService } from 'src/app/lazy-general-page/services/backend-services/araclar/araclar.service';
import { AracBakimlarService } from 'src/app/lazy-general-page/services/backend-services/arac-bakimlar/arac-bakimlar.service';
import { AsyncForeachService } from 'src/app/lazy-general-page/helpers/async-foreach/async-foreach.service';
import { AracBakimlar } from 'src/app/lazy-general-page/classes/arac-bakimlar/arac-bakimlar';
import { AKOlcumleComponent } from './a-k-olcumle/a-k-olcumle.component';
import { Subscription } from 'rxjs';
import { ExtraAracBilgiService } from 'src/app/lazy-general-page/services/extra-services/extras/arac-bilgi/extra-arac-bilgi.service';

@Component({
  selector: 'app-arac-kayit',
  templateUrl: './arac-kayit.component.html',
  styleUrls: ['./arac-kayit.component.css']
})
export class AracKayitComponent implements AfterViewInit {

  @Input() aracId: number;
  @Input() lastikId: number;
  @Input() aracBakimItemSuruklenenGet: AracBakimlar;
  @Input() aracBakimItemSuruklenenLastikPozisyonId: number;
  @Input() aracBakimItemSuruklenenAksNumarasi: number;
  @Output() aracBakimItemSuruklenenPost: EventEmitter<AracBakimlar> = new EventEmitter();

  @Output() kaydet: EventEmitter<boolean> = new EventEmitter();

  olcumleFirstScreenForm: FormGroup;
  myDate = new Date();
  sonServisTarihi: Date | string;
  sonAracKilometre: number;
  aracKilometre: number = 0;
  seriNo: string = "";
  pozisyonunuVerenBilgileriAliniyor: boolean = false;
  guncelAracKM:number = 0;

  @ViewChild('OlcumleContainer', { read: ViewContainerRef, static: false }) olcumleContainer: ViewContainerRef;

  constructor(public ngxSmartModalService: NgxSmartModalService, private fb: FormBuilder, private authorize: AuthorizationService,
    private firmalarService: FirmalarService, private lastiklerService: LastiklerService, private lastikHareketlerService: LastikHareketlerService, private toastr: ToastrService, private datePipe: DatePipe,
    private lastikOlcumService: LastikOlcumlerService, private araclarService: AraclarService, private aracBakimlarService: AracBakimlarService,private extraAracBilgiService:ExtraAracBilgiService,
    private asyncForeachService: AsyncForeachService, private componentFactoryResolver: ComponentFactoryResolver) {
    this.olcumleFirstScreenForm = fb.group({
      'ServisTarihi': [this.datePipe.transform(this.myDate, 'yyyy-MM-dd'), Validators.compose([Validators.required])],
      'AracKilometre': [{ value: 0, disabled: false }, Validators.compose([Validators.required, Validators.maxLength(7)])]
    });
  }

  ngAfterViewInit() {
    setTimeout(async () => {
      this.guncelAracKM = await this.extraAracBilgiService.getAracSonKM(this.aracId);
      
      if (this.aracBakimItemSuruklenenGet.GeldigiYer === "Depo > Araca Takıldı") {
        this.ngxSmartModalService.getModal('aracKayit').open();
        this.seriNo = this.aracBakimItemSuruklenenGet.SeriNo;

        await this.lastikHareketlerService.getLastikHareketlerWithArac(this.lastikId, this.aracId).toPromise().then(async lastikHareketResponse => {
          let filter = lastikHareketResponse[lastikHareketResponse.length - 1];
          if(filter===undefined){
            // eğer ki lastik araca ilk defa geliyorsa, ( ki bu component yalnızca depodan sürüklenen lastikle ilgili işlemlerin yapıldığı bir component'tir. ) lastiğin son hareketini son servis tarihi ve son araç km ( 0 ) olarak alıyoruz.
            await this.lastikHareketlerService.getLastikHareketler(this.lastikId).toPromise().then(lastikYalinHareketResponse=>{
              let yalinHareketFilter = lastikYalinHareketResponse[lastikYalinHareketResponse.length - 1];
              this.sonServisTarihi = this.datePipe.transform(String(yalinHareketFilter.Tarih), 'yyyy-MM-dd');
              this.sonAracKilometre = yalinHareketFilter.AracKilometre;
            })
          }
          else{
            try {
              this.sonServisTarihi = this.datePipe.transform(String(filter.Tarih), 'yyyy-MM-dd');
              this.sonAracKilometre = filter.AracKilometre;
            }
            catch{
              // alert("Aracın Montaj yapılırken kayıt edilen, ilk kilometre bilgisine ulaşılamadı. Teknik desteğe haber veriniz.");
              // this.ngxSmartModalService.getModal('aracKayit').close();
            }
          }
         
        });
        // }
      }
      else {
        console.log(this.aracBakimItemSuruklenenLastikPozisyonId)
        this.olcumleOpen(this.aracBakimItemSuruklenenGet);
      }

    });
  }

  async save(form: { ServisTarihi: string, AracKilometre: number }) {

    if (this.aracBakimItemSuruklenenGet.GeldigiYer === "Depo > Araca Takıldı") {

      // if (this.sonServisTarihi === form.ServisTarihi) {
      //   this.toastr.error("Servis tarihi, önceki servis tarihiyle aynı olamaz.");
      //   return false;
      // }
      // else 
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
          let sorunAra2 = await this.asyncForeachService.asyncForEach(aracaBagliLastiklerResponse.filter(a => a.LastikID !== this.lastikId), async (item) => {
            let sorunAra3 = await this.lastikHareketlerService.getLastikHareketlerWithArac(item.LastikID, this.aracId).toPromise().then(async lastikHareketResponse => {
              let filter = await lastikHareketResponse[lastikHareketResponse.length - 1];
              let trueFalse = true;
              
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
                // alert("Aracın Montaj yapılırken kayıt edilen, ilk kilometre bilgisine ulaşılamadı. Teknik desteğe haber veriniz.");
                // this.ngxSmartModalService.getModal('aracKayit').close();
                // trueFalse = false;
              }
              // değer yalnız false ise güncelle.
              sorunYok = trueFalse == false ? false : sorunYok;
              return trueFalse;

            });
          });
          console.log(2)
        });

        if (!sorunYok) return false;
        console.log(3)

        this.aracKilometre = form.AracKilometre;

        this.aracBakimItemSuruklenenGet.ServisTarihi = form.ServisTarihi;
        this.aracBakimItemSuruklenenGet.AracKilometre = this.aracKilometre;
        this.aracBakimItemSuruklenenGet.AksPozisyonID = this.aracBakimItemSuruklenenLastikPozisyonId;

        this.aracBakimItemSuruklenenPost.next(this.aracBakimItemSuruklenenGet);
        this.ngxSmartModalService.getModal('aracKayit').close();

        // problem yok, buradan sonra işleme devam edilebilir.

      }
    }

    else {
      this.olcumleOpen(this.aracBakimItemSuruklenenGet);
    }

  }

  olcumleOpen(item: AracBakimlar) {
    this.olcumleContainer.clear();
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(AKOlcumleComponent);
    const componentRef = this.olcumleContainer.createComponent(componentFactory);
    componentRef.instance.aracId = this.aracId;
    componentRef.instance.lastikId = this.lastikId;
    componentRef.instance.aksNumarasi = this.aracBakimItemSuruklenenAksNumarasi;
    componentRef.instance.lastikPozisyonId = this.aracBakimItemSuruklenenLastikPozisyonId;

    componentRef.instance.aracBakimItemSuruklenenGet = this.aracBakimItemSuruklenenGet;
    componentRef.instance.aracBakimItemSuruklenenLastikPozisyonId = this.aracBakimItemSuruklenenLastikPozisyonId;
    componentRef.instance.aracBakimItemSuruklenenAksNumarasi = this.aracBakimItemSuruklenenAksNumarasi;

    // componentRef.instance.aracBakimItemPozisyonunuVerenGet = this.aracBakimItemPozisyonunuVerenGet;
    // componentRef.instance.aracBakimItemPozisyonunuVerenLastikPozisyonId = this.aracBakimItemPozisyonunuVerenLastikPozisyonId;
    // componentRef.instance.aracBakimItemPozisyonunuVerenAksNumarasi = this.aracBakimItemPozisyonunuVerenAksNumarasi;
    // componentRef.instance.aracKilometre = this.aracKilometre;

    const sub: Subscription = componentRef.instance.aracBakimItemSuruklenenPost.subscribe(returnValue => {
      console.log(returnValue)
      this.aracBakimItemSuruklenenGet = returnValue;
      this.aracBakimItemSuruklenenPost.next(this.aracBakimItemSuruklenenGet);
    });

    const sub2: Subscription = componentRef.instance.kaydet.subscribe(returnValue => {
      this.kaydet.next(returnValue);
    });

    componentRef.onDestroy(() => { sub.unsubscribe(); sub2.unsubscribe(); console.log("Unsubscribing") });
  }

  sonAracKilometreYeniyeAktar(){
    this.olcumleFirstScreenForm.controls["AracKilometre"].setValue(this.guncelAracKM);
  }


}
