import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Layout1Component } from '../../layouts/layout1/layout1.component';
import { FirmaComponent } from './firma/firma.component';
import { FirmaEkleComponent } from './firma/firma-ekle/firma-ekle.component';
import { FirmaGuncelleComponent } from './firma/firma-guncelle/firma-guncelle.component';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import { IsletmeComponent } from './isletme/isletme.component';
import { SubeComponent } from './sube/sube.component';
import { KullanicilarComponent } from './firma/kullanicilar/kullanicilar.component';
import { KullaniciEkleComponent } from './firma/kullanicilar/kullanici-ekle/kullanici-ekle.component';
import { KullaniciGuncelleComponent } from './firma/kullanicilar/kullanici-guncelle/kullanici-guncelle.component';
import { KullaniciYetkiComponent } from './kullanici-yetki/kullanici-yetki.component';
import { KullaniciYetkiEkleComponent } from './kullanici-yetki/kullanici-yetki-ekle/kullanici-yetki-ekle.component';


@NgModule({
  declarations: [FirmaComponent, FirmaEkleComponent, FirmaGuncelleComponent, IsletmeComponent, SubeComponent, KullanicilarComponent, KullaniciEkleComponent, KullaniciGuncelleComponent, KullaniciYetkiComponent, KullaniciYetkiEkleComponent],
  imports: [
    CommonModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelect2Module,
    RouterModule.forChild([
      { path: "firma", component: FirmaComponent },
      { path: "firma-ekle/:rolTip", component: FirmaEkleComponent },
      { path: "firma-guncelle/:id", component: FirmaGuncelleComponent },
      //
      { path: "kullanicilar/:firmaId", component: KullanicilarComponent },
      { path: "kullanici-ekle/:firmaId", component: KullaniciEkleComponent },
      { path: "kullanici-guncelle/:id", component: KullaniciGuncelleComponent },
      //
      { path: "isletme", component: IsletmeComponent },
      //
      { path: "sube", component: SubeComponent },
      // ilgiliId, aslında ilgili firmaId'dir.
      { path: "kullanici-yetkiler/:ilgiliId", component: KullaniciYetkiComponent },
      { path: "kullanici-yetki-ekle/:ilgiliId", component: KullaniciYetkiEkleComponent },
    ])
  ]
})
export class LazyFirmaYonetimiModule { }
