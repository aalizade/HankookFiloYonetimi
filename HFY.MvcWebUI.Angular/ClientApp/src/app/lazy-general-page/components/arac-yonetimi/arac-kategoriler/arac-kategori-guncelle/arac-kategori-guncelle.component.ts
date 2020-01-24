import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AracKategorilerService } from 'src/app/lazy-general-page/services/backend-services/arac-kategoriler/arac-kategoriler.service';
import { ToastrService } from 'src/app/lazy-general-page/services/extra-services/toastr.service';
import { AracKategoriGuncelle } from 'src/app/lazy-general-page/classes/arac-kategoriler/models/arac-kategori-guncelle';

@Component({
  selector: 'app-arac-kategori-guncelle',
  templateUrl: './arac-kategori-guncelle.component.html',
  styleUrls: ['./arac-kategori-guncelle.component.css']
})
export class AracKategoriGuncelleComponent implements OnInit {

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private aracKategoriService: AracKategorilerService, private toastr: ToastrService, private router: Router) {
    // initialize FormGroup  
    this.regiForm = fb.group({
      'Ad': [null, Validators.compose([Validators.required, Validators.maxLength(99)])], // input=text
      'Sira': [null, Validators.compose([Validators.required])], // input=number
      'ListeAktiflik': [null, Validators.compose([Validators.required])], // input=checkbox
    });

    let id = this.route.snapshot.params.id === undefined ? 0 : this.route.snapshot.params.id;
    if (isNaN(id)) {
      window.location.href = "/admin/arac-yonetimi/arac-kategori";
    }
    else {
      this.aracKategoriService.getAracKategori(id).subscribe(response => {
        this.regiForm = fb.group({
          'AracKategoriID': [response.AracKategoriID],
          'Ad': [response.Ad, Validators.compose([Validators.required, Validators.maxLength(99)])], // input=text
          'Sira': [response.Sira, Validators.compose([Validators.required])], // input=number
          'ListeAktiflik': [response.ListeAktiflik, Validators.compose([Validators.required])], // input=checkbox
        });
      });
    }
  }

  regiForm: FormGroup;

  ngOnInit() {
  }

  onFormSubmit(form: AracKategoriGuncelle) {
    this.aracKategoriService.aracKategoriGuncelle(form).subscribe(response => {
      if (response.MessageType === 1) {
        this.toastr.success(response.Message);
        setTimeout(() => {
          this.router.navigate(['/admin/arac-yonetimi/arac-kategori']);
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
