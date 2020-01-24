import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AksPozisyonlarComponent } from './aks-pozisyonlar/aks-pozisyonlar.component';
import { RouterModule } from '@angular/router';
import { AksPozisyonEkleComponent } from './aks-pozisyonlar/aks-pozisyon-ekle/aks-pozisyon-ekle.component';
import { AksPozisyonGuncelleComponent } from './aks-pozisyonlar/aks-pozisyon-guncelle/aks-pozisyon-guncelle.component';
import { AracKategorilerComponent } from './arac-kategoriler/arac-kategoriler.component';
import { AracKategoriEkleComponent } from './arac-kategoriler/arac-kategori-ekle/arac-kategori-ekle.component';
import { AracKategoriGuncelleComponent } from './arac-kategoriler/arac-kategori-guncelle/arac-kategori-guncelle.component';
import { AracMarkalarComponent } from './arac-markalar/arac-markalar.component';
import { AracModellerComponent } from './arac-markalar/arac-modeller/arac-modeller.component';
import { AracMarkaEkleComponent } from './arac-markalar/arac-marka-ekle/arac-marka-ekle.component';
import { AracMarkaGuncelleComponent } from './arac-markalar/arac-marka-guncelle/arac-marka-guncelle.component';
import { AracModelEkleComponent } from './arac-markalar/arac-modeller/arac-model-ekle/arac-model-ekle.component';
import { AracModelGuncelleComponent } from './arac-markalar/arac-modeller/arac-model-guncelle/arac-model-guncelle.component';
import { NgSelect2Module } from 'ng-select2';
import { AksDuzenlerComponent } from './arac-kategoriler/aks-duzenler/aks-duzenler.component';
import { AksDuzenEkleComponent } from './arac-kategoriler/aks-duzenler/aks-duzen-ekle/aks-duzen-ekle.component';
import { AraclarComponent } from './araclar/araclar.component';
import { AracEkleComponent } from './araclar/arac-ekle/arac-ekle.component';
import { AracGuncelleComponent } from './araclar/arac-guncelle/arac-guncelle.component';

@NgModule({
  declarations: [AksPozisyonlarComponent, AksPozisyonEkleComponent, AksPozisyonGuncelleComponent, AracKategorilerComponent, AracKategoriEkleComponent, AracKategoriGuncelleComponent, AracMarkalarComponent, AracMarkaEkleComponent, AracMarkaGuncelleComponent, AracModellerComponent, AracModelEkleComponent, AracModelGuncelleComponent, AksDuzenlerComponent, AksDuzenEkleComponent, AraclarComponent, AracEkleComponent, AracGuncelleComponent],
  imports: [
    CommonModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelect2Module,
    RouterModule.forChild([
      { path: "aks-pozisyon", component: AksPozisyonlarComponent },
      { path: "aks-pozisyon-ekle", component: AksPozisyonEkleComponent },
      { path: "aks-pozisyon-guncelle/:id", component: AksPozisyonGuncelleComponent },
      //
      { path: "arac-kategori", component: AracKategorilerComponent },
      { path: "arac-kategori-ekle", component: AracKategoriEkleComponent },
      { path: "arac-kategori-guncelle/:id", component: AracKategoriGuncelleComponent },
      //
      //
      { path: "arac-marka", component: AracMarkalarComponent },
      { path: "arac-marka-ekle", component: AracMarkaEkleComponent },
      { path: "arac-marka-guncelle/:id", component: AracMarkaGuncelleComponent },
      //
      //
      { path: "arac-model/:aracMarkaId", component: AracModellerComponent },
      { path: "arac-model-ekle/:aracMarkaId", component: AracModelEkleComponent },
      { path: "arac-model-guncelle/:id", component: AracModelGuncelleComponent },
      //
      //
      { path: "aks-duzen/:aracKategoriId", component: AksDuzenlerComponent },
      { path: "aks-duzen-ekle/:aracKategoriId", component: AksDuzenEkleComponent },
      //
       //
       { path: "araclar", component: AraclarComponent },
       { path: "arac-ekle", component: AracEkleComponent },
       { path: "arac-guncelle/:aracId", component: AracGuncelleComponent },
       //
    ])
  ]
})
export class LazyAracYonetimiModule { }
