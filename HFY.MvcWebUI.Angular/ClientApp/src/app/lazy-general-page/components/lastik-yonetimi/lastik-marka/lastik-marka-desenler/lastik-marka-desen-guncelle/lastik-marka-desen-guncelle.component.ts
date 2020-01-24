import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LastikMarkaDesenlerService } from 'src/app/lazy-general-page/services/backend-services/lastik-marka-desenler/lastik-marka-desenler.service';
import { ToastrService } from 'src/app/lazy-general-page/services/extra-services/toastr.service';
import { LastikMarkaDesenGuncelle } from 'src/app/lazy-general-page/classes/lastik-marka-desenler/models/lastik-marka-desen-guncelle';

@Component({
  selector: 'app-lastik-marka-desen-guncelle',
  templateUrl: './lastik-marka-desen-guncelle.component.html',
  styleUrls: ['./lastik-marka-desen-guncelle.component.css']
})
export class LastikMarkaDesenGuncelleComponent implements OnInit {

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private lastikMarkaDesenlerService: LastikMarkaDesenlerService, private toastr: ToastrService, private router: Router) {
    // initialize FormGroup  
    this.regiForm = fb.group({
      'Ad': [null, Validators.compose([Validators.required, Validators.maxLength(99)])], // input=text
      'Sira': [null, Validators.compose([Validators.required])], // input=number
      'ListeAktiflik': [null, Validators.compose([Validators.required])], // input=checkbox
    });

    let id = this.route.snapshot.params.lastikMarkaDesenId === undefined ? 0 : this.route.snapshot.params.lastikMarkaDesenId;
    if (isNaN(id)) {
      window.location.href = "/admin/lastik-yonetimi/lastik-marka";
    }
    else {
      this.lastikMarkaDesenlerService.getLastikMarkaDesen(id).toPromise().then(response => {
        this.regiForm = fb.group({
          'LastikMarkaDesenID': [response.LastikMarkaDesenID],
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

  onFormSubmit(form: LastikMarkaDesenGuncelle) {
    this.lastikMarkaDesenlerService.lastikMarkaDesenGuncelle(form).subscribe(response => {
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
