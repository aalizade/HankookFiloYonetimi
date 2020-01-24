import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ActivatedRoute } from '@angular/router';
import { AracKategorilerService } from 'src/app/lazy-general-page/services/backend-services/arac-kategoriler/arac-kategoriler.service';
import { AraclarService } from 'src/app/lazy-general-page/services/backend-services/araclar/araclar.service';
import { AracModellerService } from 'src/app/lazy-general-page/services/backend-services/arac-modeller/arac-modeller.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private route: ActivatedRoute, private araclarService: AraclarService, private aracModellerService: AracModellerService, private aracKategorilerService: AracKategorilerService) {
    let id = this.route.snapshot.params.aracId === undefined ? 0 : this.route.snapshot.params.aracId;
    if (isNaN(id)) {
      window.location.href = "/home";
    }
    else {
      this.araclarService.getArac(Number(id)).subscribe(response => {
        if (response["Error"] !== undefined) window.location.href = "/home";

        let ekUrlBilgileri = "";
        const urlParams = new URLSearchParams(window.location.search);
        let seriNo = String(urlParams.get('seriNo'));
        let aksPozisyonListName = String(urlParams.get('aksPozisyonListName'));
        let aksPozisyonId = Number(urlParams.get('aksPozisyonId'));
        let aksNumarasi = Number(urlParams.get('aksNumarasi'));

        if (seriNo !== undefined && seriNo !== "null") {
          ekUrlBilgileri = "?seriNo=" + seriNo +
            "&aksPozisyonListName=" + aksPozisyonListName + "&aksPozisyonId=" + aksPozisyonId + "&aksNumarasi=" + aksNumarasi
        }

        this.araclarService.aracErisimDogrulama(response.Plaka).toPromise().then(erisimDogrulaResponse => {
          if (erisimDogrulaResponse.MessageType === 1) {
            this.aracModellerService.getAracModel(response.ModelID).subscribe(aracModelResponse => {
              this.aracKategorilerService.getAracKategori(aracModelResponse.AracKategoriID).subscribe(aracKategoriResponse => {
                if (aracKategoriResponse.Ad.indexOf("Treyler") > -1) {
                  let parcala = aracKategoriResponse.Ad.split("'");
                  window.location.href = "/islemler/arac-bakim/arac/" + parcala[0] + "Treyler" + "/" + id + ekUrlBilgileri;
                }
                else {
                  window.location.href = "/islemler/arac-bakim/arac/" + aracKategoriResponse.Ad.toLowerCase() + "/" + id + ekUrlBilgileri;
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
      })

    }
  }
  aracKategori: string = "";

  MoviesList = [
    'The Far Side of the World',
    'Morituri',
    'Napoleon Dynamite',
    'Pulp Fiction',
    'Blade Runner',
    'Cool Hand Luke',
    'Heat',
    'Juice'
  ];

  MoviesWatched = [
  ];

  onDrop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }
  ngOnInit() {
  }

}
