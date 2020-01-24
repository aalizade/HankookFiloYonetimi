import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/lastik-bakim/home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: 'lastik-bakim',
        loadChildren: () => import('../lazy-lastik-bakim-page/components/lastik-bakim/lastik-bakim.module').then(m => m.LastikBakimModule)
      },
    ]),
    NgxSmartModalModule.forRoot(),
    NgxMaskModule.forRoot()
  ]
})
export class LazyLastikBakimPageModule { }
