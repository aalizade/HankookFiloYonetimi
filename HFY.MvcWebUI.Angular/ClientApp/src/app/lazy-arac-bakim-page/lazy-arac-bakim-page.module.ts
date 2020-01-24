import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { Layout1Component } from './layouts/layout1/layout1.component';
import { HomeComponent } from './components/arac-bakim/home/home.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
  declarations: [Layout1Component],
  imports: [
    CommonModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    RouterModule.forChild([
      {
        path: "", component: Layout1Component, children: [
          {
            path: 'arac-bakim',
            loadChildren: () => import('./components/arac-bakim/arac-bakim.module').then(m => m.AracBakimModule)
          },
        ]
      }
    ]),
    NgxSmartModalModule.forRoot(),
    NgxMaskModule.forRoot()
  ],
})
export class LazyAracBakimPageModule { }
