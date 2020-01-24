import { Component, OnInit, ComponentFactoryResolver, ViewChild, ViewContainerRef, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AraclarService } from 'src/app/lazy-general-page/services/backend-services/araclar/araclar.service';
import { AracModellerService } from 'src/app/lazy-general-page/services/backend-services/arac-modeller/arac-modeller.service';
import { AracKategorilerService } from 'src/app/lazy-general-page/services/backend-services/arac-kategoriler/arac-kategoriler.service';
import { CdkDragDrop, transferArrayItem, CdkDragStart } from '@angular/cdk/drag-drop';
import { AracBakimlarService } from 'src/app/lazy-general-page/services/backend-services/arac-bakimlar/arac-bakimlar.service';
import { AksPozisyonlarService } from 'src/app/lazy-general-page/services/backend-services/aks-pozisyonlar/aks-pozisyonlar.service';
import { AracBakimlar } from 'src/app/lazy-general-page/classes/arac-bakimlar/arac-bakimlar';
import { ToastrService } from 'src/app/lazy-general-page/services/extra-services/toastr.service';
import { LastikTiplerService } from 'src/app/lazy-general-page/services/backend-services/lastik-tipler/lastik-tipler.service';
import { LastikTipler } from 'src/app/lazy-general-page/classes/lastik-tipler/lastik-tipler';
import { LastiklerService } from 'src/app/lazy-general-page/services/backend-services/lastikler/lastikler.service';
import { Lastikler } from 'src/app/lazy-general-page/classes/lastikler/lastikler';
import { LastikDialogComponent } from '../lastik-dialog/lastik-dialog.component';
import { AracKayitComponent } from '../lastik-dialog/arac-kayit/arac-kayit.component';
import { Subscription } from 'rxjs';
import { AracBilgiComponent } from '../arac-dialog/arac-bilgi/arac-bilgi.component';
import { Location } from '@angular/common';

declare var Swal: any;

@Component({
  selector: 'app-kategori4x2',
  templateUrl: './kategori4x2.component.html',
  styleUrls: ['./kategori4x2.component.css']
})
export class Kategori4x2Component implements OnInit {

  pageName: string = "4X2";
  depo_hide: boolean = true;

  depoList: AracBakimlar[] = [];
  hurdalikList: AracBakimlar[] = [];
  aks11OSL: AracBakimlar[] = []; aks11OSLName: string = "11-Ö-SL"; aks11OSLId: number;
  aks12OSG: AracBakimlar[] = []; aks12OSGName: string = "12-Ö-SG"; aks12OSGId: number;
  aks25ASLDC: AracBakimlar[] = []; aks25ASLDCName: string = "25-A-SLDC"; aks25ASLDCId: number;
  aks23ASGDC: AracBakimlar[] = []; aks23ASGDCName: string = "23-A-SGDC"; aks23ASGDCId: number;
  aks26ASLIC: AracBakimlar[] = []; aks26ASLICName: string = "26-A-SLİC"; aks26ASLICId: number;
  aks24ASGIC: AracBakimlar[] = []; aks24ASGICName: string = "24-A-SGİC"; aks24ASGICId: number;

  firmaId: number;
  aracId: number;
  lastikler: Lastikler[];
  lastikTipler: LastikTipler[];
  touchTime = 0;
  degisiklikOlduMu = false;
  aracKilometre: number = 0;
  aracVeritabaniKilometre: number = 0;

  @ViewChild('LastikDialogContainer', { read: ViewContainerRef, static: false }) container: ViewContainerRef;
  @ViewChild('AracKayitContainer', { read: ViewContainerRef, static: false }) aracKayitContainer: ViewContainerRef;
  @ViewChild('AracBilgiContainer', { read: ViewContainerRef, static: false }) aracBilgiContainer: ViewContainerRef;
  @ViewChild('BosLastikEkleContainer', { read: ViewContainerRef, static: false }) bosLastikEkleContainer: ViewContainerRef;

  constructor(private route: ActivatedRoute, private aracBakimlarService: AracBakimlarService, private aksPozisyonlarService: AksPozisyonlarService,
    private araclarService: AraclarService, private aracModellerService: AracModellerService, private aracKategorilerService: AracKategorilerService,
    private lastiklerService: LastiklerService, private lastikTiplerService: LastikTiplerService,
    private toastr: ToastrService, private location: Location, private componentFactoryResolver: ComponentFactoryResolver) {

    this.ilkKontrol();
    // Son analiz ile birlikte araç kilometresi ihtiyaca uygun şekilde alınacak. Sayfa ilk açıldığında popup açmaya gerek yoktur.
    // this.openDialogAracKilometre();

    // araç sayfasından seri no girmek yerine yeni lastik eklemek isteyen kullanıcı, bazı bilgileri bize gönderir.
    const urlParams = new URLSearchParams(window.location.search);
    let seriNo = String(urlParams.get('seriNo'));
    let aksPozisyonListName = String(urlParams.get('aksPozisyonListName'));
    let aksPozisyonId = Number(urlParams.get('aksPozisyonId'));
    let aksNumarasi = Number(urlParams.get('aksNumarasi'));

    if (seriNo !== undefined && seriNo !== "null") {
      this.openDialogSerialNumberBosLastik(aksPozisyonListName, aksPozisyonId, aksNumarasi, seriNo);
      this.location.replaceState(window.location.pathname);
    }

  }

  ilkKontrol() {
    this.depoList = [];
    this.hurdalikList = [];
    this.aks11OSL = [];
    this.aks12OSG = [];
    this.aks25ASLDC = [];
    this.aks23ASGDC = [];
    this.aks26ASLIC = [];
    this.aks24ASGIC = [];

    for (let index = 0; index < 20; index++) {
      let aracBakimDepoClass = new AracBakimlar();
      aracBakimDepoClass.GeldigiYer = "Depo";
      aracBakimDepoClass.DoluBos = false;
      this.depoList.push(aracBakimDepoClass)
    }

    let id = this.route.snapshot.params.aracId === undefined ? 0 : this.route.snapshot.params.aracId;
    if (isNaN(id)) {
      window.location.href = "/home";
    }
    else {
      this.araclarService.getArac(Number(id)).subscribe(response => {
        if (response["Error"] !== undefined) {
          window.location.href = "/home";
        }

        this.araclarService.aracErisimDogrulama(response.Plaka).toPromise().then(erisimDogrulaResponse => {
          if (erisimDogrulaResponse.MessageType === 1) {

            this.firmaId = response.FirmaID;
            this.aracId = id;

            this.aracModellerService.getAracModel(response.ModelID).subscribe(aracModelResponse => {
              this.aracKategorilerService.getAracKategori(aracModelResponse.AracKategoriID).subscribe(async aracKategoriResponse => {
                if (aracKategoriResponse.Ad !== this.pageName) {
                  alert("Bu sayfaya giriş yetkiniz bulunmamaktadır.")
                  window.location.href = "/home";
                }
                else {
                  // code.
                  await this.lastiklerService.getLastikler().toPromise().then(lastikResponse => this.lastikler = lastikResponse);

                  await this.lastikTiplerService.getLastikTipler().toPromise().then(lastikTipResponse => this.lastikTipler = lastikTipResponse);

                  this.aksPozisyonlarService.getAksPozisyonlar().toPromise().then(aksPozisyonResponse => {
                    aksPozisyonResponse = aksPozisyonResponse.filter(a => a.Aktif == true);
                    try {
                      this.aks11OSLId = aksPozisyonResponse.find(a => a.Ad === this.aks11OSLName).AksPozisyonID;
                      this.aks12OSGId = aksPozisyonResponse.find(a => a.Ad === this.aks12OSGName).AksPozisyonID;
                      this.aks25ASLDCId = aksPozisyonResponse.find(a => a.Ad === this.aks25ASLDCName).AksPozisyonID;
                      this.aks23ASGDCId = aksPozisyonResponse.find(a => a.Ad === this.aks23ASGDCName).AksPozisyonID;
                      this.aks26ASLICId = aksPozisyonResponse.find(a => a.Ad === this.aks26ASLICName).AksPozisyonID;
                      this.aks24ASGICId = aksPozisyonResponse.find(a => a.Ad === this.aks24ASGICName).AksPozisyonID;

                      this.aracBakimlarService.getAracBakimlarForAracId(response.AracID).subscribe(aracBakimResponse => {

                        aracBakimResponse.forEach(aracBakimItem => {
                          var lastikFinder = this.lastikler.find(a => a.LastikID === aracBakimItem.LastikID);
                          if (lastikFinder !== undefined) {
                            aracBakimItem.LastikTipID = lastikFinder === undefined ? 0 : lastikFinder.LastikTipID;
                            aracBakimItem.SeriNo = lastikFinder.SeriNo.toLocaleUpperCase();
                          }
                        });

                        if (aracBakimResponse.find(a => a.AksPozisyonID === this.aks11OSLId && a.Aktif === true) === undefined) this.aks11OSL.push();
                        else this.aks11OSL.push(aracBakimResponse.find(a => a.AksPozisyonID === this.aks11OSLId && a.Aktif === true));

                        if (aracBakimResponse.find(a => a.AksPozisyonID === this.aks12OSGId && a.Aktif === true) === undefined) this.aks12OSG.push();
                        else this.aks12OSG.push(aracBakimResponse.find(a => a.AksPozisyonID === this.aks12OSGId && a.Aktif === true));

                        if (aracBakimResponse.find(a => a.AksPozisyonID === this.aks25ASLDCId && a.Aktif === true) === undefined) this.aks25ASLDC.push();
                        else this.aks25ASLDC.push(aracBakimResponse.find(a => a.AksPozisyonID === this.aks25ASLDCId && a.Aktif === true));

                        if (aracBakimResponse.find(a => a.AksPozisyonID === this.aks23ASGDCId && a.Aktif === true) === undefined) this.aks23ASGDC.push();
                        else this.aks23ASGDC.push(aracBakimResponse.find(a => a.AksPozisyonID === this.aks23ASGDCId && a.Aktif === true));

                        if (aracBakimResponse.find(a => a.AksPozisyonID === this.aks26ASLICId && a.Aktif === true) === undefined) this.aks26ASLIC.push();
                        else this.aks26ASLIC.push(aracBakimResponse.find(a => a.AksPozisyonID === this.aks26ASLICId && a.Aktif === true));

                        if (aracBakimResponse.find(a => a.AksPozisyonID === this.aks24ASGICId && a.Aktif === true) === undefined) this.aks24ASGIC.push();
                        else this.aks24ASGIC.push(aracBakimResponse.find(a => a.AksPozisyonID === this.aks24ASGICId && a.Aktif === true));

                      });

                    }
                    catch (err) {
                      console.log(err)
                      alert("Lütfen teknik destek ile iletişime geçiniz.")
                      //window.location.href = "/home";
                    }
                  })

                  // code.
                }
              });
            })
          }
          else {
            alert("Bu sayfaya giriş yetkiniz bulunmamaktadır.")
            window.location.href = "/home";
          }
        }).catch(err => {
          alert("Bir hata oluştu, lütfen daha sonra tekrar deneyin.")
          window.location.href = "/home";
        });

      }, error => {
        alert("Bir hata oluştu, lütfen daha sonra tekrar deneyin.")
        window.location.href = "/home";
      });
    }
  }

  onDrop(event: CdkDragDrop<AracBakimlar[]>) {
    this.depo_hide = true;

    let tip = event.item.element.nativeElement.attributes["tip"].value;
    let containerId = event.container.id;

    if (tip === "depo") {
      if (event.container.data.length === 0) {
        this.openDialogSerialNumber(event);
      }
      else {
        this.toastr.error("Depodan yalnızca boş bir alana lastik sürükleyebilirsiniz.");
      }
    }
    else if (containerId === "cdk-drag-drop-depo") {
      this.openDialogDepoOnay(event);
    }
    else if (containerId === "cdk-drag-drop-hurdalik") {
      this.openDialogHurdalikOnay(event);
    }
    else {
      this.dropProcess(event);
    }
  }

  openDialogSerialNumber(event: CdkDragDrop<AracBakimlar[]>) {
    console.log(event)
    Swal.fire({
      title: 'Seri No Giriniz',
      input: 'text',
      inputValue: "",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Lastiği Ekle',
      inputAttributes: {
        maxlength: 25
      },
      cancelButtonText: "Kapat",
      inputValidator: (value) => {
        if (!value) {
          return 'Lütfen seri no giriniz.'
        }
      },
      preConfirm: (seriNo) => {
        return this.aracBakimlarService.seriNoErisimDogrula(seriNo, this.firmaId).toPromise().then(response => {
          if (response.MessageType === 1) {
            if (this.seriNoKullanildiMiKontrol(seriNo)) {
              response.Result.SeriNo = seriNo.toLocaleUpperCase();
              response.Result.GeldigiYer = "Depo > Araca Takıldı";
              response.Result.DoluBos = true;
              response.Result.LastikTipID = this.lastikler.find(a => a.LastikID === response.Result.LastikID) === undefined ? 0 : this.lastikler.find(a => a.LastikID === response.Result.LastikID).LastikTipID;
              response.Result.AracID = Number(this.aracId);
              let aracBakimList = [];
              aracBakimList.push(response.Result)
              event.previousContainer.data = aracBakimList;
              this.dropProcess(event);
            }
            else {
              Swal.showValidationMessage(
                `Bu Seri No daha önce kullanılmış.`
              );
            }

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
    $(".swal2-confirm").css("background", "none");
    $(".swal2-confirm").html("<img src='assets/aks-iskeletleri/lastik-dialog/img/tire_add.png'>");
    $(".swal2-cancel").css("background", "none");
    $(".swal2-cancel").html("<img src='assets/lazy-home-page/img/cancel.png'>");
  }

  // boş lastiğe çift tıklanıldığında çalışır. Event içermez!
  openDialogSerialNumberBosLastik(aksPozisyonListName: string, aksPozisyonId: number, aksNumarasi: number, inputValue: string = "") {
    setTimeout(() => {
      Swal.fire({
        title: 'Seri No Giriniz',
        input: 'text',
        inputValue: inputValue,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Lastiği Ekle',
        inputAttributes: {
          maxlength: 25
        },
        cancelButtonText: "Kapat",
        inputValidator: (value) => {
          if (!value) {
            return 'Lütfen seri no giriniz.'
          }
        },
        preConfirm: (seriNo) => {
          return this.aracBakimlarService.seriNoErisimDogrula(seriNo, this.firmaId).toPromise().then(response => {
            if (response.MessageType === 1) {
              if (this.seriNoKullanildiMiKontrol(seriNo)) {
                response.Result.SeriNo = seriNo.toLocaleUpperCase();
                response.Result.GeldigiYer = "Depo > Araca Takıldı";
                response.Result.DoluBos = true;
                response.Result.LastikTipID = this.lastikler.find(a => a.LastikID === response.Result.LastikID) === undefined ? 0 : this.lastikler.find(a => a.LastikID === response.Result.LastikID).LastikTipID;
                response.Result.AracID = Number(this.aracId);
                response.Result.AksPozisyonID = aksPozisyonId;
                //
                const componentFactory = this.componentFactoryResolver.resolveComponentFactory(AracKayitComponent);
                const componentRef = this.aracKayitContainer.createComponent(componentFactory);
                componentRef.instance.aracId = this.aracId;
                componentRef.instance.lastikId = response.Result.LastikID;
                componentRef.instance.aracBakimItemSuruklenenGet = response.Result;
                console.log(response.Result)
                componentRef.instance.aracBakimItemSuruklenenLastikPozisyonId = aksPozisyonId;
                componentRef.instance.aracBakimItemSuruklenenAksNumarasi = aksNumarasi;

                const sub: Subscription = componentRef.instance.aracBakimItemSuruklenenPost.subscribe(returnValue => {
                  console.log("Depo'dan Araca Kayıt başarılı.");
                  this[aksPozisyonListName].push(returnValue)
                  this.aracBakimIslemleriKaydet();
                });
                const sub2: Subscription = componentRef.instance.kaydet.subscribe(returnValue => {
                  if (returnValue) {
                    this.aracBakimIslemleriKaydet();
                  }
                });
                componentRef.onDestroy(() => { sub.unsubscribe(); sub2.unsubscribe(); console.log("Unsubscribing") });
              }
              else {
                Swal.showValidationMessage(
                  `Bu Seri No daha önce kullanılmış.`
                );
              }

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
      $(".swal2-confirm").css("background", "none");
      $(".swal2-confirm").html("<img src='assets/aks-iskeletleri/lastik-dialog/img/tire_add.png'>");
      $(".swal2-cancel").css("background", "none");
      $(".swal2-cancel").html("<img src='assets/lazy-home-page/img/cancel.png'>");
    }, 100);

  }

  openDialogAracKayit(suruklenen: AracBakimlar, pozisyonunuVeren: AracBakimlar, event: CdkDragDrop<AracBakimlar[]>, islemTipi: string = "Normal", depoHurda = "") {
    this.aracKayitContainer.clear();

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(AracKayitComponent);
    const componentRef = this.aracKayitContainer.createComponent(componentFactory);
    componentRef.instance.aracId = this.aracId;
    componentRef.instance.lastikId = suruklenen.LastikID;
    componentRef.instance.aracBakimItemSuruklenenGet = suruklenen;
    console.log(suruklenen)
    componentRef.instance.aracBakimItemSuruklenenLastikPozisyonId =
      (depoHurda === "Hurdalık" || depoHurda === "Depoya Geldi") ? 0 : Number(event.container.element.nativeElement.attributes["tire_aks_id"].value);
    componentRef.instance.aracBakimItemSuruklenenAksNumarasi =
      (depoHurda === "Hurdalık" || depoHurda === "Depoya Geldi") ? 0 : Number(event.container.element.nativeElement.attributes["tire_aks_number"].value);

    // componentRef.instance.aracBakimItemPozisyonunuVerenGet = pozisyonunuVeren;
    // componentRef.instance.aracBakimItemPozisyonunuVerenLastikPozisyonId = Number(event.previousContainer.element.nativeElement.attributes["tire_aks_id"].value);
    // componentRef.instance.aracBakimItemPozisyonunuVerenAksNumarasi = Number(event.previousContainer.element.nativeElement.attributes["tire_aks_number"].value);


    const sub: Subscription = componentRef.instance.aracBakimItemSuruklenenPost.subscribe(returnValue => {
      transferArrayItem(event.previousContainer.data, event.container.data,
        event.previousIndex, event.currentIndex);
      // eğer depoya ya da hurdalığa gidecekse, bulunduğu yeri bu şekilde güncelliyoruz. Önceden lastik depoya sürüklenir sürüklenmez bulunduğu yeri değiştiriyorduk.
      // ama ya kullanıcı işlemi iptal eder ve hemen kaydederse? Bu şekilde oluşan bir yanlışı bu kod sayesinde çözmüş oluyoruz.
      if (depoHurda === "Hurdalık" || depoHurda === "Depoya Geldi") returnValue.BulunduguYer = depoHurda;
      //
      suruklenen = returnValue;
      console.log("Rotasyon başarılı.");
      this.aracBakimIslemleriKaydet();
    });
    const sub2: Subscription = componentRef.instance.kaydet.subscribe(returnValue => {
      if (returnValue) {
        this.aracBakimIslemleriKaydet();
      }
    });
    componentRef.onDestroy(() => { sub.unsubscribe(); sub2.unsubscribe(); console.log("Unsubscribing") });
  }

  dotNumerator(sayi: number) {
    var input = sayi;

    var input2 = input.toString().replace(/[\D\s\._\-]+/g, "");
    input = input2 ? parseInt(input2, 10) : 0;

    return (input === 0) ? "" : input.toLocaleString("tr-TR");
  }

  openDialogDepoOnay(event: CdkDragDrop<AracBakimlar[]>) {
    Swal.fire({
      title: 'Bu lastiği depoya sürüklemek istiyor musunuz?',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Evet',
      cancelButtonText: "Hayır",
      preConfirm: (onay) => {
        if (onay) {
          this.dropProcess(event);
        }
      }
    })
  }

  openDialogHurdalikOnay(event: CdkDragDrop<AracBakimlar[]>) {
    Swal.fire({
      title: 'Bu lastiği hurdalığa sürüklemek istiyor musunuz?',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Evet',
      cancelButtonText: "Hayır",
      preConfirm: (onay) => {
        if (onay) {
          this.dropProcess(event);
        }
      }
    })
  }

  dropProcess(event: CdkDragDrop<AracBakimlar[]>) {
    // duruma göre değişiklik kontrolü yapacağız.
    // this.degisiklikOlduMu = true;
    let tip = event.item.element.nativeElement.attributes["tip"].value;

    let suruklenen = event.previousContainer.data;
    let pozisyonunuVeren = event.container.data;
    let yerDegistirme = false;

    // 20.09.2019'dan itibaren AksPozisyonID, işlem tamamlandığında güncelleniyor.
    if (pozisyonunuVeren.length !== 0 && event.container.id !== "cdk-drag-drop-depo" && event.container.id !== "cdk-drag-drop-hurdalik") {
      yerDegistirme = true;
      //  pozisyonunuVeren[0].AksPozisyonID = Number(event.previousContainer.element.nativeElement.attributes["tire_aks_id"] === undefined ? 0 : event.previousContainer.element.nativeElement.attributes["tire_aks_id"].value)
      // suruklenen[0].AksPozisyonID = Number(event.container.element.nativeElement.attributes["tire_aks_id"] === undefined ? 0 : event.container.element.nativeElement.attributes["tire_aks_id"].value)
    }
    else {
      if (event.container.id !== "cdk-drag-drop-depo" && event.container.id !== "cdk-drag-drop-hurdalik") {
        // suruklenen[0].AksPozisyonID = Number(event.container.element.nativeElement.attributes["tire_aks_id"] === undefined ? 0 : event.container.element.nativeElement.attributes["tire_aks_id"].value)
      }
    }

    if (tip === "depo" && pozisyonunuVeren.length > 0) {
      return false;
    }

    // transferArrayItem(event.previousContainer.data, event.container.data,
    //   event.previousIndex, event.currentIndex);

    if (event.container.id === "cdk-drag-drop-hurdalik") {
      // transferArrayItem(event.previousContainer.data, event.container.data,
      //   event.previousIndex, event.currentIndex);
      // suruklenen[0].BulunduguYer = "Hurdalık";
      this.openDialogAracKayit(suruklenen[0], new AracBakimlar(), event, "Normal", "Hurdalık");
      this.degisiklikOlduMu = true;
    }
    else if (event.container.id === "cdk-drag-drop-depo") {
      // transferArrayItem(event.previousContainer.data, event.container.data,
      //   event.previousIndex, event.currentIndex);
      // suruklenen[0].BulunduguYer = "Depoya Geldi";
      this.openDialogAracKayit(suruklenen[0], new AracBakimlar(), event, "Normal", "Depoya Geldi");
      this.degisiklikOlduMu = true;
    }
    else {
      // Hurda ve depoya gitmediyse, servis tarihi ve araç kilometresi isteyeceğiz.
      if (!yerDegistirme) {
        this.openDialogAracKayit(suruklenen[0], new AracBakimlar(), event);
        this.degisiklikOlduMu = true;
      }
    }

    if (tip !== "depo" && event.container.id !== "cdk-drag-drop-depo" && event.container.id !== "cdk-drag-drop-hurdalik") {
      if (yerDegistirme) {
        // transferArrayItem(event.container.data, event.previousContainer.data,
        //   event.currentIndex + 1, event.previousIndex);

        // servis tarihi ve araç kilometresi isteyeceğiz.
        //this.openDialogAracKayit(suruklenen[0], pozisyonunuVeren[0], event, "Yer Değiştirme");

        // Yeni düzene göre 17.09.2019'dan itibaren lastikler birbirlerinin üzerine sürüklenemez.
        this.toastr.error("Yalnızca boş bir alana lastik sürükleyebilirsiniz.");
        this.degisiklikOlduMu = false;
        return false;
      }
      else {
        // servis tarihi ve araç kilometresi isteyeceğiz.
        this.openDialogAracKayit(suruklenen[0], new AracBakimlar(), event);
        this.degisiklikOlduMu = true;
      }

    }

    console.log(this.depoList.filter(a => a.BulunduguYer === "Depoya Geldi"), this.hurdalikList, this.aks11OSL, this.aks12OSG, this.aks25ASLDC, this.aks23ASGDC, this.aks26ASLIC, this.aks24ASGIC);

  }

  ngOnInit() {
  }

  aracBakimIslemleriKaydet() {
    let form: AracBakimlar[][] = [];
    form.push(this.depoList.filter(a => a.BulunduguYer === "Depoya Geldi"));
    form.push(this.hurdalikList);
    form.push(this.aks11OSL);
    form.push(this.aks12OSG);
    form.push(this.aks25ASLDC);
    form.push(this.aks23ASGDC);
    form.push(this.aks26ASLIC);
    form.push(this.aks24ASGIC);

    this.aracBakimlarService.aracBakimIslemleriKaydet(form).subscribe(response => {
      if (response.MessageType === 1) {
        // this.toastr.success(response.Message);
        this.toastr.success("Kayıt başarıyla tamamlandı.");
        this.ilkKontrol();
        this.degisiklikOlduMu = false;
        // setTimeout(() => {
        //   this.router.navigate(['/admin/arac-yonetimi/araclar']);
        // }, 500);
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

  exited(event: CdkDragDrop<AracBakimlar[]>) {
    let tip = event.item.element.nativeElement.attributes["tip"].value;
    if (tip === "depo") {
      this.depo_hide = false;
    }
    return true;
  }

  seriNoKullanildiMiKontrol(seriNo: string) {
    if (this.aks11OSL.find(a => a.SeriNo === seriNo) === undefined
      && this.aks12OSG.find(a => a.SeriNo === seriNo) === undefined
      && this.aks25ASLDC.find(a => a.SeriNo === seriNo) === undefined
      && this.aks23ASGDC.find(a => a.SeriNo === seriNo) === undefined
      && this.aks26ASLIC.find(a => a.SeriNo === seriNo) === undefined
      && this.aks24ASGIC.find(a => a.SeriNo === seriNo) === undefined
      && this.depoList.find(a => a.SeriNo === seriNo) === undefined
      && this.hurdalikList.find(a => a.SeriNo === seriNo) === undefined) {
      return true
    }
    else {
      return false;
    }
  }

  lastikTipResim(lastikTipId: number) {
    if (lastikTipId === undefined) return "assets/aks-iskeletleri/4x2/img/tire.png"
    var lastikTip = this.lastikTipler.find(a => a.LastikTipID === lastikTipId);
    if (lastikTip !== undefined) {
      if (lastikTip.Ad === "Yeni") return "assets/aks-iskeletleri/4x2/img/yellow_tire.png"
      else if (lastikTip.Ad === "Kaplama") return "assets/aks-iskeletleri/4x2/img/blue_tire.png"
      else if (lastikTip.Ad === "Kullanılmış") return "assets/aks-iskeletleri/4x2/img/green_tire.png"
      else if (lastikTip.Ad === "OE") return "assets/aks-iskeletleri/4x2/img/red_tire.png"
      else return "assets/aks-iskeletleri/4x2/img/tire.png"
    }
    else {
      console.log("Sorunlu Lastik! Lastik Tipi Bulunamadı. LastikTipID:" + lastikTipId)
      return "SorunluLastik"; // Sorunlu Lastik
    }
  }

  doubleClick(lastikId: number, aksNumarasi: number, aksPozisyonId) {
    if (this.touchTime == 0) {
      this.touchTime = new Date().getTime();
    } else {
      if (((new Date().getTime()) - this.touchTime) < 800) {
        if (this.degisiklikOlduMu === false) {
          // double click occurred
          this.container.clear();
          const componentFactory = this.componentFactoryResolver.resolveComponentFactory(LastikDialogComponent);
          const componentRef = this.container.createComponent(componentFactory);
          componentRef.instance.aracId = this.aracId;
          componentRef.instance.lastikId = lastikId;
          componentRef.instance.aksNumarasi = aksNumarasi;
          componentRef.instance.lastikPozisyonId = aksPozisyonId; // lastikPozisyonId == aksPozisyonId şeklindedir.
          componentRef.instance.aracKilometre = this.aracKilometre;
        }
        else {
          this.toastr.error("Değişiklikleri kayıt etmeden, lastik üzerinde işlem yapamazsınız.")
        }

        this.touchTime = 0;
      } else {
        this.touchTime = new Date().getTime();
      }
    }

  }

  bosLastikDoubleClick(aksPozisyonListName: string, aksPozisyonId: number, aksNumarasi: number) {
    if (this.touchTime == 0) {
      this.touchTime = new Date().getTime();
    } else {
      if (((new Date().getTime()) - this.touchTime) < 800) {
        if (this.degisiklikOlduMu === false) {
          // double click occurred
          let firmaId = this.firmaId;
          let aracId = this.aracId;
          Swal.fire({
            title: 'Seçim Yapınız',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Seri No Gir',
            cancelButtonText: "Yeni Lastik Ekle",
            preConfirm: (onay) => {
              if (onay) {
                this.openDialogSerialNumberBosLastik(aksPozisyonListName, aksPozisyonId, aksNumarasi);
              }
            },
          }).then(function (result) {
            if (result.value) {
            } else if (result.dismiss == 'cancel') {
              window.location.href = "/admin/lastik-yonetimi/lastik-ekle?firmaId=" + firmaId + "&aracId=" + aracId +
                "&aksPozisyonListName=" + aksPozisyonListName + "&aksPozisyonId=" + aksPozisyonId + "&aksNumarasi=" + aksNumarasi;
            }
          });
          $(".swal2-confirm").css("background", "none");
          $(".swal2-confirm").html("<img src='assets/aks-iskeletleri/lastik-dialog/img/serial_no_mini.png'>");
          $(".swal2-cancel").css("background", "none");
          $(".swal2-cancel").html("<img src='assets/aks-iskeletleri/lastik-dialog/img/tireOk.png'>");
        }
        else {
          this.toastr.error("Değişiklikleri kayıt etmeden, lastik üzerinde işlem yapamazsınız.")
        }

        this.touchTime = 0;
      } else {
        this.touchTime = new Date().getTime();
      }
    }
  }

  goToHomePage() {
    if (this.degisiklikOlduMu === true) {
      Swal.fire({
        title: 'Değişikliklerinizi kaydetmeden çıkmak istiyor musunuz?',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Evet',
        cancelButtonText: "Hayır",
        preConfirm: (onay) => {
          if (onay) {
            window.location.href = "/home";
          }
        }
      })
    }
    else {
      window.location.href = "/home";
    }
  }

  aracBilgiGetir() {
    this.aracBilgiContainer.clear();
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(AracBilgiComponent);
    const componentRef = this.aracBilgiContainer.createComponent(componentFactory);
    componentRef.instance.aracId = this.aracId;
  }

}
