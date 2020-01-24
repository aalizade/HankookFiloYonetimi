import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ToastrService } from 'src/app/lazy-general-page/services/extra-services/toastr.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AracModellerService } from 'src/app/lazy-general-page/services/backend-services/arac-modeller/arac-modeller.service';
import { AracModelEkle } from 'src/app/lazy-general-page/classes/arac-modeller/models/arac-model-ekle';
import { AracMarkalarService } from 'src/app/lazy-general-page/services/backend-services/arac-markalar/arac-markalar.service';
import { AracKategorilerService } from 'src/app/lazy-general-page/services/backend-services/arac-kategoriler/arac-kategoriler.service';
import { AracKategoriler } from 'src/app/lazy-general-page/classes/arac-kategoriler/arac-kategoriler';
import { Select2OptionData } from 'ng-select2';

@Component({
  selector: 'app-arac-model-ekle',
  templateUrl: './arac-model-ekle.component.html',
  styleUrls: ['./arac-model-ekle.component.css']
})
export class AracModelEkleComponent implements OnInit {

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private aracKategorilerService: AracKategorilerService, private aracMarkalarService: AracMarkalarService, private aracModellerService: AracModellerService, private toastr: ToastrService, private router: Router) {
    // initialize FormGroup  
    this.regiForm = fb.group({
      'AracKategoriID': [null, Validators.compose([Validators.required])], // select
      'Ad': [null, Validators.compose([Validators.required, Validators.maxLength(99)])], // input=text
      'Sira': [null, Validators.compose([Validators.required])], // input=number
    });

    let id = this.route.snapshot.params.aracMarkaId === undefined ? undefined : this.route.snapshot.params.aracMarkaId;
    if (isNaN(id)) {
      window.location.href = "/admin/arac-yonetimi/arac-marka";
    }
    else {
      this.aracMarkalarService.getAracMarka(id).subscribe(response => this.aracMarka = response.Ad);
      this.regiForm = fb.group({
        'AracMarkaID': [id],
        'AracKategoriID': [null, Validators.compose([Validators.required])], // select
        'Ad': [null, Validators.compose([Validators.required, Validators.maxLength(99)])], // input=text
        'Sira': [null, Validators.compose([Validators.required])], // input=number
      });
      this.aracKategorilerService.getAracKategoriler().subscribe(response => {
        this.aracKategoriler = [];
        response.filter(a => a.ListeAktiflik == true).forEach(item => {
          this.aracKategoriler.push({
            id: String(item.AracKategoriID),
            text: item.Ad
          });
        })
      })
    }
  }

  regiForm: FormGroup;
  aracMarka: string = "";
  aracKategoriler: Array<Select2OptionData> = [];

  ngOnInit() {

  }

  onFormSubmit(form: AracModelEkle) {
    this.aracModellerService.aracModelEkle(form).subscribe(response => {
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
