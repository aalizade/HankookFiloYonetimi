import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LastikMarkaComponent } from './lastik-marka/lastik-marka.component';
import { EbatComponent } from './ebat/ebat.component';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { YukIndeksComponent } from './yuk-indeks/yuk-indeks.component';
import { YukIndeksEkleComponent } from './yuk-indeks/yuk-indeks-ekle/yuk-indeks-ekle.component';
import { YukIndeksGuncelleComponent } from './yuk-indeks/yuk-indeks-guncelle/yuk-indeks-guncelle.component';
import { HizIndeksComponent } from './hiz-indeks/hiz-indeks.component';
import { HizIndeksEkleComponent } from './hiz-indeks/hiz-indeks-ekle/hiz-indeks-ekle.component';
import { HizIndeksGuncelleComponent } from './hiz-indeks/hiz-indeks-guncelle/hiz-indeks-guncelle.component';
import { LastikTurComponent } from './lastik-tur/lastik-tur.component';
import { LastikTurEkleComponent } from './lastik-tur/lastik-tur-ekle/lastik-tur-ekle.component';
import { LastikTurGuncelleComponent } from './lastik-tur/lastik-tur-guncelle/lastik-tur-guncelle.component';
import { EbatEkleComponent } from './ebat/ebat-ekle/ebat-ekle.component';
import { EbatGuncelleComponent } from './ebat/ebat-guncelle/ebat-guncelle.component';
import { LastikMarkaEkleComponent } from './lastik-marka/lastik-marka-ekle/lastik-marka-ekle.component';
import { LastikMarkaGuncelleComponent } from './lastik-marka/lastik-marka-guncelle/lastik-marka-guncelle.component';
import { LastikMarkaDesenlerComponent } from './lastik-marka/lastik-marka-desenler/lastik-marka-desenler.component';
import { LastikMarkaDesenEkleComponent } from './lastik-marka/lastik-marka-desenler/lastik-marka-desen-ekle/lastik-marka-desen-ekle.component';
import { LastikMarkaDesenGuncelleComponent } from './lastik-marka/lastik-marka-desenler/lastik-marka-desen-guncelle/lastik-marka-desen-guncelle.component';
import { LastikMarkaDesenOzelliklerComponent } from './lastik-marka/lastik-marka-desen-ozellikler/lastik-marka-desen-ozellikler.component';
import { LastikMarkaDesenOzellikEkleComponent } from './lastik-marka/lastik-marka-desen-ozellikler/lastik-marka-desen-ozellik-ekle/lastik-marka-desen-ozellik-ekle.component';
import { LastikMarkaDesenOzellikGuncelleComponent } from './lastik-marka/lastik-marka-desen-ozellikler/lastik-marka-desen-ozellik-guncelle/lastik-marka-desen-ozellik-guncelle.component';
import { NgxMaskModule } from 'ngx-mask';
import { LastikComponent } from './lastik/lastik.component';
import { LastikEkleComponent } from './lastik/lastik-ekle/lastik-ekle.component';
import { LastikGuncelleComponent } from './lastik/lastik-guncelle/lastik-guncelle.component';
import { NgSelect2Module } from 'ng-select2';
import { LastikOlcumEkleComponent } from './lastik/lastik-olcum-ekle/lastik-olcum-ekle.component';
import { LastikHareketlerComponent } from './lastik/lastik-hareketler/lastik-hareketler.component';
import { HavaFarkTanimComponent } from './hava-fark-tanim/hava-fark-tanim.component';
import { HavaFarkTanimEkleComponent } from './hava-fark-tanim/hava-fark-tanim-ekle/hava-fark-tanim-ekle.component';
import { HavaFarkTanimGuncelleComponent } from './hava-fark-tanim/hava-fark-tanim-guncelle/hava-fark-tanim-guncelle.component';
 

@NgModule({
  declarations: [EbatComponent, LastikMarkaComponent,LastikMarkaEkleComponent, LastikMarkaGuncelleComponent, YukIndeksComponent, YukIndeksEkleComponent, YukIndeksGuncelleComponent, HizIndeksComponent, HizIndeksEkleComponent, HizIndeksGuncelleComponent, LastikTurComponent, LastikTurEkleComponent, LastikTurGuncelleComponent, EbatEkleComponent, EbatGuncelleComponent, LastikMarkaDesenlerComponent, LastikMarkaDesenEkleComponent, LastikMarkaDesenGuncelleComponent, LastikMarkaDesenOzelliklerComponent, LastikMarkaDesenOzellikEkleComponent, LastikMarkaDesenOzellikGuncelleComponent, LastikComponent, LastikEkleComponent, LastikGuncelleComponent, LastikOlcumEkleComponent, LastikHareketlerComponent, HavaFarkTanimComponent, HavaFarkTanimEkleComponent, HavaFarkTanimGuncelleComponent],
  imports: [
    CommonModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskModule.forChild(),
    NgSelect2Module,
    RouterModule.forChild([
      { path: "ebat", component: EbatComponent },
      { path: "ebat-ekle", component: EbatEkleComponent },
      { path: "ebat-guncelle/:ebatId", component: EbatGuncelleComponent },
      //
      { path: "lastik", component: LastikComponent },
      { path: "lastik-ekle", component: LastikEkleComponent },
      { path: "lastik-guncelle/:lastikId", component: LastikGuncelleComponent },
      { path: "lastik-olcum-ekle/:lastikId", component: LastikOlcumEkleComponent },
      { path: "lastik-hareketler/:lastikId", component: LastikHareketlerComponent },

      //
      { path: "lastik-marka", component: LastikMarkaComponent },
      { path: "lastik-marka-ekle", component: LastikMarkaEkleComponent },
      { path: "lastik-marka-guncelle/:lastikMarkaId", component: LastikMarkaGuncelleComponent },
      //
      { path: "lastik-marka-desenler/:lastikMarkaId", component: LastikMarkaDesenlerComponent },
      { path: "lastik-marka-desen-ekle/:lastikMarkaId", component: LastikMarkaDesenEkleComponent },
      { path: "lastik-marka-desen-guncelle/:lastikMarkaDesenId", component: LastikMarkaDesenGuncelleComponent }, 
      //
      { path: "lastik-marka-desen-ozellikler/:lastikMarkaDesenId", component: LastikMarkaDesenOzelliklerComponent },
      { path: "lastik-marka-desen-ozellik-ekle/:lastikMarkaDesenId", component: LastikMarkaDesenOzellikEkleComponent },
      { path: "lastik-marka-desen-ozellik-guncelle/:lastikMarkaDesenOzellikId", component: LastikMarkaDesenOzellikGuncelleComponent }, 
      // 
      { path: "yuk-indeks", component: YukIndeksComponent },
      { path: "yuk-indeks-ekle", component: YukIndeksEkleComponent },
      { path: "yuk-indeks-guncelle/:yukIndeksId", component: YukIndeksGuncelleComponent },
      //
      { path: "hiz-indeks", component: HizIndeksComponent },
      { path: "hiz-indeks-ekle", component: HizIndeksEkleComponent },
      { path: "hiz-indeks-guncelle/:hizIndeksId", component: HizIndeksGuncelleComponent },
      //
      { path: "lastik-tur", component: LastikTurComponent },
      { path: "lastik-tur-ekle", component: LastikTurEkleComponent },
      { path: "lastik-tur-guncelle/:lastikTurId", component: LastikTurGuncelleComponent },
       //
       { path: "hava-fark-tanim", component: HavaFarkTanimComponent },
       { path: "hava-fark-tanim-ekle", component: HavaFarkTanimEkleComponent },
       { path: "hava-fark-tanim-guncelle/:havaFarkId", component: HavaFarkTanimGuncelleComponent },
    ])
  ]
})
export class LazyLastikYonetimiModule { }
