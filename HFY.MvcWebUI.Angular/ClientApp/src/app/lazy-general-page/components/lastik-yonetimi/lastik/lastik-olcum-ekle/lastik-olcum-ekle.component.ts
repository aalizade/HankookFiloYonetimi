import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { EbatlarService } from 'src/app/lazy-general-page/services/backend-services/ebatlar/ebatlar.service';
import { ToastrService } from 'src/app/lazy-general-page/services/extra-services/toastr.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LastikOlcumlerService } from 'src/app/lazy-general-page/services/backend-services/lastik-olcumler/lastik-olcumler.service';
import { LastikOlcumEkle } from 'src/app/lazy-general-page/classes/lastik-olcumler/models/lastik-olcum-ekle';
import { AuthorizationService } from 'src/app/lazy-general-page/services/authorization/authorization.service';
import { Select2OptionData } from 'ng-select2';
import { LastikKonumlarService } from 'src/app/lazy-general-page/services/backend-services/lastik-konumlar/lastik-konumlar.service';
import { LastiklerService } from 'src/app/lazy-general-page/services/backend-services/lastikler/lastikler.service';
import { FirmalarService } from 'src/app/lazy-general-page/services/backend-services/firmalar/firmalar.service';

@Component({
  selector: 'app-lastik-olcum-ekle',
  templateUrl: './lastik-olcum-ekle.component.html',
  styleUrls: ['./lastik-olcum-ekle.component.css']
})
export class LastikOlcumEkleComponent implements OnInit {

  disDerinligiSayisi: number;
  disDerinligiSayiArray: number[] = [];
  lastikId: number;

  gozlemleArray: Array<{ Ad: string, KisaAd: string }> = [
    {
      Ad: "Düzensiz Aşınma",
      KisaAd: "DuzensizAsinma"
    },
    {
      Ad: "Düşük Hava | Aşırı Yük",
      KisaAd: "DusukHavaAsiriYuk"
    },
    {
      Ad: "Darbe | Kesik | Kopma",
      KisaAd: "DarbeKesikKopma"
    }
  ]

  constructor(private fb: FormBuilder,
    private lastikService: LastiklerService,
    private authorize: AuthorizationService, private lastikKonumlarService: LastikKonumlarService, private firmalarService: FirmalarService, private lastikOlcumService: LastikOlcumlerService, private toastr: ToastrService, private router: Router, private route: ActivatedRoute) {
    this.authorize.GetUserTokenInfo().subscribe(response => {
      let firmaId = Number(response.Result.id);
      this.firmalarService.getFirma(firmaId).subscribe(firmaResponse => {
        this.disDerinligiSayisi = firmaResponse.DisDerinligiSayisi;

        for (let index = 1; index <= this.disDerinligiSayisi; index++) {
          this.disDerinligiSayiArray.push(index);
        }
      });
    })

    // initialize FormGroup  
    this.regiForm = fb.group({
      'LastikID': [null],
      'Tarih': [null, Validators.compose([Validators.required])],
      'AracKilometre': [null, Validators.compose([Validators.required, Validators.maxLength(7)])],
      'LastikKilometre': [null, Validators.compose([Validators.required, Validators.maxLength(7)])],
      'GuvenliDisSeviyesi': [0, Validators.compose([Validators.required, Validators.maxLength(5)])],
      'Basinc': [null, Validators.compose([Validators.required, Validators.max(100)])],
      'BasincAlinamadi': [false, Validators.compose([Validators.required])],
      'LastikKonumID': [null, Validators.compose([Validators.required])],
    });

    let id = this.route.snapshot.params.lastikId === undefined ? 0 : this.route.snapshot.params.lastikId;
    if (isNaN(id)) {
      window.location.href = "/admin/lastik-yonetimi/lastik";
    }
    else {
      this.lastikId = id;
      this.regiForm = fb.group({
        'LastikID': [id],
        'Tarih': [null, Validators.compose([Validators.required])],
        'AracKilometre': [null, Validators.compose([Validators.required, Validators.maxLength(7)])],
        'LastikKilometre': [null, Validators.compose([Validators.required, Validators.maxLength(7)])],
        'GuvenliDisSeviyesi': [0, Validators.compose([Validators.required, Validators.maxLength(5)])],
        'Basinc': [null, Validators.compose([Validators.required, Validators.max(100)])],
        'BasincAlinamadi': [false, Validators.compose([Validators.required])],
        'LastikKonumID': [null, Validators.compose([Validators.required])],
      });

      this.lastikService.getLastik(id).subscribe(lastikResponse => {

        //
        this.lastikKonumlarService.getLastikKonumlar().subscribe(response => {
          this.lastikKonumlar = [];
          this.varsayilanLastikKonum = String(lastikResponse.LastikKonumID);
          response.filter(a => a.ListeAktiflik == true).forEach(item => {
            this.lastikKonumlar.push({
              id: String(item.LastikKonumID),
              text: item.Ad
            });
          })
        });
      });

    }
  }

  regiForm: FormGroup;
  lastikKonumlar: Array<Select2OptionData> = []; varsayilanLastikKonum: string;

  ngOnInit() {

  }

  onFormSubmit(form: LastikOlcumEkle) {

    let disDerinligiVerileri = [];
    this.disDerinligiSayiArray.forEach((item, index) => {
      let indexValue = $("#disDerinligi_" + (index + 1)).val();
      if (indexValue !== "") {
        let fullName = "DisDerinligi" + (index + 1);
        disDerinligiVerileri.push({ [fullName]: indexValue })
      }
    })

    if (disDerinligiVerileri.length !== this.disDerinligiSayisi) {
      this.toastr.error("Lütfen Tüm Diş Derinliklerini giriniz.");
      return;
    }

    form.DisDerinligiJSON = JSON.stringify(disDerinligiVerileri);

    form.GozlemYapildiMi = false;
    
    let gozlemVerileri = [];
    this.gozlemleArray.forEach((item, index) => {
      let checked = $("#" + item.KisaAd).is(':checked');
      gozlemVerileri.push({ [item.KisaAd]: checked });
      if(checked){
        form.GozlemYapildiMi = true;
      }
    });

    let GozlemJSON = JSON.stringify(gozlemVerileri);
    console.log(GozlemJSON);
    form.GozlemJSON = GozlemJSON;

    this.lastikOlcumService.lastikOlcumEkle(form).subscribe(response => {
      if (response.MessageType === 1) {
        this.toastr.success(response.Message);
        setTimeout(() => {
          this.router.navigate(['/admin/lastik-yonetimi/lastik-hareketler/' + this.lastikId]);
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
