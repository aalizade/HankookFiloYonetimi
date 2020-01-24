import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { RouterModule } from '@angular/router';
import { Layout1Component } from './layouts/layout1/layout1.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { NgSelect2Module } from 'ng-select2';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
  declarations: [HomeComponent, Layout1Component],
  imports: [
    CommonModule,
    DataTablesModule,
    NgSelect2Module,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot(),
    RouterModule.forChild([
      {
        path: "", component: Layout1Component, children: [
          { path: "", component: HomeComponent },
          { path: "home", component: HomeComponent },
          {
            path: 'arac-yonetimi',
            loadChildren: () => import('./components/arac-yonetimi/lazy-arac-yonetimi.module').then(m => m.LazyAracYonetimiModule)
          },
          {
            path: 'firma-yonetimi',
            loadChildren: () => import('./components/firma-yonetimi/lazy-firma-yonetimi.module').then(m => m.LazyFirmaYonetimiModule)
          },
          //ZAMANI GELECEK
          {
            path: 'ayarlar',
            loadChildren : () => import('./components/genel-ayarlar/lazy-genel-ayarlar.module').then(m => m.LazyGenelAyarlarModule)
          },
          {
            path: 'lastik-yonetimi',
            loadChildren: () => import('./components/lastik-yonetimi/lazy-lastik-yonetimi.module').then(m => m.LazyLastikYonetimiModule)
          },
          {
            path: 'raporlar',
            loadChildren: () => import('./components/raporlar/raporlar.module').then(m => m.RaporlarModule)
          },
        ]
      }
    ])
  ]
})
export class LazyGeneralPageModule { }