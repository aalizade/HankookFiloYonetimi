import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LastikMarkaDesenlerService } from 'src/app/lazy-general-page/services/backend-services/lastik-marka-desenler/lastik-marka-desenler.service';
import { ToastrService } from 'src/app/lazy-general-page/services/extra-services/toastr.service';
import { LastikMarkaDesenEkle } from 'src/app/lazy-general-page/classes/lastik-marka-desenler/models/lastik-marka-desen-ekle';
import { LastikMarkalarService } from 'src/app/lazy-general-page/services/backend-services/lastik-markalar/lastik-markalar.service';

@Component({
  selector: 'app-lastik-marka-desen-ekle',
  templateUrl: './lastik-marka-desen-ekle.component.html',
  styleUrls: ['./lastik-marka-desen-ekle.component.css']
})
export class LastikMarkaDesenEkleComponent implements OnInit {

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private lastikMarkalarService:LastikMarkalarService, private lastikMarkaDesenlerService: LastikMarkaDesenlerService, private toastr: ToastrService, private router: Router) {
    // initialize FormGroup  
    this.regiForm = fb.group({
      'LastikMarkaID': [null, Validators.compose([Validators.required])], // select
      'Ad': [null, Validators.compose([Validators.required, Validators.maxLength(99)])], // input=text
      'Sira': [null, Validators.compose([Validators.required])], // input=number
    });

    let id = this.route.snapshot.params.lastikMarkaId === undefined ? undefined : this.route.snapshot.params.lastikMarkaId;
    if (isNaN(id)) {
      window.location.href = "/admin/lastik-yonetimi/lastik-marka";
    }
    else {
      this.lastikMarkalarService.getLastikMarka(id).subscribe(response => this.lastikMarka = response.Ad);
      this.regiForm = fb.group({
        'LastikMarkaID': [id],
        'Ad': [null, Validators.compose([Validators.required, Validators.maxLength(99)])], // input=text
        'Sira': [null, Validators.compose([Validators.required])], // input=number
      });
    }
  }

  regiForm: FormGroup;
  lastikMarka: string = "";

  ngOnInit() {

  }

  onFormSubmit(form: LastikMarkaDesenEkle) {
    this.lastikMarkaDesenlerService.lastikMarkaDesenEkle(form).subscribe(response => {
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
