import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AraclarService } from 'src/app/lazy-general-page/services/backend-services/araclar/araclar.service';
import { FirmalarService } from 'src/app/lazy-general-page/services/backend-services/firmalar/firmalar.service';
import { AracMarkalarService } from 'src/app/lazy-general-page/services/backend-services/arac-markalar/arac-markalar.service';
import { AracModellerService } from 'src/app/lazy-general-page/services/backend-services/arac-modeller/arac-modeller.service';
import { ToastrService } from 'src/app/lazy-general-page/services/extra-services/toastr.service';
import { Select2OptionData } from 'ng-select2';
import { AracEkle } from 'src/app/lazy-general-page/classes/araclar/models/arac-ekle';
import { AracKategorilerService } from 'src/app/lazy-general-page/services/backend-services/arac-kategoriler/arac-kategoriler.service';
import { AuthorizationService } from 'src/app/lazy-general-page/services/authorization/authorization.service';
import { Role } from 'src/app/lazy-general-page/services/authorization/roles/role';

@Component({
  selector: 'app-arac-ekle',
  templateUrl: './arac-ekle.component.html',
  styleUrls: ['./arac-ekle.component.css']
})
export class AracEkleComponent implements OnInit {

  aracKategoriAksSayisi: number = 0;
  psiBar: string = "";
  anaSayfayaDonBtn: boolean = false;

  // araç kaydı yapıldıktan sonra bu değişken dolacaktır.
  aracId:number;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private araclarService: AraclarService,
    private firmalarService: FirmalarService, private aracMarkalarService: AracMarkalarService,
    private aracKategorilerService: AracKategorilerService,
    private aracModellerService: AracModellerService, private toastr: ToastrService, private router: Router, private authorizationService: AuthorizationService) {
    // initialize FormGroup  
    this.regiForm = fb.group({
      'Plaka': [null, Validators.compose([Validators.required, Validators.maxLength(49)])], // input=text
      'MarkaID': [null, Validators.compose([Validators.required])], // select
      'ModelID': [null, Validators.compose([Validators.required])], // select
      'FirmaID': [null, Validators.compose([Validators.required])], // select
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
    this.aracMarkalarService.getAracMarkalar().subscribe(response => {
      this.aracMarkalar = [];
      response.filter(a => a.ListeAktiflik == true).forEach(item => {
        this.aracMarkalar.push({
          id: String(item.AracMarkaID),
          text: item.Ad
        });
      })
    });
    this.aracModeller = [];

    if (window.innerWidth <= 800) {
      this.anaSayfayaDonBtn = true;
    }
  }

  regiForm: FormGroup;

  firmalar: Array<Select2OptionData> = [];
  aracMarkalar: Array<Select2OptionData> = [];
  aracModeller: Array<Select2OptionData> = [];

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
    console.log(firmaId)
    this.firmalarService.getFirma(Number(firmaId)).subscribe(response => this.psiBar = response.PsiBar);
  }

  getModel(event: any) {
    this.aracModellerService.getAracModeller().subscribe(response => {
      this.aracModeller = [];
      response.filter(a => a.ListeAktiflik == true && a.AracMarkaID == Number(event.value)).forEach(item => {
        this.aracModeller.push({
          id: String(item.AracModelID),
          text: item.Ad
        });
      })
    });
  }

  getAracKategoriAksSayisi(event: any) {
    this.aracModellerService.getAracModel(Number(event.value)).subscribe(response => {
      if (response["Error"] === undefined)
        this.aracKategorilerService.getAracKategori(response.AracKategoriID).subscribe(aracKategoriResponse => {
          this.aracKategoriAksSayisi = aracKategoriResponse.AksSayisi;
        });
    })
  }

  onFormSubmit(form: AracEkle) {
    $(".aracKategoriAkslar").each(function () {
      let value = $(this).val()
      if(value === "") value = "0";
      form["Aks" + $(this).attr("data-id")] = value;
    });

    if ($("#plakaPattern").css("border") === "1px solid rgb(255, 0, 0)") {
      this.toastr.error("Lütfen doğru bir plaka giriniz.");
      $("#plakaPattern").css("border")
    }
    else {
      this.araclarService.aracEkle(form).subscribe(response => {
        if (response.MessageType === 1) {
          this.toastr.success(response.Message);
          this.aracId = response.Result.AracID;
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
  }

  goToHomePage() {
    window.location.href = "/home";
  }

  aracaGit(){
    window.location.href = "/islemler/arac-bakim/arac/" + this.aracId;
  }

}
