import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AraclarService } from 'src/app/lazy-general-page/services/backend-services/araclar/araclar.service';
import { FirmalarService } from 'src/app/lazy-general-page/services/backend-services/firmalar/firmalar.service';
import { AracMarkalarService } from 'src/app/lazy-general-page/services/backend-services/arac-markalar/arac-markalar.service';
import { AracModellerService } from 'src/app/lazy-general-page/services/backend-services/arac-modeller/arac-modeller.service';
import { ToastrService } from 'src/app/lazy-general-page/services/extra-services/toastr.service';
import { Select2OptionData } from 'ng-select2';
import { AracGuncelle } from 'src/app/lazy-general-page/classes/araclar/models/arac-guncelle';
import { AracKategorilerService } from 'src/app/lazy-general-page/services/backend-services/arac-kategoriler/arac-kategoriler.service';
import { AuthorizationService } from 'src/app/lazy-general-page/services/authorization/authorization.service';
import { Role } from 'src/app/lazy-general-page/services/authorization/roles/role';
import { AracBakimlarService } from 'src/app/lazy-general-page/services/backend-services/arac-bakimlar/arac-bakimlar.service';

@Component({
  selector: 'app-arac-guncelle',
  templateUrl: './arac-guncelle.component.html',
  styleUrls: ['./arac-guncelle.component.css']
})
export class AracGuncelleComponent implements OnInit {

  aracKategoriAksSayisi: number = 0;
  psiBar: string = "";
  markaModelKilitle: boolean = true;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private araclarService: AraclarService,
    private firmalarService: FirmalarService, private aracBakimService: AracBakimlarService,
    private aracKategorilerService: AracKategorilerService,
    private aracMarkalarService: AracMarkalarService, private aracModellerService: AracModellerService, private toastr: ToastrService, private router: Router, private authorizationService: AuthorizationService) {

    // initialize FormGroup  
    this.regiForm = fb.group({
      'Plaka': [null, Validators.compose([Validators.required, Validators.maxLength(49)])], // input=text
      'MarkaID': [null, Validators.compose([Validators.required])], // select
      'ModelID': [null, Validators.compose([Validators.required])], // select
      'FirmaID': [null, Validators.compose([Validators.required])], // select
      'Aks1': [null],
      'Aks2': [null],
      'Aks3': [null],
      'Aks4': [null],
      'ListeAktiflik': [null, Validators.compose([Validators.required])], // input=checkbox
    });

    let id = this.route.snapshot.params.aracId === undefined ? 0 : this.route.snapshot.params.aracId;
    if (isNaN(id)) {
      window.location.href = "/admin/arac-yonetimi/araclar";
    }
    else {
      this.araclarService.getArac(id).toPromise().then(response => {
        this.regiForm = fb.group({
          'AracID': [response.AracID],
          'Plaka': [response.Plaka, Validators.compose([Validators.required, Validators.maxLength(49)])], // input=text
          'MarkaID': [response.MarkaID, Validators.compose([Validators.required])], // select
          'ModelID': [response.ModelID, Validators.compose([Validators.required])], // select
          'FirmaID': [response.FirmaID, Validators.compose([Validators.required])], // select
          'Aks1': [response.Aks1],
          'Aks2': [response.Aks2],
          'Aks3': [response.Aks3],
          'Aks4': [response.Aks4],
          'ListeAktiflik': [response.ListeAktiflik, Validators.compose([Validators.required])], // input=checkbox
        });

        this.aracBakimService.aracaBagliAktifLastikler(response.AracID).subscribe(aracBagliResponse => {
          if (aracBagliResponse.length === 0) this.markaModelKilitle = false;
          else this.markaModelKilitle = true;
        });

        this.mevcutFirma = response.FirmaID.toString();
        this.mevcutMarka = response.MarkaID.toString();
        this.mevcutModel = response.ModelID.toString();

        this.firmalarService.getFirmalar().subscribe(firmaResponse => {
          this.firmalar = [];
          var filtrele = firmaResponse.filter(a => a.ListeAktiflik === true)

          if (this.mevcutFirma !== "0") {
            if (filtrele.find(a => a.FirmaID == Number(this.mevcutFirma)) === undefined) {
              var aktifligiIptalEdilmisKayit = firmaResponse.find(a => a.FirmaID === Number(this.mevcutFirma));
              if (aktifligiIptalEdilmisKayit == undefined) { // Silinmiş yani Aktif=false
                console.log(1)
                this.firmalar.push({
                  id: null,
                  text: "-"
                });
              }
              else {
                this.firmalar.push({
                  id: String(aktifligiIptalEdilmisKayit.FirmaID),
                  text: aktifligiIptalEdilmisKayit.FirmaAd
                });
              }

            }
          }

          filtrele.forEach(item => {
            this.firmalar.push({
              id: String(item.FirmaID),
              text: item.Rol === Role.Sube ? item.FirmaAd + " [ŞUBE]" : item.FirmaAd
            });
          })
        });
        this.aracMarkalarService.getAracMarkalar().subscribe(response => {
          this.aracMarkalar = [];
          var filtrele = response.filter(a => a.ListeAktiflik == true)

          if (this.mevcutMarka !== "0") {
            if (filtrele.find(a => a.AracMarkaID == Number(this.mevcutMarka)) == undefined) {
              var aktifligiIptalEdilmisKayit = response.find(a => a.AracMarkaID == Number(this.mevcutMarka));
              if (aktifligiIptalEdilmisKayit == undefined) { // Silinmiş yani Aktif=false
                this.aracMarkalar.push({
                  id: null,
                  text: "-"
                });
              }
              else {
                this.aracMarkalar.push({
                  id: String(aktifligiIptalEdilmisKayit.AracMarkaID),
                  text: aktifligiIptalEdilmisKayit.Ad
                });
              }

            }
          }

          filtrele.forEach(item => {
            this.aracMarkalar.push({
              id: String(item.AracMarkaID),
              text: item.Ad
            });
          })
        });

        this.aracModellerService.getAracModeller().subscribe(response => {
          this.aracModeller = [];
          var filtrele = response.filter(a => a.ListeAktiflik == true && a.AracMarkaID == Number(this.mevcutMarka))

          if (this.mevcutModel !== "0") {
            if (filtrele.find(a => a.AracModelID == Number(this.mevcutModel)) == undefined) {
              var aktifligiIptalEdilmisKayit = response.find(a => a.AracModelID == Number(this.mevcutModel));
              if (aktifligiIptalEdilmisKayit == undefined) { // Silinmiş yani Aktif=false
                this.aracModeller.push({
                  id: null,
                  text: "-"
                });
              }
              else {
                this.aracModeller.push({
                  id: String(aktifligiIptalEdilmisKayit.AracModelID),
                  text: aktifligiIptalEdilmisKayit.Ad
                });
              }

            }
          }

          filtrele.forEach(item => {
            this.aracModeller.push({
              id: String(item.AracModelID),
              text: item.Ad
            });
          })
        });

      });

    }
  }

  regiForm: FormGroup;

  firmalar: Array<Select2OptionData> = [];
  aracMarkalar: Array<Select2OptionData> = [];
  aracModeller: Array<Select2OptionData> = [];

  mevcutFirma: string = "";
  mevcutMarka: string = "";
  mevcutModel: string = "";
  ilkGiris: boolean = true; // valueChange methodu ilk yüklemede de çalıştığı için, model kısmında validate sorunları yaşanıyordu. Bu sayede çözülmüş oldu.

  ngOnInit() {
    $("body").on("keyup", "#plakaPattern", function (e) {
      var v;
      var val = $(this).val();
      v = val.toString().toLocaleUpperCase().trim();
      if(v.length > 9){
        $(this).val(v.substring(0,9))
      } 
      else $(this).val(v)
    });
  }

  getPsiBar(event: any) {
    let firmaId = event.value;
    this.firmalarService.getFirma(Number(firmaId)).subscribe(response => this.psiBar = response.PsiBar);
  }

  getModel(event: any) {
    this.aracModellerService.getAracModeller().subscribe(response => {
      this.aracModeller = [];
      var filtrele = response.filter(a => a.ListeAktiflik == true && a.AracMarkaID == Number(event.value));
      filtrele.forEach(item => {
        this.aracModeller.push({
          id: String(item.AracModelID),
          text: item.Ad
        });
      })
    });
    if (this.ilkGiris) {
      this.ilkGiris = false;
    }
    else {
      this.mevcutModel = null;
    }
  }

  ilkAracKategoriAksSayisiSorgu = true;
  getAracKategoriAksSayisi(event: any) {
    if (!this.ilkAracKategoriAksSayisiSorgu) {
      this.regiForm.controls['Aks1'].setValue(0);
      this.regiForm.controls['Aks2'].setValue(0);
      this.regiForm.controls['Aks3'].setValue(0);
      this.regiForm.controls['Aks4'].setValue(0);
    }
    this.aracModellerService.getAracModel(Number(event.value)).subscribe(response => {
      if (response["Error"] === undefined)
        this.aracKategorilerService.getAracKategori(response.AracKategoriID).subscribe(aracKategoriResponse => {
          this.aracKategoriAksSayisi = aracKategoriResponse.AksSayisi;
          this.ilkAracKategoriAksSayisiSorgu = false;
        });
    })
  }

  onFormSubmit(form: AracGuncelle) {
    $(".aracKategoriAkslar").each(function () {
      form["Aks" + $(this).attr("data-id")] = $(this).val();
    });
    if ($("#plakaPattern").css("border") === "1px solid rgb(255, 0, 0)") {
      this.toastr.error("Lütfen doğru bir plaka giriniz.");
      console.log($("#plakaPattern").css("border"))
    }
    else {
      this.araclarService.aracGuncelle(form).subscribe(response => {
        if (response.MessageType === 1) {
          this.toastr.success(response.Message);
          setTimeout(() => {
            this.router.navigate(['/admin/arac-yonetimi/araclar']);
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
  }
}
