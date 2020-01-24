import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'src/app/lazy-general-page/services/extra-services/toastr.service';
import { AracMarkalarService } from 'src/app/lazy-general-page/services/backend-services/arac-markalar/arac-markalar.service';
import { AracMarkaGuncelle } from 'src/app/lazy-general-page/classes/arac-markalar/models/arac-marka-guncelle';
import { AracModellerService } from 'src/app/lazy-general-page/services/backend-services/arac-modeller/arac-modeller.service';
import { AracModelGuncelle } from 'src/app/lazy-general-page/classes/arac-modeller/models/arac-model-guncelle';
import { AracKategorilerService } from 'src/app/lazy-general-page/services/backend-services/arac-kategoriler/arac-kategoriler.service';
import { AracKategoriler } from 'src/app/lazy-general-page/classes/arac-kategoriler/arac-kategoriler';
import { Select2OptionData } from 'ng-select2';

@Component({
  selector: 'app-arac-model-guncelle',
  templateUrl: './arac-model-guncelle.component.html',
  styleUrls: ['./arac-model-guncelle.component.css']
})
export class AracModelGuncelleComponent implements OnInit {

  aracKategoriKilitle: boolean = true;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private aracKategorilerService: AracKategorilerService, private aracModellerService: AracModellerService, private toastr: ToastrService, private router: Router) {
    // initialize FormGroup  
    this.regiForm = fb.group({
      'AracKategoriID': [null, Validators.compose([Validators.required])], // select
      'Ad': [null, Validators.compose([Validators.required, Validators.maxLength(99)])], // input=text
      'Sira': [null, Validators.compose([Validators.required])], // input=number
      'ListeAktiflik': [null, Validators.compose([Validators.required])], // input=checkbox
    });

    let id = this.route.snapshot.params.id === undefined ? 0 : this.route.snapshot.params.id;
    if (isNaN(id)) {
      window.location.href = "/admin/arac-yonetimi/arac-model";
    }
    else {
      this.aracModellerService.getAracModel(id).toPromise().then(response => {
        this.regiForm = fb.group({
          'AracModelID': [response.AracModelID],
          'AracKategoriID': [response.AracKategoriID, Validators.compose([Validators.required])], // select
          'Ad': [response.Ad, Validators.compose([Validators.required, Validators.maxLength(99)])], // input=text
          'Sira': [response.Sira, Validators.compose([Validators.required])], // input=number
          'ListeAktiflik': [response.ListeAktiflik, Validators.compose([Validators.required])], // input=checkbox
        });

        this.mevcutAracKategori = response.AracKategoriID.toString();

        // Araç modelini kullanan araç kaydı sayısını sorguluyoruz. Bu şekilde araç kategorisinin disabled olup olmayacağını client tarafında kontrol edeceğiz.
        this.aracModellerService.aracModelKullaniliyorMu(response.AracModelID).subscribe(aracModelKullaniliyorMuResponse => {
          if (aracModelKullaniliyorMuResponse) this.aracKategoriKilitle = true;
          else this.aracKategoriKilitle = false;
        })

        this.aracKategorilerService.getAracKategoriler().subscribe(response => {
          this.aracKategoriler = [];
          var filtrele = response.filter(a => a.ListeAktiflik == true);

          if (this.mevcutAracKategori !== "0") {
            if (filtrele.find(a => a.AracKategoriID == Number(this.mevcutAracKategori)) == undefined) {
              var aktifligiIptalEdilmisKayit = response.find(a => a.AracKategoriID == Number(this.mevcutAracKategori));
              if (aktifligiIptalEdilmisKayit == undefined) { // Silinmiş yani Aktif=false
                this.aracKategoriler.push({
                  id: null,
                  text: "-"
                });
              }
              else {
                this.aracKategoriler.push({
                  id: String(aktifligiIptalEdilmisKayit.AracKategoriID),
                  text: aktifligiIptalEdilmisKayit.Ad
                });
              }

            }
          }

          filtrele.forEach(item => {
            this.aracKategoriler.push({
              id: String(item.AracKategoriID),
              text: item.Ad
            });
          })
        })

      });

    }
  }

  regiForm: FormGroup;
  aracKategoriler: Array<Select2OptionData> = [];
  mevcutAracKategori: string = "";
  ngOnInit() {
  }

  onFormSubmit(form: AracModelGuncelle) {
    this.aracModellerService.aracModelGuncelle(form).subscribe(response => {
      if (response.MessageType === 1) {
        this.toastr.success(response.Message);
        // setTimeout(() => {
        //   this.router.navigate(['/admin/arac-yonetimi/arac-model']);
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

}
