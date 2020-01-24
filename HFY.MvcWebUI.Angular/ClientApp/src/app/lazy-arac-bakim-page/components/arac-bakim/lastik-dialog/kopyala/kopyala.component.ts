import { Component, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'src/app/lazy-general-page/services/extra-services/toastr.service';
import { LastiklerService } from 'src/app/lazy-general-page/services/backend-services/lastikler/lastikler.service';
import { LastikKopyala } from 'src/app/lazy-general-page/classes/lastikler/models/lastik-kopyala';
import { LastikRotasyonaKopyala } from 'src/app/lazy-general-page/classes/lastikler/models/lastik-rotasyona-kopyala';
import { LastikHareketlerService } from 'src/app/lazy-general-page/services/backend-services/lastik-hareketler/lastik-hareketler.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-kopyala',
  templateUrl: './kopyala.component.html',
  styleUrls: ['./kopyala.component.css']
})
export class KopyalaComponent implements AfterViewInit {

  @Input() lastikId: number;
  regiForm: FormGroup;

  // Lastik kopyala işlemi, rotasyon şeklinde yapılacaksa true olur.
  @Input() lastikKopyalaAktif: boolean = false;

  @Input() lastikPozisyonId: number;

  @Output() kaydet: EventEmitter<boolean> = new EventEmitter();

  constructor(public ngxSmartModalService: NgxSmartModalService, private fb: FormBuilder, private lastiklerService: LastiklerService,
    private lastikHareketlerService: LastikHareketlerService, private datePipe:DatePipe,
    private toastr: ToastrService) {
    this.regiForm = fb.group({
      'Tarih': [null, Validators.compose([Validators.required])],
      'SeriNumarasi': [null, Validators.compose([Validators.required])]
    });
  }

  ngAfterViewInit() {
    setTimeout(async () => {
      this.ngxSmartModalService.getModal('kopyala').open();

      let aracId = 0;

      await this.lastiklerService.getLastik(this.lastikId).toPromise().then(lastikResponse => {
        aracId = lastikResponse.AracID;
      });


      await this.lastikHareketlerService.getLastikHareketlerWithArac(this.lastikId, aracId).toPromise().then(async lastikHareketResponse => {
        let filter = await lastikHareketResponse[lastikHareketResponse.length - 1];

        let sonServisTarihi = this.datePipe.transform(String(filter.Tarih), 'yyyy-MM-dd');

        this.regiForm.controls["Tarih"].setValue(sonServisTarihi);

      });
    });
  }

  async onFormSubmit(form: { SeriNumarasi: string, Tarih: string }) {

    if (this.lastikKopyalaAktif) {

      let aracId = 0;

      await this.lastiklerService.getLastik(this.lastikId).toPromise().then(lastikResponse => {
        aracId = lastikResponse.AracID;
      });

      let trueFalse = true;

      await this.lastikHareketlerService.getLastikHareketlerWithArac(this.lastikId, aracId).toPromise().then(async lastikHareketResponse => {
        let filter = await lastikHareketResponse[lastikHareketResponse.length - 1];

        let sonServisTarihi = this.datePipe.transform(String(filter.Tarih), 'yyyy-MM-dd');

        if ((new Date(form.Tarih) < new Date(sonServisTarihi)) || (new Date() < new Date(form.Tarih))) {
          this.toastr.error("Servis tarihi, önceki servis tarihinden küçük olamaz. Günümüz tarihinden'de büyük olamaz.");
          trueFalse = false;
        }
      });

      if (!trueFalse) return false;

      // Eğer lastik rotasyondan kopyalanacaksa burası işlenir. Önce depoya, sonra araca olmak üzere 2 adımda tamamlanır.
      let rotasyonaKopyala = new LastikRotasyonaKopyala();
      rotasyonaKopyala.LastikID = this.lastikId;
      rotasyonaKopyala.Tarih = form.Tarih;
      rotasyonaKopyala.LastikPozisyonID = this.lastikPozisyonId;
      rotasyonaKopyala.SeriNo = form.SeriNumarasi;
      await this.lastiklerService.lastigiRotasyonaKopyala(rotasyonaKopyala).toPromise().then(rotasyonaKopyalaResponse => {
        if (rotasyonaKopyalaResponse.MessageType === 1) {
          this.toastr.success(rotasyonaKopyalaResponse.Message);
          // kayıt başarılı aşamalı olarak en baştaki component'teki kaydet eventini tetikletiyoruz.
          this.kaydet.next(true);
          this.ngxSmartModalService.getModal('kopyala').close();
        }
        else {
          if (rotasyonaKopyalaResponse.ErrorList !== undefined) {
            rotasyonaKopyalaResponse.ErrorList.forEach(item => {
              this.toastr.error(item.ErrorMessage);
            })
          }
          if (rotasyonaKopyalaResponse.Error !== "" && rotasyonaKopyalaResponse.Error !== undefined) {
            this.toastr.error(rotasyonaKopyalaResponse.Error);
          }
        }
      });
    }
    else {
      let lastikKopyala = new LastikKopyala();
      this.lastiklerService.getLastik(this.lastikId).subscribe(lastikResponse => {
        lastikKopyala.AsilLastikID = this.lastikId;
        lastikKopyala.DisSeviyesi = lastikResponse.DisSeviyesi;
        lastikKopyala.EbatID = lastikResponse.EbatID;
        lastikKopyala.FirmaID = lastikResponse.FirmaID;
        lastikKopyala.Fiyat = lastikResponse.Fiyat;
        lastikKopyala.LastikKilometre = lastikResponse.LastikKilometre;
        lastikKopyala.LastikKonumID = lastikResponse.LastikKonumID;
        lastikKopyala.LastikMarkaDesenID = lastikResponse.LastikMarkaDesenID;
        lastikKopyala.LastikMarkaID = lastikResponse.LastikMarkaID;
        lastikKopyala.LastikTipID = lastikResponse.LastikTipID;
        lastikKopyala.LastikTurID = lastikResponse.LastikTurID;

        lastikKopyala.KayitTarihi = form.Tarih;
        lastikKopyala.SeriNo = form.SeriNumarasi;

        this.lastiklerService.lastikKopyala(lastikKopyala).subscribe(lastikKopyalaResponse => {
          if (lastikKopyalaResponse.MessageType === 1) {
            this.toastr.success(lastikKopyalaResponse.Message);
            this.ngxSmartModalService.getModal('kopyala').close();
          }
          else {
            if (lastikKopyalaResponse.ErrorList !== undefined) {
              lastikKopyalaResponse.ErrorList.forEach(item => {
                this.toastr.error(item.ErrorMessage);
              })
            }
            if (lastikKopyalaResponse.Error !== "" && lastikKopyalaResponse.Error !== undefined) {
              this.toastr.error(lastikKopyalaResponse.Error);
            }
          }
        }, error => {
          this.toastr.error("Lütfen doldurulması gereken alanları doldurun. Sorun devam ederse, teknik desteğe başvurun.");
        })
      });
    }

  }

}
